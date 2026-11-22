"""
Create a Rock Paper Scissors game where the player inputs their choice
and plays against a computer that randomly selects its move,
with the game showing who won each round.
Add a score counter that tracks player and computer wins,
and allow the game to continue until the player types "quit".
"""

import random

choices = ["rock", "paper", "scissors"]
player_score = 0
computer_score = 0

while True:
    player = input("Enter r for rock, p for paper, s for scissors (or 'quit'): ").lower().strip()
    shortcuts = {"r": "rock", "p": "paper", "s": "scissors"}
    player = shortcuts.get(player, player)

    if player == "quit":
        break
    if player not in choices:
        print("Invalid choice, try again.")
        continue

    computer = random.choice(choices)
    print(f"Computer chose {computer}.")

    if player == computer:
        print("It's a tie!")
    elif (player == "rock" and computer == "scissors") or \
         (player == "paper" and computer == "rock") or \
         (player == "scissors" and computer == "paper"):
        print("You win this round!")
        player_score += 1
    else:
        print("Computer wins this round!")
        computer_score += 1

    print(f"Score: You {player_score} - {computer_score} Computer\n")

print(f"Final score: You {player_score} - {computer_score} Computer")
