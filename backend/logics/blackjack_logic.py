from typing import Dict, List
from utils.my_log import LOG
from logics.lobby import Lobby
from routes.coins import COINS # TODO add to BJ CTOR
from logics.card_game import Hand, CardGame, GameStatus


class BlackJack(CardGame):
    def __init__(self, lobby: Lobby, prize, max_players):
        super().__init__(lobby, max_players)
        self.dealer_hand : Hand = None
        self.is_out : Dict[str:bool]  = {} 
        self.prize = prize
    
    def end_game(self):
        super().end_game()
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
                
        
   
    def start_game(self):
        '''Excepts if some player doesn't have enough money or if the game is already running'''
        
        for username in self.lobby.get_players():
            if COINS[username] < self.prize:
                return True # failure #TODO raise exception
        
        super().start_game()  
          
        for username in self.usernames: #TODO self vs super()? i think that 'self' will do...
            COINS[username] -= self.prize
            self.is_out[username] = False
            self.hands[username].draw_to_hand().draw_to_hand() # 2 initial cards in BJ
            
        self.dealer_hand = Hand(self.deck)
        self.dealer_hand.draw_to_hand().draw_to_hand()
        
        while self.dealer_hand.get_BJ_score() < 17:
            self.dealer_hand.draw_to_hand()
           
            
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
