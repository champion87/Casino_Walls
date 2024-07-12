# from card_game import *
import eval7

# deck = eval7.Deck()
# deck.shuffle()
# hand = deck.deal(7)
# eval7.evaluate(hand)

# eval7.handtype(17025648)


# hand = [eval7.Card(s) for s in ('As', '2c', '3d', '5s', '4c')]
# eval7.evaluate(hand)

# let E be an enum set of all possible hands. i.e : fullHouse=10, triple=9, pair=8 , etc
# E1>E2 if and only if the E1 hand is better than the E2 hand

# let 'prob' be a dictionary where keys are the enum hands and values are the probability of them occuring

TOTAL_COINS = 100  # assumption: each player has exactly TOTAL_COINS coins in the lobby
# the players are listed, the bot is indexed 0 and the rest are according to the order of play
IN_GAME = []  # IN_GAME[i] is a boolean of wether player number i is still in the game
BET = []  # BET[i] is a number representing how much money player number i bet so far.


def move(index, i):
    pass


HAND = 1


from time import perf_counter as pc

if __name__ == "__main__":
    N = 100000  # 47 * 46 * 45 * 44
    # print(N)
    M = 10**8
    p0 = pc()
    counter = 0
    deck = eval7.Deck()
    for _ in range(N):
        # deck = eval7.Deck()
        # deck.shuffle()
        hand = deck.deal(2)
        # counter = (counter + eval7.evaluate(hand)) % (M)
    print(f"counter: {counter}")
    print(f"time: {pc()-p0}")
    # eval7.evaluate(hand)
