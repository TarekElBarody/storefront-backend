CREATE OR REPLACE VIEW orders_user_view AS
SELECT id, user_id, qty_count, total, confirmed_by, confirmed_date, payment_type, note, status, created,
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
    FROM order_items
    GROUP by id
)s) AS items
	FROM orders;