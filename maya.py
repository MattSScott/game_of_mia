from maya_gm import GameMaster
import matplotlib.pyplot as plt
import numpy as np
from tqdm import tqdm
from utils import all_poss

iters = 1000
players = 1000

best_thresh = {}

for p in all_poss():
    best_thresh[str(p)] = 0


def main():
    best_prob = np.empty(iters)

    for i in tqdm(range(iters)):
        game_master = GameMaster(players, False)
        winner = game_master.run()
        best_thresh[str(winner.threshold)] += 1
        best_prob[i] = winner.lie_prob
    _, axes = plt.subplots(1, 2)
    axes[0].bar(best_thresh.keys(), np.array(
        list(best_thresh.values())) / iters)
    axes[0].set_xlabel('Call Threshold')
    axes[0].set_ylabel('Count')
    axes[1].hist(best_prob, color='orange', bins=20,
                 weights=np.ones(len(best_prob)) / len(best_prob))
    axes[1].set_xlabel('Lie Probability')
    axes[1].set_ylabel('Count')
    plt.show()


if __name__ == "__main__":
    main()
