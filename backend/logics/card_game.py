from enum import Enum
import itertools
import random
from typing import Dict, List, Tuple
from fastapi.params import Path
from pydantic import BaseModel
from utils.my_log import LOG
from logics.game import Game
from logics.lobby import Lobby
from routes.coins import COINS # TODO add to BJ CTOR
import eval7

BLANK_CARD = ("xx", True) # True means showing the back

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

POKER_CARD_SYMBOLS = {
    Symbol.CLUBS: "c",
    Symbol.DIAMONDS : "d",
    Symbol.HEARTS : "h",
    Symbol.SPADES : "s",
}

POKER_CARD_VALUES = {
    2 : "2" ,
    3 : "3" ,
    4 : "4" ,
    5 : "5" ,
    6 : "6" ,
    7 : "7" ,
    8 : "8" ,
    9 : "9" ,
    10 : "T",
    11 : "J" ,
    12 : "Q" ,
    13 : "K" ,
    1 : "A" ,
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
    "A" : 11 
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
    
    def get_Poker_string(self):
        return POKER_CARD_VALUES[self.number] + POKER_CARD_SYMBOLS[self.symbol]


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
    
    def get_BJ_score(self):
        score = sum(card.get_BJ_value() for card in self.cards)
        aceCount = len([card for card in self.cards if card.number==1]) # 1 means ACE
        while score > 21 and aceCount > 0:
            score -= 10
            aceCount -= 1
            
        return score
    
    def get_Poker_score(self, board: 'Hand' = None):
        if board == None:
            raise Exception("cant get score without a board")
        
        card_list = self.to_poker_list_of_str() + board.to_poker_list_of_str()
        LOG(card_list)
        my_hand = [eval7.Card(s) for s in card_list]
        
        hand_evaluation = eval7.evaluate(my_hand)
        return hand_evaluation , eval7.handtype(hand_evaluation)
    
    
    
    def is_overdraft(self):
        return self.get_BJ_score() > 21 # BJ max hand value
    
    
    def to_list_of_str(self):
        return [str(card) for card in self.cards]
    
    def to_poker_list_of_str(self):
        return [card.get_Poker_string() for card in self.cards]
    
    def export(self, hidden=False):
        if hidden:
            return [BLANK_CARD] * len(self.cards)
        return [(card.get_Poker_string(), False) for card in self.cards] # False means show front (don't show back)


class CardGame(Game):
    def __init__(self, lobby: Lobby, max_players):
        self.deck = None
        self.usernames: List = None
        self.hands : Dict[str:Hand]  = {} # username : Hand
        self.status = GameStatus.NO_GAME
        self.lobby = lobby
        
    def is_started(self):
        return self.status == GameStatus.ONGOING
    
    def get_player_count(self):
        return len(self.usernames)

    def get_hand(self, username: str)-> List[Tuple[str, bool]]:
        return self.hands[username].export()
    
    def end_game(self):
        self.status = GameStatus.NO_GAME

    def get_player_num(self, username : str):
        return [i for i,x in enumerate(self.usernames) if x == username][0]
        
    def get_hands_for_show(self, username: str)-> Dict[str, List[Tuple[str, bool]]]:
        res = {}
        
        for (name,hand) in self.hands.items():
            if name != username:
                res[name] = hand.export(hidden=(self.status != GameStatus.NO_GAME))
                
        return res
    
    
    def start_game(self):
        if not self.status == GameStatus.NO_GAME:
            raise Exception("Game already started!")
        
        self.lobby.lock()
        self.status = GameStatus.ONGOING

        self.deck = Deck()
        for username in self.lobby.get_players():
            self.hands[username] = Hand(self.deck)
            
        self.usernames = self.lobby.get_players().copy()
            
        # self.lobby.kick_all_players()  

