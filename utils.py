import numpy as np
import random

def all_poss():
    order = []

    for i in range(4, 7):
        for j in range(1, i):
            order += [i*10 + j]

    for i in range(1, 7):
        order += [11*i]

    order = [32, *order, 31, 21]
    return order


def beats(a, b):
    rolls = all_poss()
    place_a = rolls.index(a)
    place_b = rolls.index(b)

    return place_a >= place_b


def beaters(a):
    rolls = all_poss()
    place = rolls.index(a)
    return rolls[place:]


def win_prob(roll):
    poss_rolls = all_poss()

    place = poss_rolls.index(roll)

    if place is None:
        return f"Invalid Roll ({roll})"

    other_rolls = 0
    for i in range(place):
        if poss_rolls[i] % 11 == 0:
            other_rolls += 1
        else:
            other_rolls += 2

    p_win = 1 - (other_rolls / 36)

    return p_win
    # return f"{p_win :.2%}"


def roll_to_lose_rate():
    roll_win = {}

    for roll in all_poss():
        roll_win[roll] = (1-win_prob(roll))**2

    return roll_win

def gen_threshold(uniform=False):
    if uniform:
        return random.choice(all_poss())
    rates = roll_to_lose_rate()
    return random.choices(list(rates.keys()), list(rates.values()))[0]
