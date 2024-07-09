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
import eval7

 





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
        return CARD_VALUES[self.number] + POKER_CARD_SYMBOLS[self.symbol]


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
        my_hand = [eval7.Card(s) for s in card_list]
            
        return eval7.evaluate(my_hand)
    
    
    
    def is_overdraft(self):
        return self.get_BJ_score() > 21 # BJ max hand value
    
    
    def to_list_of_str(self):
        return [str(card) for card in self.cards]
    
    def to_poker_list_of_str(self):
        return [card.get_Poker_string() for card in self.cards]




class BlackJack(Game):
    def __init__(self, lobby: Lobby, prize, max_players):
        self.deck = None
        self.usernames: List = None
        self.hands : Dict[str:Hand]  = {} # username : Hand
        self.dealer_hand : Hand = None
        self.is_out : Dict[str:bool]  = {} # username : Hand
        self.status = GameStatus.NO_GAME
        self.lobby = lobby
        self.prize = prize
    
    def is_started(self):
        return self.status == GameStatus.ONGOING
    
    def end_game(self):
        self.status = GameStatus.NO_GAME
        dealer_score = self.dealer_hand.get_BJ_score()
        
        for username in self.usernames:
            if not self.is_out[username]: # just to make sure
                LOG("WTFFFFFFF")
            score = self.hands[username].get_BJ_score()
            score = -1 if score>21 else score
            dealer_score = 0 if dealer_score>21 else dealer_score
            LOG(f"{score=}")
            if score > dealer_score:
                COINS[username] += self.prize + self.prize # one for the payback, one is the extra prize
            elif score == dealer_score:
                COINS[username] += self.prize # just the payback
                
        LOG(COINS)   
    #     max_score = 0
        
    #     for hand in self.hands.values():
    #         max_score = max(max_score, hand.get_BJ_score())
            
    #     winners = [username for username in self.lobby.get_players() if self.hands[username].get_BJ_score() == max_score]
        
    #     # LOG("done BJ.end_game()")
    #     return winners, self.prize
        
    def get_hands_for_show(self, username: str):
        res = {}
        
        if self.is_game_over():
            for (name,hand) in self.hands.items():
                if name != username:
                    res[name] = hand.to_list_of_str()
        else:
            for (name,hand) in self.hands.items():
                if name != username:
                    res[name] = len(hand.to_list_of_str()) * ["xxxx\n"*3]
                
        return res
        
        
    def start_game(self):
        '''return True if some player doesn't have enough money, False upon success.
        Excepts if the game is already running'''
        
        if not self.status == GameStatus.NO_GAME:
            raise Exception("Game already started!")
        
        for username in self.lobby.get_players():
            if COINS[username] < self.prize:
                return True # failure
        for username in self.lobby.get_players():
            COINS[username] -= self.prize
            
        self.lobby.lock()
        self.status = GameStatus.ONGOING

        self.deck = Deck()
        for username in self.lobby.get_players():
            self.hands[username] = Hand(self.deck)
            self.is_out[username] = False
            self.hands[username].draw_to_hand().draw_to_hand() # 2 initial cards in BJ
            
        self.usernames = self.lobby.get_players().copy()
            
        self.dealer_hand = Hand(self.deck)
        self.dealer_hand.draw_to_hand().draw_to_hand()
        
        while self.dealer_hand.get_BJ_score() < 17:
            self.dealer_hand.draw_to_hand()
            
        self.lobby.kick_all_players()    
            
        return False # success
            
    def abort(self, username: str):
        self.hands.pop(username)
        self.is_out.pop(username)
        self.check_game_over()
        
    def is_overdraft(self, username:str):
        return self.hands[username].is_overdraft()
    
    def check_game_over(self):
        if self.is_game_over():
            self.status = GameStatus.NO_GAME
    
    # @return True iff all hands are done
    def is_game_over(self):
        for out in self.is_out.values():
            if not out:
                return False
        return True    
    
    def get_hand(self, username: str)-> Hand:
        return self.hands[username]
    
    def get_dealer_hand(self) -> Hand:
        return self.dealer_hand
    
    def get_score(self, username: str) -> List[str]:
        return self.hands[username].get_BJ_score()
    
    def draw(self, username:str):
        if self.is_out[username]:
            raise Exception(f"Player <{username}> is out! Can't draw a card!")
        self.hands[username].draw_to_hand()
        if self.hands[username].is_overdraft():
            self.is_out[username] = True
            LOG(f"{username} DRAWWWW")
            
        
        if self.is_game_over():
            LOG("game over draw")
            self.end_game()
    
    def fold(self, username:str):
        if self.is_out[username]:
            raise Exception(f"Player <{username}> is out! Can't fold!")
        self.is_out[username] = True
        LOG(f"{username} FOLDDDD")
        
        if self.is_game_over():
            LOG("game over fold")
            self.end_game()

        
    def get_player_json(self, username:str):
        return {
            "hand" : self.hands[username].to_list_of_str(),
            "sum" : self.hands[username].get_BJ_score(),
            "finish_state" : self.hands[username].is_overdraft()
            }
    
    def to_json(self):
        return {
            "hands" : [hand.to_list_of_str() for hand in self.hands],
            "sums" : [hand.get_BJ_score() for hand in self.hands],
            "finish_statuses" : [hand.is_overdraft for hand in self.hands],
            "end_game" : self.is_overdraft()
            }



