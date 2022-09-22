import random
from enum import Enum
from utils import beats, beaters
from string import ascii_lowercase


class MoveSet(Enum):
    ROLL = 0
    CALL = 1


class Player:
    def __init__(self, lie_prob, threshold, verbose):
        self.lives = 6
        self.lie_prob = lie_prob
        self.prev_roll = 0
        self.name = self.gen_name()
        self.threshold = threshold
        self.verbose = verbose

    def gen_name(self):
        name_len = random.randint(3, 6)
        vowels = ['a', 'e', 'i', 'o', 'u']
        consonants = [x for x in ascii_lowercase if x not in vowels]
        name = ""
        for i in range(name_len):
            if i % 2 == 0:
                name += random.choice(consonants)
            else:
                name += random.choice(vowels)
        return name

    def roll(self):
        r1 = random.randint(1, 6)
        r2 = random.randint(1, 6)

        higher = max(r1, r2)
        lower = min(r1, r2)

        score = higher*10 + lower

        self.prev_roll = score

        return score

    def submit_move(self, curr_max):
        if curr_max == 0:  # new turn
            self.roll()
            if self.verbose:
                print(f'{self.name} started and rolled {self.prev_roll}')
            return (MoveSet.ROLL, self.prev_roll)

        if beats(curr_max, self.threshold):
            if self.verbose:
                print(f'{self.name} called on {curr_max}')
            return (MoveSet.CALL, -1)
        self.roll()
        if self.verbose:
            print(f'{self.name} rolled and got {self.prev_roll}')
        if beats(self.prev_roll, curr_max):
            # ToDo - lie even if beats?
            return (MoveSet.ROLL, self.prev_roll)
        else:
            if random.random() < self.lie_prob:
                lie = random.choice(beaters(curr_max))
                if self.verbose:
                    print(f'{self.name} lied and said {lie}')
                return (MoveSet.ROLL, lie)
            # reroll
            self.roll()
            if self.verbose:
                print(f'{self.name} rerolled and got {self.prev_roll}')
            return (MoveSet.ROLL, curr_max)

    def decrement_lives(self, n):
        self.lives = max(self.lives - n, 0)
