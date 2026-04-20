DELETE FROM order_details;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM customers;

INSERT INTO customers (id, name, country, city, sales_rep) VALUES
(103, 'Atelier graphique', 'France', 'Nantes', 'Gerard Hernandez'),
(112, 'Signal Gift Stores', 'USA', 'Las Vegas', 'Julie Firrelli'),
(114, 'Australian Collectors Co.', 'Australia', 'Melbourne', 'Peter Ferguson'),
(124, 'Mini Gifts Distributors Ltd.', 'USA', 'San Rafael', 'Julie Firrelli'),
(141, 'Euro+ Shopping Channel', 'Spain', 'Madrid', 'Pamela Castillo');

INSERT INTO products (id, code, name, product_line, quantity_in_stock) VALUES
(1, 'S10_1678', '1969 Harley Davidson Ultimate Chopper', 'Motorcycles', 7933),
(2, 'S10_1949', '1952 Alpine Renault 1300', 'Classic Cars', 7305),
(3, 'S18_1749', '1917 Grand Touring Sedan', 'Vintage Cars', 2724),
(4, 'S24_2011', '18th century schooner', 'Ships', 1898),
(5, 'S72_1253', 'Boeing X-32A JSF', 'Planes', 4857);

INSERT INTO orders (id, customer_id, order_date, status) VALUES
(10100, 103, '2003-01-06', 'Shipped'),
(10101, 112, '2003-01-09', 'Shipped'),
(10102, 114, '2004-02-15', 'Processing'),
(10103, 124, '2004-03-17', 'Shipped'),
(10104, 141, '2005-05-11', 'Resolved');

INSERT INTO order_details (order_id, product_id, quantity, price_each) VALUES
(10100, 1, 30, 95.00),
(10100, 2, 15, 210.00),
(10101, 3, 20, 165.00),
(10101, 4, 12, 120.00),
(10102, 5, 40, 50.00),
(10103, 1, 25, 96.00),
(10103, 2, 18, 212.00),
(10104, 3, 22, 168.00);
