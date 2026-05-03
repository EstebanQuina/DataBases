docker start mysqlcontainer
docker exec -it mysqlcontainer bash
mysql -uroot -p

-- sample execise in SQL
SELECT c.customer_id, c.customer_first_name, c.customer_last_name
FROM  customer as c
INNER JOIN customer_purchases as cp
ON c.customer_id = cp.customer_id
WHERE cp.quantity * cp.cost_to_customer_per_qty > 15;

SELECT c.customer_id, c.customer_first_name, c.customer_last_name, cp.product_id, cp.market_date, cp.cost_to_customer_per_qty*cp.quantity as price 
FROM customer as c INNER JOIN customer_purchases as cp 
ON c.customer_id = cp.customer_id 
WHERE price>15;

-- Find vendors id which booth type is large
SELECT * FROM vendor LIMIT 10;
SELECT * FROM vendor_booth_assignments LIMIT 10;
SELECT * FROM booth LIMIT 10;

SELECT DISTINCT vba.vendor_id
FROM vendor_booth_assignments vba
JOIN booth b ON vba.booth_number = b.booth_number
WHERE b.booth_type = 'Large';

-- Find products which belong to category "Plants & Flowers"
SELECT * FROM product LIMIT 10;
SELECT * FROM product_category LIMIT 10;

SELECT p.product_id, p.product_name, p.product_size, p.product_qty_type
FROM product p
JOIN product_category pc ON p.product_category_id = pc.product_category_id
WHERE pc.product_category_name = 'Plants & Flowers';

-- List the customers's names who buy products on September 2019
SELECT * FROM customer_purchases LIMIT 10;

SELECT DISTINCT c.customer_first_name, c.customer_last_name
FROM customer c
JOIN customer_purchases cp ON c.customer_id = cp.customer_id
WHERE cp.market_date >= '2019-09-01' AND cp.market_date <= '2019-09-30';

-- Find verdors names whoose booth type is large
SELECT DISTINCT v.vendor_name
FROM vendor v
JOIN vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
JOIN booth b ON vba.booth_number = b.booth_number
WHERE b.booth_type = 'Large';

-- Outer joins
-- Left outer join
SELECT *
FROM product_category
LEFT OUTER JOIN product
ON product_category.product_category_id = product.product_category_id;

--Which categories do not have any products?
SELECT pc.product_category_name 
FROM product_category as pc
LEFT OUTER JOIN product as p
ON pc.product_category_id = p.product_category_id
WHERE p.product_id IS NULL;



-- Homework exercises--------------------------------------------------------------

-- Find the booths whose price levels are A 
SELECT b.booth_number, b.booth_type, b.booth_price_level
FROM booth b
WHERE b.booth_price_level = 'A';

-- Find the booth number whose price levels are B
SELECT b.booth_number, b.booth_type, b.booth_price_level
FROM booth b
WHERE b.booth_price_level = 'B';

-- Find the customers whose last name is 'Diaz'  
SELECT c.customer_id, c.customer_first_name, c.customer_last_name
FROM customer c
WHERE c.customer_last_name = 'Diaz';

-- Find the Customer and Vendor's first name and last name (UNION). 
SELECT c.customer_first_name, c.customer_last_name
FROM customer c
UNION
SELECT v.vendor_name, NULL
FROM vendor v;

-- Find Customers that are also Vendors  (INTERSECTION)
SELECT c.customer_first_name, c.customer_last_name
FROM customer c
JOIN vendor v ON c.customer_first_name = v.vendor_name;

-- Find Vendors that are also Customers (INTERSECTION)
SELECT v.vendor_name, NULL
FROM vendor v
JOIN customer c ON v.vendor_name = c.customer_first_name;

-- Find the Customers that are not Vendors (DIFFERENCE)
SELECT c.customer_first_name, c.customer_last_name
FROM customer c
LEFT JOIN vendor v ON c.customer_first_name = v.vendor_name
WHERE v.vendor_name IS NULL;

-- Find the Vendors that are not Customers  (DIFFERENCE)
SELECT v.vendor_name, NULL
FROM vendor v
LEFT JOIN customer c ON v.vendor_name = c.customer_first_name
WHERE c.customer_first_name IS NULL;

-- Find vendors id which booth type is Large
SELECT DISTINCT vba.vendor_id
FROM vendor_booth_assignments vba
JOIN booth b ON vba.booth_number = b.booth_number
WHERE b.booth_type = 'Large';

-- Find products which belong to category "Plants & Flowers"
SELECT p.product_id, p.product_name, p.product_size, p.product_qty_type
FROM product p
JOIN product_category pc ON p.product_category_id = pc.product_category_id
WHERE pc.product_category_name = 'Plants & Flowers';

-- List the customers' names who buy products on September 2019
SELECT DISTINCT c.customer_first_name, c.customer_last_name
FROM customer c
JOIN customer_purchases cp ON c.customer_id = cp.customer_id
WHERE cp.market_date >= '2019-09-01' AND cp.market_date <= '2019-09-30';

