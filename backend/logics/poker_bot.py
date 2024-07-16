import eval7
from poker_logic import Poker
from random import sample, random
from routes.coins import COINS

# game.can_check()
# game.can_fold()
# game.can_call()
# game.get_unfolded_players_count()
# game.initial_money

deck_strings = "2c,3c,4c,5c,6c,7c,8c,9c,Tc,Jc,Qc,Kc,Ac,2d,3d,4d,5d,6d,7d,8d,9d,Td,Jd,Qd,Kd,Ad,2h,3h,4h,5h,6h,7h,8h,9h,Th,Jh,Qh,Kh,Ah,2s,3s,4s,5s,6s,7s,8s,9s,Ts,Js,Qs,Ks,As".split(
    ","
)

deck = [eval7.Card(s) for s in deck_strings]


def get_unfolded_players_count(game: Poker):
    count_unfolded = 0
    for username in game.usernames:
        if not game.is_out[username]:
            count_unfolded += 1
    return count_unfolded


NUM_OF_ITERATIONS = 200000


def chance_to_win(board: list[str], my_hand: list[str], num_of_players: int):
    board_size = len(board)
    board_cards = [eval7.Card(s) for s in board]
    my_hand_cards = [eval7.Card(s) for s in my_hand]
    me_and_board_cards = board_cards + my_hand_cards
    sampled_deck = deck.copy()
    for card in me_and_board_cards:
        sampled_deck.remove(card)
    count_wins = 0
    slice_index = board_size - 5
    for _ in range(NUM_OF_ITERATIONS):
        samp = sample(sampled_deck, 5 - board_size + 2 * num_of_players)
        enemy_samp_list = [samp[2 * i : 2 * (i + 1)] for i in range(num_of_players)]
        board_samp = samp[slice_index:] if slice_index < 0 else []
        my_total_hand = me_and_board_cards + board_samp
        my_score = eval7.evaluate(my_total_hand)
        total_board_cards = board_cards + board_samp
        if all(
            [
                eval7.evaluate(enemy_samp + total_board_cards) < my_score
                for enemy_samp in enemy_samp_list
            ]
        ):
            count_wins += 1

    c = count_wins / NUM_OF_ITERATIONS
    if num_of_players == 1:
        expected = 0.4794705
    if num_of_players == 2:
        expected = 0.318296
    if num_of_players == 3:
        expected = 0.236476
    if num_of_players == 4:
        expected = 0.187932
    if num_of_players == 5:
        expected = 0.15536
    else:
        expected = 1 / (num_of_players + 1)
    return (
        c - expected + 1 / (num_of_players + 1)
    )  # my_chance to win against all players


def default_move(game: Poker, user: str, to_fold: bool):
    if game.can_check(user):
        game.stand(user)
        return True
    elif to_fold and game.can_fold(user):
        game.fold(user)
        return True
    elif game.can_call(user):
        game.call(user)
        return True

    return False


def move(game: Poker):
    num_of_unfolded_players = get_unfolded_players_count(game) - 1
    user = game.get_current_player_name()
    my_money = game.initial_money(user)
    my_hand = game.get_hand(user).to_poker_list_of_str()
    board = game.get_board().to_poker_list_of_str()
    current_bet = game.get_current_bet()
    my_bet = game.get_bets()[user]

    chance = chance_to_win(board, my_hand, num_of_unfolded_players)
    expected = 1 / (num_of_unfolded_players + 1)
    rate = chance / expected
    t = (current_bet - my_bet) / my_money
    prob_to_raise = rate * (2 * rate - 1) / 6 * (1 - t)
    r = random()
    if r < prob_to_raise:  # raise!
        raise_amount = my_money * rate * (1 - t) ** 2 / 10
        game.my_raise(raise_amount)
        return
    # didn't raise:
    if game.can_check(user):
        game.check(user)
        return
    r = random()
    prob_to_fold = 1 - rate * (rate - 1.2 * t) * (2 - t) / 2.4
    to_fold = r < prob_to_fold
    default_move(game, user, to_fold)
    return
