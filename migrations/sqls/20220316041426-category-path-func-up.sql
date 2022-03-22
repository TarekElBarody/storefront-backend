CREATE OR REPLACE FUNCTION category_path(INTEGER) RETURNS TEXT AS $$
DECLARE
    p INTEGER := (SELECT parent from categories WHERE id = $1)::INTEGER;
	n TEXT := (SELECT name from categories WHERE id = $1)::TEXT;
BEGIN
     while p > 0 loop
	 n := (SELECT CONCAT(name, ' -> ' , n) from categories WHERE id = p)::TEXT;
      p := (SELECT parent from categories WHERE id = p)::INTEGER;
	end loop;
   return n;
END;
$$ LANGUAGE plpgsql;