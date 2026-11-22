# First data science project: does a bigger bill mean a bigger tip?
# Dataset: "tips" from the seaborn-data repository (244 restaurant bills)
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

df = pd.read_csv('tips.csv')
print(df.head(), '\n')
print('Missing values per column:\n', df.isna().sum(), '\n')

X = df[['total_bill']]   # independent variable
y = df['tip']            # dependent variable

# Scatter plot
plt.scatter(X, y, alpha=0.6)
plt.title('Restaurant bill vs. tip')
plt.xlabel('Total bill ($)')
plt.ylabel('Tip ($)')
plt.savefig('scatter.png', dpi=120)
plt.close()
print('Scatter: points rise from left to right, a positive linear relationship.\n')

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression().fit(X_train, y_train)
y_pred = model.predict(X_test)

# Regression line over the actual points
line_x = pd.DataFrame({'total_bill': np.linspace(X['total_bill'].min(), X['total_bill'].max(), 100)})
plt.scatter(X_test, y_test, alpha=0.7, label='Actual (test set)')
plt.plot(line_x, model.predict(line_x), color='red', label='Regression line')
plt.title('Linear regression: tip vs. total bill')
plt.xlabel('Total bill ($)')
plt.ylabel('Tip ($)')
plt.legend()
plt.savefig('regression_line.png', dpi=120)
plt.close()

mse = mean_squared_error(y_test, y_pred)
print(f'Equation: tip = {model.coef_[0]:.3f} x bill + {model.intercept_:.3f}')
print(f'MSE : {mse:.3f}')
print(f'RMSE: {np.sqrt(mse):.3f}')
print(f'R2  : {r2_score(y_test, y_pred):.3f}\n')

print('Conclusion: There is a clear positive linear relationship between the bill and the tip.')
print('Each extra dollar on the bill adds roughly 10 cents of tip.')
print('The model explains about half of the variation in tips, so the bill matters but is not everything;')
print('things like party size, day, and service quality likely explain the rest.')
print('A next step would be multiple linear regression using party size as a second feature.')