class Poker(Game):
    def __init__(self, lobby: Lobby, max_players):
        self.deck = None
        self.hands : Dict[str:Hand]  = {} # username : Hand
        self.is_out : Dict[str:bool]  = {} # username : did he fold
        self.status = GameStatus.NO_GAME
        self.lobby = lobby
        self.pot = 0
        self.current_bet = 0
        self.board = None
        self.round_num = 0
        self.bets : Dict[str:int] = {}
        self.standing : Dict[str:bool] = {} # username : did he stand
    
    def end_game(self):
        self.status = GameStatus.NO_GAME
        best_score = 0
        winner_list = []

        for username in self.lobby.get_players():
            if self.is_out[username]:
                score = 0
            else:
                self.is_out[username] = True # just to make sure
                score = self.hands[username].get_Poker_score(self.board)

            if score > best_score:
                winner_list.clear()
                winner_list.append(username)
                best_score = score
            elif score == best_score:
                winner_list.append(username)

        for winner in winner_list:
            COINS[winner] += self.pot // len(winner_list)
        
    def start_game(self):
        '''return True if some player doesn't have enough money, False upon success.
        Excepts if the game is already running'''
        
        if not self.status == GameStatus.NO_GAME:
            raise Exception("Game already started!")
        
        self.status = GameStatus.ONGOING

        self.deck = Deck()
        self.board = Hand(self.deck)

        for username in self.lobby.get_players():
            self.hands[username] = Hand(self.deck)
            self.is_out[username] = False
            self.standing[username] = False
            self.hands[username].draw_to_hand().draw_to_hand() # 2 initial cards in Poker
            
        return False # success
    
    def check_game_over(self):
        if self.is_game_over():
            self.status = GameStatus.NO_GAME
    
    # @return True iff all players are standing or out  
    def is_round_over(self):
        
        for username in self.lobby.get_players():
            if not (self.is_out[username] or self.standing[username]):
                return False
        
        return True
    
    def get_hand(self, username: str)-> Hand:
        return self.hands[username]
    
    def get_board(self)-> Hand:
        return self.board
    
    def stand(self, username: str):
        if (self.bets[username] < self.current_bet):
            return False
        
        self.standing[username] = True

        if self.is_round_over():
            self.end_round()

    def call(self, username: str):
        COINS[username] -= self.current_bet - self.bets[username]

    def my_raise(self, username: str, raise_amount: int = 10): # raise_amount is amount of money added to the current bet of the table
        COINS[username] -= self.current_bet - self.bets[username] + raise_amount

        for player in self.lobby.get_players():
            self.standing[player] = False

    
    def fold(self, username:str):
        LOG(COINS)   
        if self.is_out[username]:
            raise Exception(f"Player <{username}> is out! Can't fold!")
        self.is_out[username] = True
        
        if self.is_round_over():
            self.end_round()

    def end_round(self):
        for username in self.lobby.get_players():
            self.standing[username] = False
        if self.round_num == 4:
            self.end_game()
        else:
            self.board.draw_to_hand()
            self.round_num += 1

        
    def get_player_json(self, username:str):
        return {
            "hand" : self.hands[username].to_list_of_str(),
            "score" : self.hands[username].get_Poker_score(),
            }
    
    def to_json(self):
        return {
            "hands" : [hand.to_list_of_str() for hand in self.hands],
            "scores" : [hand.get_Poker_score() for hand in self.hands],
            }
    
    def get_player_amount(self):
        return len(self.lobby.get_players())
