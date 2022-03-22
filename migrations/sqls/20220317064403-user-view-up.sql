CREATE OR REPLACE VIEW user_view
 AS
 SELECT 
    users.id,
    users.first_name,
    users.last_name,
    users.birthday,
    users.email,
    users.mobile,
    users.role,
    users.created,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id)::INTEGER as order_count,
	COALESCE((SELECT SUM(total) FROM orders WHERE user_id = users.id), 0) as order_sum,
    (SELECT coalesce(json_agg(product_info), '[]'::json)
FROM (
    SELECT DISTINCT ON (product_id) product_info
    	FROM (
			SELECT product_id, product_info FROM order_items 
			WHERE order_id IN (SELECT id FROM orders WHERE user_id = users.id)
			ORDER BY id DESC
			)d
		LIMIT 5
	)s)::JSON AS most_products,
   (SELECT coalesce(json_agg(orders), '[]'::json)
FROM (
    SELECT 
        json_agg(
            json_build_object(
                'id', id,
                'user_id', user_id, 
                'qty_count', qty_count, 
                'total', total,
				'status', status,
				'confirmed_by', confirmed_by,
				'confirmed_date', confirmed_date,
				'payment_type', payment_type, 
                'note', note,
				'items', items
            )
        ) as orders
    FROM orders_user_view WHERE user_id = users.id
    GROUP by id
)s) AS last_orders  
   FROM users;