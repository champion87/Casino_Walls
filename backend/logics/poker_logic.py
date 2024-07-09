from typing import Dict, List
from utils.my_log import LOG
from logics.lobby import Lobby
from routes.coins import COINS # TODO add to BJ CTOR
from logics.card_game import Hand, CardGame, GameStatus


class Poker(CardGame):
    def __init__(self, lobby: Lobby, max_players):
        super().__init__(lobby, max_players)
        self.is_out : Dict[str:bool]  = {} # username : did he fold
        self.standing : Dict[str:bool] = {} # username : did he stand
        self.pot: int = 0
        self.current_bet: int = 0
        self.current_player = 0
        self.board: Hand = None
        self.round_num: int = 0
        self.bets : Dict[str:int] = {}
    
    def end_game(self):
        super().end_game()
        
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
        '''Excepts if the game is already running'''
        super().start_game()
        
        self.board = Hand(self.deck)
        self.board.draw_to_hand().draw_to_hand()

        for username in self.usernames:
            self.is_out[username] = False
            self.standing[username] = False
            self.hands[username].draw_to_hand().draw_to_hand() # 2 initial cards in Poker

    
    # @return True iff all players except one are standing or out  
    def is_round_over(self):
        seen_one_not_standing = False
        
        for username in self.lobby.get_players():
            if not (self.is_out[username] or self.standing[username]):
                if seen_one_not_standing:
                    return False
                else:
                    seen_one_not_standing = True
        
        return True
    
    def get_board(self)-> Hand:
        return self.board
    
    def get_pot(self)-> int:
        return self.pot

    def get_current_bet(self)-> int:
        return self.current_bet
    
    def get_current_player(self)-> int:
        return self.current_player
    
    def stand(self, username: str) -> bool:
        if username != self.usernames[self.current_player]:
            return False
        
        if (self.bets[username] < self.current_bet):
            return False
        
        self.standing[username] = True

        if self.is_round_over():
            self.end_round()
        else:
            self.next_player()
        
        return True

    def call(self, username: str) -> bool:
        if username != self.usernames[self.current_player]:
            return False
        
        COINS[username] -= self.current_bet - self.bets[username]
        self.next_player()

        return True

    def my_raise(self, username: str, raise_amount: int = 10) -> int: # raise_amount is amount of money added to the current bet of the table
        if username != self.usernames[self.current_player]:
            return 0
        
        coins_to_deduce = min(self.current_bet - self.bets[username] + raise_amount, COINS[username])
        COINS[username] -= coins_to_deduce

        for player in self.lobby.get_players():
            self.standing[player] = False

        self.next_player()
        return coins_to_deduce

    
    def fold(self, username:str) -> bool:
        if username != self.usernames[self.current_player]:
            return False   
        if self.is_out[username]:
            return False
        self.is_out[username] = True
        
        if self.is_round_over():
            self.end_round()
        else:
            self.next_player()

        return True

    def end_round(self):
        for username in self.lobby.get_players():
            self.standing[username] = False
        if self.round_num == 4:
            self.end_game()
        else:
            self.board.draw_to_hand()
            self.round_num += 1

    def next_player(self):
        self.current_player = self.current_player % self.get_player_count()

        while self.is_out[self.current_player] or self.standing[self.current_player]:
            self.current_player = self.current_player % self.get_player_count()
        
        return 
