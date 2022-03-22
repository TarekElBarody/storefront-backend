CREATE OR REPLACE FUNCTION create_order(INTEGER, INTEGER, TEXT)
    RETURNS INTEGER
    LANGUAGE 'plpgsql'
AS $BODY$

DECLARE
    uid INTEGER := $1;
	u JSON := (SELECT json_build_object(
               	'id', id,
               	'first_name', first_name, 
                'last_name', last_name, 
				'birthday', birthday,
                'email', email,
			    'mobile', mobile,
			    'created', created
            ) from users WHERE id = $1)::JSON;
	q INTEGER := (SELECT SUM(qty) from cart_view WHERE user_id = $1)::INTEGER;
	t DECIMAL(18,3) := (SELECT SUM(total) from cart_view WHERE user_id = $1)::DECIMAL(18,3);
	p INTEGER := $2;
	v TEXT := $3;
	o INTEGER;
BEGIN
	
    INSERT INTO orders (user_id, user_info, qty_count, total, status, confirmed_by, confirmed_date, payment_type, note, created) 
	 VALUES (uid, u, q, t, 1, 0, null, p, v, NOW()) RETURNING id INTO o;
	 INSERT INTO order_items
	 (order_id, product_id, qty, price, total, note, status, product_info)
	SELECT o, product_id, qty, price, total, note, 1,
	(SELECT row_to_json(product_view) from product_view WHERE id = cart_view.product_id) AS product_info
	FROM cart_view WHERE user_id = uid;
	DELETE FROM shopping_cart WHERE user_id = uid;
	 RETURN o;
	 
END;
$BODY$

