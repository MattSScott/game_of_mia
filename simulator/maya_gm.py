import random
from tabnanny import verbose
from maya_player import Player, MoveSet
from utils import beats, gen_threshold


class GameMaster:
    def __init__(self, total_players, verbose):
        self.verbose = verbose
        self.total_players = total_players
        self.active_player = 0
        self.players = self.gen_players()
        self.curr_max = 0
        self.prev_roll = 0

    def gen_players(self):
        players = []
        for _ in range(self.total_players):
            player = Player(random.uniform(0,1), gen_threshold(True), verbose=self.verbose)
            players.append(player)
            if self.verbose:
                print(f"{player.name} has a lie prob of {player.lie_prob:.2%} and a call threshold of {player.threshold}")
        if self.verbose:
            print("\n     ~~~~~~~~~~~~    \n")
        return players

    def request_action(self):
        active_player = self.players[self.active_player]
        selected_move, response = active_player.submit_move(self.curr_max)
        self.process_action(selected_move, response)
        if self.verbose:
            print(f"Prev Roll: {active_player.prev_roll}, Curr Max: {self.curr_max}")
        self.active_player = (self.active_player + 1) % self.total_players

    def dec_player(self, player, amt):
        player.decrement_lives(amt)
        if self.verbose:
            print(f"{player.name} lost a life ({player.lives + amt} -> {player.lives})")
        if player.lives <= 0:
            self.players.remove(player)
            if self.verbose:
                print(f"{player.name} died")
            self.total_players -= 1
        self.curr_max = 0
        if self.verbose:
            print()

    def process_action(self, move, response):
        if move == MoveSet.ROLL:
            self.curr_max = response
        else:
            active_player = self.players[self.active_player]
            prev_index = (self.active_player +
                          self.total_players - 1) % self.total_players
            prev_player = self.players[prev_index]
            amt = 1
            if prev_player.prev_roll == 21 or self.curr_max == 21:
                amt = 2
            if beats(prev_player.prev_roll, self.curr_max):
                self.dec_player(active_player, amt)
            else:
                self.dec_player(prev_player, amt)

    def run(self):
        while len(self.players) > 1:
            self.request_action()
        if self.verbose:
            print(f"{self.players[0].name} won the game!")
        return self.players[0]
