CREATE OR REPLACE VIEW pending_carts AS
SELECT id, first_name, last_name, birthday, email, mobile, role, created,
(SELECT coalesce(json_agg(items), '[]'::json)
FROM (
    SELECT 
        json_agg(
            json_build_object(
                'id', id,
               	'product_id', product_id, 
                'qty', qty, 
				'name', name,
                'description', description,
			    'category', category,
			    'price', price,
				'total', total,
				'details', details,
				'image', image,
				'note', note					
            )
        ) as items
    FROM cart_view
    GROUP by id
	ORDER BY id ASC
)s) AS cart_items

	FROM users
	WHERE id IN (
	SELECT user_id FROM shopping_cart
	);