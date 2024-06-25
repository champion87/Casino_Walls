from enum import Enum
import itertools
import random
from typing import Dict, List
from fastapi.params import Path
from pydantic import BaseModel
from utils.my_log import LOG
from logics.game import Game
from logics.lobby import Lobby
from routes.coins import COINS # TODO add to BJ CTOR


 





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

class BlackJack(Game): # One time game
    def __init__(self, lobby: Lobby, prize, max_players):
        self.deck = None
        # self.dealer = Hand()
        self.hands : Dict[str:Hand]  = {} # api_key : Hand
        self.is_finished : Dict[str:bool]  = {} # api_key : Hand
        self.status = GameStatus.NO_GAME
        self.lobby = lobby
        self.prize = prize
        
        
    def start_game(self):
        # TODO start game.
        # copied from start_game(). please check.
        self.status = GameStatus.ONGOING

        self.deck = Deck()
        # LOG("STARTING GAME!")
        for username in self.lobby.get_players():
            # LOG(f"{username=}")
            self.hands[username] = Hand(self.deck)
            self.is_finished[username] = False
            self.hands[username].draw_to_hand().draw_to_hand() # 2 initial cards in BJ
            
        # for key in LOBBY1:
        #     USERS[key].black_jack = bj
        #     USERS[key].decrease_coins(
        #         fee
        #     )  # TODO this won't decrease ANY coins if the player doesn't have any. Ignoring this problem for now
    
        
    # @return List of apikeys of the winners and the prize
    def end_game(self):
        self.status = GameStatus.NO_GAME
        max_score = 0
        
        for hand in self.hands.values():
            max_score = max(max_score, hand.get_BJ_score())
            
        winners = [username for username in self.lobby.get_players() if self.hands[username].get_BJ_score() == max_score]
        
        # LOG("done BJ.end_game()")
        return winners, self.prize
    
        
    def is_overdraft(self, username:str):
        return self.hands[username].is_overdraft()
    
    def check_game_over(self):
        if self.is_game_over():
            self.status = GameStatus.NO_GAME
    
    # @return True iff all hands are done
    def is_game_over(self):
        
        # LOG("finished:" + str(self.is_finished))
        for out in self.is_finished.values():
            if not out:
                return False
        return True    
    
    def get_hand(self, username: str):
        return self.hands[username].to_list_of_str()
    
    def get_score(self, username: str) -> List[str]:
        # LOG(f"{self.hands=}")
        # LOG(f"{self.lobby.get_players()=}")
        return self.hands[username].get_BJ_sum()
    
    def get_player_json(self, username:str):
        return {
            "hand" : self.hands[username].to_list_of_str(),
            "sum" : self.hands[username].get_BJ_sum(),
            "finish_state" : self.hands[username].is_overdraft()
            }
    
    def to_json(self):
        return {
            "hands" : [hand.to_list_of_str() for hand in self.hands],
            "sums" : [hand.get_BJ_sum() for hand in self.hands],
            "finish_statuses" : [hand.is_overdraft for hand in self.hands],
            "end_game" : self.is_overdraft()
            }
        
    def draw(self, username:str):
        if self.is_finished[username]:
            raise Exception(f"Player <{username}> is out! Can't draw a card!")
        self.hands[username].draw_to_hand()
        if self.hands[username].is_overdraft():
            self.is_finished[username] = True
    
    def fold(self, username:str):
        if self.is_finished[username]:
            raise Exception(f"Player <{username}> is out! Can't fold!")
        self.is_finished[username] = True
       
    

class Card:
    def __init__(self, symbol: Symbol, number: int):
        self.symbol = symbol
        self.number = number
        
    def __str__(self):
        return CARD_VALUES[self.number] + CARD_SYMBOLS[self.symbol]
    
    def __repr__(self):
        return self.__str__()
    
    def get_BJ_value(self):
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
        score = sum(card.get_BJ_value() for card in self.cards)
        aceCount = len([card for card in self.cards if card.number==1]) # 1 means ACE
        while score > 21 and aceCount > 0:
            score -= 10
            aceCount -= 1
            
        return score
    
    def get_BJ_score(self):
        return self.get_BJ_sum() if not self.is_overdraft() else 0
    
    def is_overdraft(self):
        return self.get_BJ_sum() > 21 # BJ max hand value
    
    
    def to_list_of_str(self):
        return [str(card) for card in self.cards]


