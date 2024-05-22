from enum import Enum
import itertools
import random
 
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

class BlackJack:
    def __init__(self):
        self.deck = Deck()
        self.hand = Hand(self.deck)
        self.hand.draw_to_hand().draw_to_hand() # 2 initial cards in BJ
        
    @property
    def BJ_sum(self):
        return self.hand.get_BJ_sum()
    
    def is_overdraft(self):
        return self.BJ_sum > 21 # BJ max hand value
    
    def to_json(self):
        return {
            "hand" : self.hand.to_list_of_str(),
            "sum" : self.BJ_sum,
            "end_game" : self.is_overdraft()
            }
        
    def draw(self):
        self.hand.draw_to_hand()
    

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
    
    def to_list_of_str(self):
        return [str(card) for card in self.cards]


