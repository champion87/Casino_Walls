from typing import Dict, List
from utils.my_log import LOG
from logics.lobby import Lobby
from routes.coins import COINS # TODO add to BJ CTOR
from logics.card_game import Hand, CardGame, GameStatus
import time

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
        self.phase : str = ""
        self.winners : List[str] = []
        self.win_state : str = ""
    
    def end_game(self, winner_by_fold = None):
        super().end_game()
        LOG("end_game called")
        best_score = 0
        best_hand = ""
        self.current_bet = 0
        winner_list : List[str] = []
        self.phase = "showdown"

        if winner_by_fold:
            for username in self.usernames:
                self.is_out[username] = True
                self.bets[username] = 0
            
            winner_list = [winner_by_fold]
        else:
            for username in self.usernames:
                if self.is_out[username]:
                    score = 0
                    hand_type = ""
                else:
                    self.is_out[username] = True # just to make sure
                    score , hand_type = self.hands[username].get_Poker_score(self.board)

                if score > best_score:
                    winner_list.clear()
                    winner_list.append(username)
                    best_score = score
                    best_hand = hand_type
                elif score == best_score:
                    winner_list.append(username)

        for winner in winner_list:
            COINS[winner] += self.pot // len(winner_list)
        
        self.winners = winner_list
        self.win_state = best_hand
        self.pot = 0

        
    def start_game(self):
        '''Excepts if the game is already running'''
        super().start_game()
        
        self.board = Hand(self.deck)
        self.phase = "deal"
        self.round_num = 0
        self.win_state = ""
        self.winners = []

        for username in self.usernames:
            self.is_out[username] = False
            self.standing[username] = False
            self.bets[username] = 0
            self.hands[username].draw_to_hand().draw_to_hand() # 2 initial cards in Poker

    
    # @return True iff all players except one are standing or out  
    def is_round_over(self):
        
        for username in self.usernames:
            if not (self.is_out[username] or self.standing[username]):
                return False
        
        return True
    
    def get_hands_for_show(self, username: str):
        res = {}
        if self.status == GameStatus.NO_GAME: # TODO make sure that this one isn't nonsense
            for (name,hand) in self.hands.items():
                res[name] = hand.to_list_of_str()
        else:
            for (name,hand) in self.hands.items():
                if name != username:
                    res[name] = len(hand.to_list_of_str()) * ["xxxx\n"*3]
                else:
                    res[name] = hand.to_list_of_str()
                
        return res
    
    def get_board(self)-> Hand:
        return self.board
    
    def get_winners(self)-> str:
        return self.winners
    
    def get_winning_hand(self)-> str:
        return self.win_state
    
    def get_users_coins(self)-> Dict[str,int]:
        return {username : COINS[username] for username in self.usernames}
    
    def get_pot(self)-> int:
        return self.pot

    def get_current_bet(self)-> int:
        return self.current_bet
    
    def get_current_player(self)-> int:
        return self.current_player
    
    def get_game_phase(self)-> int:
        return self.phase
    
    def get_player_bet(self, username) -> int:
        return self.bets[username]
    
    def get_current_player_name(self) -> int:
        return self.usernames[self.current_player]
    
    def get_bets(self):
        return self.bets
    
    def get_player_num(self, username: str) -> int:
        return super().get_player_num(username)
    
    def can_call(self, username) -> bool:
        if (self.current_bet == self.bets[username]) or (COINS[username] == 0):
            return False
        return True
    
    def can_check(self, username) -> bool:
        if ((self.bets[username] < self.current_bet) and (COINS[username] != 0)):
            return False
        return True
    
    def stand(self, username: str) -> bool:
        LOG("another check")
        if username != self.usernames[self.current_player] or self.is_out[username]:
            return False
        
        if ((self.bets[username] < self.current_bet) and (COINS[username] != 0)):
            return False
        
        self.standing[username] = True

        if self.is_round_over():
            self.end_round()
        else:
            self.next_player()
        
        return True

    def call(self, username: str) -> bool:
        if username != self.usernames[self.current_player] or self.is_out[username]:
            return False
        
        if self.current_bet == self.bets[username] or COINS[username] == 0:
            return False
        
        coins_to_reduce = min(self.current_bet - self.bets[username] , COINS[username])
        COINS[username] -= coins_to_reduce
        self.bets[username] += coins_to_reduce
        self.standing[username] = True
        self.pot += coins_to_reduce
        
        if self.is_round_over():
            self.end_round()
        else:
            self.next_player()

        return True 

    def my_raise(self, username: str, raise_amount: int = 10) -> int: # raise_amount is amount of money added to the current bet of the table
        if (username != self.usernames[self.current_player]) or (COINS[username] == 0) or (self.is_out[username]) or (raise_amount < 0):
            return 0
        
        if (raise_amount == 0):
            return self.stand(username)
        
        coins_to_reduce = min(self.current_bet - self.bets[username] + raise_amount, COINS[username])
        COINS[username] -= coins_to_reduce
        self.pot += coins_to_reduce
        self.bets[username] += coins_to_reduce
        self.current_bet = self.bets[username]

        for player in self.usernames:
            self.standing[player] = False

        self.standing[username] = True

        self.next_player()
        return coins_to_reduce

    
    def fold(self, username:str) -> bool:
        if username != self.usernames[self.current_player]:
            return False   
        if self.is_out[username]:
            return False
        self.is_out[username] = True
        
        seen_one_not_out = False
        not_standing_player = None

        for player in self.usernames:
            if not self.is_out[player]:
                if not seen_one_not_out:
                    seen_one_not_out = True
                    not_standing_player = player
                else:
                    break
        else:
            self.end_game(not_standing_player)
            return True
            
        if self.is_round_over():
            self.end_round()
        else:
            self.next_player()

        return True

    def end_round(self):
        for username in self.usernames:
            self.standing[username] = False
        
        if self.round_num == 3:
            self.phase = "showdown"
            self.end_game()
            return
        
        if self.round_num == 0:
            self.board.draw_to_hand().draw_to_hand()
            self.phase = "flop"
        elif self.round_num == 1:
            self.phase = "turn"
        else:
            self.phase = "river"
        self.board.draw_to_hand()
        
        self.round_num += 1
        self.current_player = self.get_player_count() - 1
        self.next_player()

    def next_player(self):
        self.current_player = (self.current_player + 1) % self.get_player_count()
        
        while self.is_out[self.usernames[self.current_player]]:
            LOG("next player")
            time.sleep(0.5)
            self.current_player = (self.current_player + 1) % self.get_player_count()

        LOG(self.current_player)
