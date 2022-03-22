CREATE OR REPLACE VIEW cart_view
 AS
 SELECT shopping_cart.id,
    shopping_cart.user_id,
    shopping_cart.product_id,
    shopping_cart.qty,
    products.name,
    products.description,
    category_path(categories.id) AS category,
    products.price,
    shopping_cart.qty::numeric * products.price AS total,
    products.details,
    products.image,
    shopping_cart.note
   FROM shopping_cart
     LEFT JOIN products ON products.id = shopping_cart.product_id
     LEFT JOIN categories ON categories.id = products.category_id;