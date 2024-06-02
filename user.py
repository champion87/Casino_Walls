import card_game

NO_GAME = 69

class User:
    def __init__(self, name, password):
        self.name = name
        self.password = password
        self.coins = 100
        self.black_jack : card_game.BlackJack = NO_GAME
        self.wheel = NO_GAME
        
    # @return True if can pay the fee, False otherwise
    def decrease_coins(self, fee) -> bool:
        if self.coins < fee:
            return False
        else:
            self.coins -= fee
            return True
        
    def increase_coins(self, fee):
        self.coins += fee
        
    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.__str__()