-- Find vendors names which booth type is Large
SELECT DISTINCT v.vendor_name
FROM vendor v
JOIN vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
JOIN booth b ON vba.booth_number = b.booth_number
WHERE b.booth_type = 'Large';

-- Write a query that INNER JOINs the vendor table to the vendor_booth_assignments table on the vendor_id field they both have in common, and sorts the result by vendor_name, then market_date.
SELECT v.vendor_name, cp.market_date
FROM vendor v
INNER JOIN vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
INNER JOIN customer_purchases cp ON vba.vendor_id = cp.customer_id
ORDER BY v.vendor_name, cp.market_date;

-- List the all the products and the category it belongs to
SELECT p.product_name, pc.product_category_name
FROM product p
LEFT JOIN product_category pc ON p.product_category_id = pc.product_category_id;

-- List the vendor owner full name and its inventory
SELECT v.vendor_name, p.product_name
FROM vendor v
JOIN vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
JOIN booth b ON vba.booth_number = b.booth_number
JOIN product p ON b.booth_number = p.product_id;

--  List the vendor and its booth assignments order by date 
SELECT v.vendor_name, b.booth_number, vba.market_date
FROM vendor v
JOIN vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
JOIN booth b ON vba.booth_number = b.booth_number
ORDER BY v.vendor_name, vba.market_date;

-- List the inventory and their product names
SELECT p.product_name, p.product_id
FROM product p
ORDER BY p.product_name;

-- More exercises.
-- Find customers that have not purchases
SELECT c.customer_first_name, c.customer_last_name
FROM customer c
LEFT JOIN customer_purchases cp ON c.customer_id = cp.customer_id
WHERE cp.customer_id IS NULL;

-- List all purchases and the customers associated with them (left outer join)
SELECT c.customer_first_name, c.customer_last_name, cp.product_id, cp.market_date, cp.quantity, cp.cost_to_customer_per_qty
FROM customer c
LEFT JOIN customer_purchases cp ON c.customer_id = cp.customer_id
ORDER BY c.customer_last_name, c.customer_first_name, cp.market_date LIMIT 10;

-- Find vedors with no booth assignments
SELECT v.vendor_name
FROM vendor v
LEFT JOIN vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
WHERE vba.vendor_id IS NULL;

-- List the customers names and the name of products that were bought by them and order by date of purchase, then by customer's last name and first name
SELECT c.customer_first_name, c.customer_last_name, p.product_name, cp.market_date
FROM customer c
JOIN customer_purchases cp ON c.customer_id = cp.customer_id
JOIN product p ON cp.product_id = p.product_id
ORDER BY cp.market_date, c.customer_last_name, c.customer_first_name;

-- SQL QUERIES 3
-- 1) Unlike for the product - product_category relationship, there can be customers without any purchases. Such customers were added to the customer table when they signed up for the farmer's market loyalty card, so we have their customer data, but they have not yet purchased any products. We can do a LEFT JOIN , we're getting a list of all customers, and their associated purchases, if there are any. Customers with multiple purchases will show up in the output multiple times—once for each item purchased. Customers without any purchases will have NULL values in all fields displayed that are from the customer_purchases table. Implement the query that finds the customers that do not have purchases.
SELECT 
    c.customer_id,
    c.customer_first_name,
    c.customer_last_name
FROM 
    customer c
LEFT JOIN 
    customer_purchases cp ON c.customer_id = cp.customer_id
WHERE 
    cp.customer_id IS NULL;

-- 2) What are the names of the sellers and the name of the products they sold, including those sellers who did not make any sales?
SELECT DISTINCT
    v.vendor_name,
    p.product_name
FROM 
    vendor v
LEFT JOIN 
    customer_purchases cp ON v.vendor_id = cp.vendor_id
LEFT JOIN 
    product p ON cp.product_id = p.product_id;

-- 3) What are the names of the sellers and the name of the products they sold on a specific date, including those sellers who did not make any sales?
-- Sample date: 2019-07-03
SELECT DISTINCT
    v.vendor_name,
    p.product_name
FROM 
    vendor v
LEFT JOIN 
    customer_purchases cp 
    ON v.vendor_id = cp.vendor_id 
    AND cp.market_date = '2019-07-03' 
LEFT JOIN 
    product p 
    ON cp.product_id = p.product_id;

-- 4) What is the name of the sellers and their products with their respective original price that the sellers offer in the market?
SELECT DISTINCT
    v.vendor_name,
    p.product_name,
    vi.original_price
FROM 
    vendor v
INNER JOIN 
    vendor_inventory vi ON v.vendor_id = vi.vendor_id
INNER JOIN 
    product p ON vi.product_id = p.product_id;

-- 5) What is the name of the vendor and the booth description and type of those that are assigned to any vendor?
SELECT DISTINCT
    v.vendor_name,
    b.booth_description,
    b.booth_type
FROM 
    vendor v
INNER JOIN 
    vendor_booth_assignments vba ON v.vendor_id = vba.vendor_id
INNER JOIN 
    booth b ON vba.booth_number = b.booth_number;