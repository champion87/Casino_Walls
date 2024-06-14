from enum import Enum
import itertools
import random
from typing import Dict, List
from fastapi.params import Path
from pydantic import BaseModel
from ..utils.my_log import LOG
from .game import Game
 





class Symbol(Enum):
    CLUBS = 1
    DIAMONDS = 2
    HEARTS = 3
    SPADES = 4

CARD_SYMBOLS = {
    Symbol.CLUBS: "♣",
    Symbol.DIAMONDS : "♦",
    Symbol.HEARTS : "♥",
    Symbol.SPADES : "♠",
}

BJ_CARD_VALUES = {
    "2" : 2 ,
    "3" : 3 ,
    "4" : 4 ,
    "5" : 5 ,
    "6" : 6 ,
    "7" : 7 ,
    "8" : 8 ,
    "9" : 9 ,
    "10" : 10 ,
    "J" : 10 ,
    "Q" : 10 ,
    "K" : 10 ,
    "A" : 11 # TODO
}

CARD_VALUES = {
    2 : "2" ,
    3 : "3" ,
    4 : "4" ,
    5 : "5" ,
    6 : "6" ,
    7 : "7" ,
    8 : "8" ,
    9 : "9" ,
    10 : "10",
    11 : "J" ,
    12 : "Q" ,
    13 : "K" ,
    1 : "A" ,
}

class GameStatus(Enum):
    ONGOING = 1
    NO_GAME = 2

class BlackJack(Game):
    def __init__(self, api_keys:List[str], prize=0):
        self.deck = None
        self.hands : Dict[str:Hand]  = {} # api_key : Hand
        self.is_finished : Dict[str:bool]  = {} # api_key : Hand
        self.status = GameStatus.NO_GAME
        self.player_keys = api_keys
        self.prize = prize
    
    # @return List of apikeys of the winners and the prize
    def end_game(self):
        self.status = GameStatus.NO_GAME
        max_score = 0
        
        for hand in self.hands.values():
            max_score = max(max_score, hand.get_BJ_score())
            
        winners = [api_key for api_key in self.player_keys if self.hands[api_key].get_BJ_score() == max_score]
        
        LOG("done BJ.end_game()")
        return winners, self.prize
    
    def start_game(self):
        LOG("In start_game")
        self.status = GameStatus.ONGOING
        self.deck = Deck()
        for key in self.player_keys:
            self.hands[key] = Hand(self.deck)
            self.is_finished[key] = False
            self.hands[key].draw_to_hand().draw_to_hand() # 2 initial cards in BJ
        
    def is_overdraft(self, api_key:str):
        return self.hands[api_key].is_overdraft()
    
    # @return True iff all hands are done
    def is_game_over(self):
        
        LOG("finished:" + str(self.is_finished))
        for out in self.is_finished.values():
            if not out:
                return False
        return True    
    
    def get_player_json(self, api_key:str):
        return {
            "hand" : self.hands[api_key].to_list_of_str(),
            "sum" : self.hands[api_key].get_BJ_sum(),
            "finish_state" : self.hands[api_key].is_overdraft()
            }
    
    def to_json(self):
        return {
            "hands" : [hand.to_list_of_str() for hand in self.hands],
            "sums" : [hand.get_BJ_sum() for hand in self.hands],
            "finish_statuses" : [hand.is_overdraft for hand in self.hands],
            "end_game" : self.is_overdraft()
            }
        
    def draw(self, api_key:str):
        self.hands[api_key].draw_to_hand()
        if self.hands[api_key].is_overdraft():
            self.is_finished[api_key] = True
            
        LOG(self.hands)
        LOG("heelo")
        # else:
            # self.is_finished[api_key] = False
    

class Card:
    def __init__(self, symbol, number):
        self.symbol = symbol
        self.number = number
        
    def __str__(self):
        return CARD_VALUES[self.number] + CARD_SYMBOLS[self.symbol]
    
    def __repr__(self):
        return self.__str__()
    
    def get_BJ_value(self, is_overdraft: bool = False):
        if is_overdraft and self.number == 1:
            return 1 # Ace
        else:
            return BJ_CARD_VALUES[CARD_VALUES[self.number]]


NEW_DECK = [Card(symb, num) for (symb, num) in itertools.product(CARD_SYMBOLS.keys(), CARD_VALUES.keys())]
# print(len(NEW_DECK))


class Deck:
    def __init__(self):
        self.num_redraws = 0
        self.reset_deck()

    def reset_deck(self):
        self.cards = NEW_DECK.copy()
        random.shuffle(self.cards)
        self.num_redraws += 1
        
    def is_empty(self):
        return len(self.cards) == 0
        
    def draw_card(self) -> Card:
        if self.is_empty():
            self.reset_deck()
        return self.cards.pop()
        
class Hand:
    def __init__(self, deck: Deck = None):
        self.deck = deck
        self.cards : list[Card] = [] # TODO typing: list[Card]
        
    # 'from_deck=None' for default deck.
    def draw_to_hand(self, from_deck=None):
        if from_deck == None:
            if self.deck == None:
                raise Exception("No deck assigned to hand, please specify a deck for draw.")
            from_deck = self.deck
        
        self.cards.append(from_deck.draw_card())
        return self
    
    def get_BJ_sum(self):
        return sum(card.get_BJ_value() for card in self.cards)
        return 69 # TODO Aces
    
    def get_BJ_score(self):
        return self.get_BJ_sum() if not self.is_overdraft() else 0
    
    def is_overdraft(self):
        return self.get_BJ_sum() > 21 # BJ max hand value
    
    
    def to_list_of_str(self):
        return [str(card) for card in self.cards]


