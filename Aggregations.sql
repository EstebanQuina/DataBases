-- SQL Agregation Functions

-- Ordering the data by date
SELECT 
market_date,
customer_id
FROM customer_purchases
ORDER BY market_date
LIMIT 100;

-- Ordering the data by customer_id
SELECT 
market_date,
customer_id
FROM customer_purchases
ORDER BY customer_id
LIMIT 100;

-- Ordering the data by date and customer_id
SELECT 
market_date,
customer_id
FROM customer_purchases
ORDER BY market_date, customer_id
LIMIT 100;

-- Group customer_purcases by customer id (This will give us an error)
SELECT * FROM customer_purchases
GROUP BY customer_id;

-- Example
SELECT customer_id
FROM customer_purchases
GROUP BY customer_id;

-- When you group records by a specific field, you must consider that field in SELECT column list.

-- Agragation functions
SELECT 
customer_id, count(customer_id)
FROM customer_purchases
GROUP BY customer_id;

-- Group by market date
SELECT 
market_date
FROM customer_purchases
GROUP BY market_date;

-- Count the number of purchases per market date
SELECT 
market_date, count(market_date)
FROM customer_purchases
GROUP BY market_date;

-- Count the number of purchases per market date and order by count
SELECT 
market_date, count(market_date)
FROM customer_purchases
GROUP BY market_date
ORDER BY count(market_date) DESC;

-- Group by products. Find the most purchased products
SELECT 
product_id, count(product_id)
FROM customer_purchases
GROUP BY product_id
ORDER BY count(product_id) DESC;

-- Group by multiple columns
SELECT
customer_id,
market_date
FROM customer_purchases
GROUP BY customer_id, market_date;

-- We can add an aggregation function to the previous query
SELECT
customer_id,
market_date,count(product_id)
FROM customer_purchases
GROUP BY customer_id, market_date
ORDER BY count(product_id) DESC LIMIT 100;


-- Count the number of records by group
SELECT
market_date AS Date,
COUNT(*) AS items_purchased
FROM customer_purchases
GROUP BY market_date
ORDER BY market_date;

--Count the number of records by group
SELECT
market_date,
customer_id,
COUNT(*) AS items_purchased
FROM farmers_market.customer_purchases
GROUP BY market_date, customer_id
ORDER BY market_date, customer_id;

-- Sum up the quantity column
SELECT
market_date,
customer_id,
SUM(quantity) AS quantity_purchased
FROM farmers_market.customer_purchases
GROUP BY market_date, customer_id
ORDER BY market_date, customer_id;

-- Let's say we wanted to know how much money each customer spent total on each market_date, regardless of item or vendor
SELECT
market_date,
customer_id,
SUM(quantity * cost_to_customer_per_qty) AS total_spent
FROM farmers_market.customer_purchases
GROUP BY market_date, customer_id
ORDER BY market_date, customer_id;

-- Find the Money spent for each customer during April 2019
SELECT
market_date,
customer_id,
SUM(quantity * cost_to_customer_per_qty) AS total_spent
FROM farmers_market.customer_purchases
WHERE market_date >= '2019-04-01' AND market_date < '2019-05-01'
GROUP BY market_date, customer_id
ORDER BY market_date, customer_id;

-- Find the number of transactions that customers bought during April 2019
SELECT
market_date,
customer_id,
COUNT(*) AS transactions
FROM farmers_market.customer_purchases
WHERE market_date >= '2019-04-01' AND market_date < '2019-05-01'
GROUP BY market_date, customer_id
ORDER BY market_date, customer_id;

-- Find the money spent and number of transactions that customers bought during April 2019
SELECT
market_date,
customer_id,
SUM(quantity * cost_to_customer_per_qty) AS total_spent,
COUNT(*) AS transactions
FROM farmers_market.customer_purchases
WHERE market_date >= '2019-04-01' AND market_date < '2019-05-01'
GROUP BY market_date, customer_id
ORDER BY market_date, customer_id;

-- SQL joins and aggregations

-- Let´s say that for the query that was grouped by customer_id and vendor_id, we want to bring in some customer details, such as first and last name, and the vendor name.
-- We do first the join
SELECT
cp.customer_id,
cp.vendor_id,
c.customer_first_name,
c.customer_last_name,v.vendor_name
FROM farmers_market.customer_purchases cp
JOIN farmers_market.customer c ON cp.customer_id = c.customer_id
JOIN farmers_market.vendor v ON cp.vendor_id = v.vendor_id
ORDER BY cp.market_date, cp.customer_id, cp.vendor_id
LIMIT 10;

-- Now we can add the aggregation function to the previous query
SELECT
cp.customer_id,
cp.vendor_id,c.customer_first_name,
c.customer_last_name,v.vendor_name,
SUM(cp.quantity * cp.cost_to_customer_per_qty) AS total_spent
FROM farmers_market.customer_purchases cp
JOIN farmers_market.customer c ON cp.customer_id = c.customer_id
JOIN farmers_market.vendor v ON cp.vendor_id = v.vendor_id
GROUP BY cp.market_date, cp.customer_id, cp.vendor_id, c.customer_first_name, c.customer_last_name, v.vendor_name
ORDER BY cp.market_date, cp.customer_id, cp.vendor_id
LIMIT 100;

-- Find the total spent by a specific customer, for example, customer_id = 3
SELECT
cp.customer_id,c.customer_first_name,
c.customer_last_name,SUM(cp.quantity * cp.cost_to_customer_per_qty) AS total_spent
FROM farmers_market.customer_purchases cp
JOIN farmers_market.customer c ON cp.customer_id = c.customer_id
WHERE cp.customer_id = 3
GROUP BY cp.customer_id, c.customer_first_name, c.customer_last_name
ORDER BY cp.customer_id;

-- Having clause

-- If you want to filter values after the aggregate functions are applied, you can use the HAVING clause. 
-- Find the total spent by each customer, but only show customers that spent more than $1000 
SELECT
cp.customer_id,c.customer_first_name,
c.customer_last_name,SUM(cp.quantity * cp.cost_to_customer_per_qty) AS total_spent
FROM farmers_market.customer_purchases cp
JOIN farmers_market.customer c ON cp.customer_id = c.customer_id
GROUP BY cp.customer_id, c.customer_first_name, c.customer_last_name
HAVING SUM(cp.quantity * cp.cost_to_customer_per_qty) > 1000
ORDER BY total_spent DESC;


-- We group the vendor_inventory table by market_date and vendor_id
SELECT
market_date,
vendor_id,
SUM(quantity) AS total_quantity
FROM farmers_market.vendor_inventory
GROUP BY market_date, vendor_id
ORDER BY market_date, vendor_id LIMIT 100;


