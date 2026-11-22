import random
import tkinter as tk
from tkinter import messagebox

CHOICES = ["rock", "paper", "scissors"]
EMOJI = {"rock": "✊", "paper": "✋", "scissors": "✌️"}
BEATS = {"rock": "scissors", "paper": "rock", "scissors": "paper"}

player_score = 0
computer_score = 0
ties = 0
rounds = 0


def play(player):
    """
    Plays one round against a random computer move and updates the labels.

    Parameters:
    player (str): The player's move, either "rock", "paper", or "scissors".
    """
    global player_score, computer_score, ties, rounds
    computer = random.choice(CHOICES)
    rounds += 1

    if player == computer:
        result = "It's a tie!"
        ties += 1
    elif BEATS[player] == computer:
        result = "You win!"
        player_score += 1
    else:
        result = "Computer wins!"
        computer_score += 1

    moves_label.config(text=f"You {EMOJI[player]}  vs  {EMOJI[computer]} Computer")
    result_label.config(text=result)
    score_label.config(text=f"You {player_score} - {computer_score} Computer  |  Ties {ties}")


def show_scoreboard():
    """Shows a popup with the detailed scoreboard."""
    messagebox.showinfo(
        "Scoreboard",
        f"Rounds played: {rounds}\n"
        f"Player wins: {player_score}\n"
        f"Computer wins: {computer_score}\n"
        f"Ties: {ties}",
    )


def reset_game():
    """Resets all scores back to zero."""
    global player_score, computer_score, ties, rounds
    player_score = computer_score = ties = rounds = 0
    moves_label.config(text="")
    result_label.config(text="")
    score_label.config(text="You 0 - 0 Computer  |  Ties 0")


window = tk.Tk()
window.title("Rock Paper Scissors")
window.geometry("380x300")

tk.Label(window, text="Choose your move", font=("Helvetica", 16)).pack(pady=10)

buttons = tk.Frame(window)
buttons.pack()
for choice in CHOICES:
    tk.Button(buttons, text=f"{EMOJI[choice]} {choice.title()}", width=10,
              command=lambda c=choice: play(c)).pack(side="left", padx=5)

moves_label = tk.Label(window, text="", font=("Helvetica", 14))
moves_label.pack(pady=10)
result_label = tk.Label(window, text="", font=("Helvetica", 16, "bold"))
result_label.pack()
score_label = tk.Label(window, text="You 0 - 0 Computer  |  Ties 0")
score_label.pack(pady=10)

controls = tk.Frame(window)
controls.pack()
tk.Button(controls, text="Scoreboard", command=show_scoreboard).pack(side="left", padx=5)
tk.Button(controls, text="Reset", command=reset_game).pack(side="left", padx=5)

window.mainloop()
