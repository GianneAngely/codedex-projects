import csv

max_sales = 0
best_selling_book = None

with open('Bestseller - Sheet1.csv', 'r', encoding='utf8') as file:
  reader = csv.reader(file)
  header = next(reader)            # skip the column names
  for row in reader:
    sales = float(row[4])          # 'sales in millions' column
    if sales > max_sales:
      max_sales = sales
      best_selling_book = row

print('Best-selling book:', best_selling_book[0], 'by', best_selling_book[1])
print('Sales:', max_sales, 'million')

with open('bestseller_info.csv', 'w', newline='', encoding='utf8') as file:
  writer = csv.writer(file)
  writer.writerow(['Book', 'Author', 'Sales in Millions'])
  writer.writerow([best_selling_book[0], best_selling_book[1], max_sales])

print(open('bestseller_info.csv', encoding='utf8').read())
