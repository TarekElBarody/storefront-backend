CREATE OR REPLACE VIEW product_view
 AS
 SELECT 
    id,
    name,
    description,
    category_path(category_id) AS category,
	price,
	details,
	image
   FROM products;