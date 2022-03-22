CREATE OR REPLACE VIEW top_pending_products AS
	SELECT product_id, COUNT(product_id)::INTEGER as product_count 
	FROM order_items 
	WHERE status = 1 AND (SELECT created FROM orders where id = order_id) BETWEEN 'now'::timestamp - '1 month'::interval AND NOW()
	GROUP BY product_id
	ORDER BY COUNT(product_id)::INTEGER DESC
	LIMIT 1000;