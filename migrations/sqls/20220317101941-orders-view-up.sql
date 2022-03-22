CREATE VIEW orders_view AS
SELECT id, user_id, user_info, qty_count, total, status, confirmed_by, confirmed_date, payment_type, note,
(SELECT coalesce(json_agg(items), '[]'::json)
FROM (
    SELECT 
        json_agg(
            json_build_object(
                'id', id,
                'order_id', order_id, 
                'product_id', product_id, 
                'product_info', product_info,
				'qty', qty,
				'price', price,
				'total', total,
                'note', note,
                'status', status			
            )
        ) as items
    FROM order_items WHERE order_id = orders.id
    GROUP by id
)s) AS items
	FROM orders;
	