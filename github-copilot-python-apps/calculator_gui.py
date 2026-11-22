import tkinter as tk

# What each button shows -> what it means in Python math
OPERATORS = {"+": "+", "−": "-", "×": "*", "÷": "/"}

expression = ""


def press(key):
    """Adds a digit or operator to the current expression and shows it."""
    global expression
    expression += key
    display.config(text=expression)


def calculate():
    """Evaluates the expression and shows the result (or an error)."""
    global expression
    python_expr = expression
    for symbol, op in OPERATORS.items():
        python_expr = python_expr.replace(symbol, op)

    # Only digits, dots and the four operators are allowed, so eval stays safe here
    if not python_expr or any(ch not in "0123456789.+-*/" for ch in python_expr):
        display.config(text="Error")
        expression = ""
        return

    try:
        result = eval(python_expr)
        expression = str(round(result, 10))
        display.config(text=expression)
    except (SyntaxError, ZeroDivisionError):
        display.config(text="Error")
        expression = ""


def clear():
    """Clears the display."""
    global expression
    expression = ""
    display.config(text="0")


window = tk.Tk()
window.title("Calculator")
window.resizable(False, False)

display = tk.Label(window, text="0", anchor="e", font=("Helvetica", 28),
                   width=12, bg="white", relief="sunken", padx=10)
display.grid(row=0, column=0, columnspan=4, pady=10, padx=10)

layout = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "−"],
    ["C", "0", "=", "+"],
]

for r, row in enumerate(layout, start=1):
    for c, key in enumerate(row):
        if key == "C":
            command = clear
        elif key == "=":
            command = calculate
        else:
            command = lambda k=key: press(k)
        tk.Button(window, text=key, width=5, height=2, font=("Helvetica", 18),
                  command=command).grid(row=r, column=c, padx=3, pady=3)

window.mainloop()
