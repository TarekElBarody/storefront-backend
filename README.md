# Storefront-Backend

This is a starter API application for building Store Backend routes to manage and process Shopping Cart ,Orders  Category, Products, Users, Authentication and Store data in Database PostgreSQL.
> modules [`nodeJS`](https://nodejs.org/en/) with [`Express`](https://www.npmjs.com/package/expresss), [`TypeScript`](https://www.npmjs.com/package/typescript) , [`ESlint`](https://www.npmjs.com/package/eslint), [`Prettier`](https://www.npmjs.com/package/prettier) , [`Jasmine`](https://www.npmjs.com/package/jasmine) , [`supertest`](https://www.npmjs.com/package/supertest) , [`pg`](https://www.npmjs.com/package/pg) , [`dotenv`](https://www.npmjs.com/package/dotenv) , [`compression`](https://www.npmjs.com/package/compression) , [`bcrypt`](https://www.npmjs.com/package/bcrypt) , [`db-migrate`](https://www.npmjs.com/package/db-migrate) , [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) , [`morgan`](https://www.npmjs.com/package/morgan) , [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) , [`cors`](https://www.npmjs.com/package/cors) , [`helmet`](https://www.npmjs.com/package/helmet) . 

- The API application supports SSL and is ready to work on both HTTP and HTTPS.
- Login feature With Bcrypt password encryption.
- Json Web Tokens to manage requests authentication.
- PostgreSQL with pg module driver for data storage
- API Supports 
  - Adding Categories and Products 
  - Create Users and Tokens
  - Adding Product to user shopping cart
  - Process Order from saved shopping cart
  - Order State Management and Confirmation Process
  - Admin Privilege and User Access
  - Admins can create orders on behalf users
  - Admin Can Confirm and Delete and Update all setting
  - User can add or remove products to shopping cart
  - User can update their owen information
- All necessary checks have been done as a reference that you can develop on
- Strong typing is providing by Typescript for reduce errors

# Table of contents:

- [Environment Setup](#Environment-Setup)
- [Database Setup](#Database-Setup)
- [App Directory](#App-Directory) 
- [API Documentation](#API-Documentation)
- [Running the server](#Running-the-server)
	 - [Starting the server](#Starting-the-server)
	 - [Linting code error](#Linting-code-error)
	 - [Formatting the code](#Formatting-the-code)
	 - [Clean destination folder](#Clean-dist-folder)
	 - [build the project](#Build-the-project)
	 - [Build and Serve the project](#Build-and-Serve-the-project)
	 - [Run jasmine test](#Run-jasmine-test)






# Environment Setup 
- Using nodeJS v16.13.2 and NPM 8.4.1
- If you using lower or higher version of node please use [Node Package Manager](https://www.npmjs.com/)
- Install all modules by using :
```ssh
git clone https://github.com/TarekElBarody/storefront-backend.git
cd  storefront-backend
npm install
```

# Database Setup 
- Using nodeJS v16.13.2 and NPM 8.4.1
- If you using lower or higher version of node please use [Node Package Manager](https://www.npmjs.com/)
- Install all modules by using :
```ssh
git clone https://github.com/TarekElBarody/storefront-backend.git
cd  storefront-backend
npm install
```

# App Directory 
```
 - dist               # transpile Typescript to es5 js to this folder
   - env              # store ssl keys and user.json for saved password
   - images           # store and process the resizing and caching for images
   - logs             # store user logs and processing image logs and access server logs
   - public           # public folder for front-end (html + css + js)
   - spec             # configures for Jasmine Testing
   - src              # source code for typescript *.ts
     - lib            # function , middleware , helper , types
     - routes         # API routs & web routs
     - tests          # Jasmine testing
   - package.json     # store all script and module and configuration for node project
   - tsconfig.json    # store Typescript Configuration
   - .prettierrc      # store Prettier configuration for code formatter
   - .eslintrc        # store ESlint code linting for typescript

```

## Running the server

#### Starting the server
> we user ts-node & nodemon to running the code
```ssh
npm start
> storefront-backend@1.0.0 start
> nodemon

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node ./src/index.ts`
HTTP server on port 3000 at http://localhost:3000/
HTTPS server on port 4000 at https://localhost:4000/
```

#### Linting code error
```ssh
npm run lint

> storefront-backend@1.0.0 lint
> eslint "src/**/*.ts"

```

#### Formatting the code
```ssh
npm run prettier

> storefront-backend@1.0.0 prettier
> prettier --config .prettierrc "src/**/*.ts" --write

```

#### Clean dist folder
```ssh
npm run clean
```
#### Build the project
```ssh
npm run build
```

#### Build and Serve the project
```ssh
npm run serve
```

#### Run jasmine test
```ssh
npm run test
```
```diff
> store-backend@1.0.0 test
> ENV=test npm run db-test-drop && npm run db-test-create && npm run db-test-migrate && npm run build && ENV=test jasmine && npm run db-test-drop


> store-backend@1.0.0 db-test-drop
> db-migrate -e create db:drop store_db_test

[INFO] Deleted database "store_db_test"

> store-backend@1.0.0 db-test-create
> db-migrate -e create db:create store_db_test

[INFO] Created database "store_db_test"

> store-backend@1.0.0 db-test-migrate
> db-migrate up -e test

received data: CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  birthday DATE NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  role INTEGER NOT NULL DEFAULT 3,
  created TIMESTAMP DEFAULT NOW()
);
[INFO] Processed migration 20220308230147-users-table
received data: CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent INTEGER NOT NULL DEFAULT 0,
    icon VARCHAR(255) NULL,
    created TIMESTAMP DEFAULT NOW()
);

[INFO] Processed migration 20220314111816-categories-table
received data: CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
price NUMERIC(18,3) NOT NULL DEFAULT 0.000,
stock INTEGER NOT NULL DEFAULT 0,
details JSON NOT NULL DEFAULT '{}',
image VARCHAR(255) NULL,
status INTEGER NOT NULL DEFAULT 0,
created TIMESTAMP DEFAULT NOW()
);
[INFO] Processed migration 20220314111824-products-table
received data: CREATE TABLE shopping_cart (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
qty INTEGER NOT NULL DEFAULT 1,
note TEXT NULL,
created TIMESTAMP DEFAULT NOW()
);
[INFO] Processed migration 20220315125802-shopping-cart-table
received data: CREATE OR REPLACE FUNCTION category_path(INTEGER) RETURNS TEXT AS $$
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
[INFO] Processed migration 20220316041426-category-path-func
received data: CREATE OR REPLACE VIEW cart_view
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
[INFO] Processed migration 20220316042444-cart-view
received data: CREATE TABLE orders (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE SET DEFAULT,
user_info JSON NOT NULL DEFAULT '{}',
qty_count INTEGER NOT NULL DEFAULT 1,
total NUMERIC(18,3) NOT NULL DEFAULT 0,
status INTEGER NOT NULL DEFAULT 1,
confirmed_by INTEGER NOT NULL DEFAULT 0,
confirmed_date TIMESTAMP NULL DEFAULT NULL,
payment_type INTEGER NOT NULL DEFAULT 1,
note TEXT NULL,
created TIMESTAMP DEFAULT NOW()
);
[INFO] Processed migration 20220316084230-orders-table
received data: CREATE TABLE order_items (
id SERIAL PRIMARY KEY,
order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
product_id INTEGER REFERENCES products(id) ON DELETE SET DEFAULT,
product_info JSON NOT NULL DEFAULT '{}',
qty INTEGER NOT NULL DEFAULT 1,
price NUMERIC(18,3) NOT NULL DEFAULT 0,
total NUMERIC(18,3) NOT NULL DEFAULT 0,
note TEXT NULL,
status INTEGER NOT NULL DEFAULT 1
);
[INFO] Processed migration 20220316162325-order-items-table
received data: CREATE OR REPLACE VIEW orders_user_view AS
SELECT id, user_id, qty_count, total, confirmed_by, confirmed_date, payment_type, note, status,
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
[INFO] Processed migration 20220317064003-orders-user-view
received data: CREATE OR REPLACE VIEW user_view
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
[INFO] Processed migration 20220317064403-user-view
received data: CREATE OR REPLACE VIEW product_view
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
[INFO] Processed migration 20220317082605-product-view
received data: CREATE OR REPLACE FUNCTION create_order(INTEGER, INTEGER, TEXT)
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


[INFO] Processed migration 20220317082759-create-order-func
received data: CREATE VIEW orders_view AS
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

[INFO] Processed migration 20220317101941-orders-view
received data: CREATE OR REPLACE VIEW top_purchased_products AS
        SELECT product_id, COUNT(product_id)::INTEGER  AS product_count
        FROM order_items
        WHERE status = 4 AND (SELECT created FROM orders where id = order_id) BETWEEN 'now'::timestamp - '1 month'::interval AND NOW()
        GROUP BY product_id
        ORDER BY COUNT(product_id)::INTEGER DESC
        LIMIT 1000;
[INFO] Processed migration 20220320170043-top-purchased-products-view
received data: CREATE OR REPLACE VIEW pending_carts AS
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
[INFO] Processed migration 20220320170453-pending-carts-view
received data: CREATE OR REPLACE VIEW top_pending_products AS
        SELECT product_id, COUNT(product_id)::INTEGER as product_count
        FROM order_items
        WHERE status = 1 AND (SELECT created FROM orders where id = order_id) BETWEEN 'now'::timestamp - '1 month'::interval AND NOW()
        GROUP BY product_id
        ORDER BY COUNT(product_id)::INTEGER DESC
        LIMIT 1000;
[INFO] Processed migration 20220320171652-top-pending-products-view
[INFO] Done

> store-backend@1.0.0 build
> npm run clean && npx tsc


> store-backend@1.0.0 clean
> rm -rf dist

Jasmine started
HTTP server on port 8080 at http://localhost:8080/api
HTTPS server on port 8443 at https://localhost:8443/api

  1 Test Categories Handlers EndPoint (categoriesHandlerSpec)
+   √ Should Generated Admin Token Success
+   √ Should Endpoint Insert New Categories
+   √ Should Endpoint Get All Categories
+   √ Should Endpoint Get Category Data
+   √ Should Endpoint Update Categories Data
+   √ Should Endpoint Delete Categories Data
+   √ Should Endpoint Error Category Require Token

  2 Test Orders Handlers EndPoint (ordersHandlerSpec)
+   √ Should Generated User & Admin Token Success
+   √ Should Endpoint User Process New Order
+   √ Should Endpoint Admin Create New Order
+   √ Should Endpoint User Get Order details
+   √ Should Endpoint User Get All His Orders
+   √ Should Endpoint Admin Get Order details
+   √ Should Endpoint Admin Get All Orders
+   √ Should Endpoint Admin Update Order to confirmed
+   √ Should Endpoint Admin Delete Order
+   √ Should Endpoint Error Order Require Token

  3 Test OrderItems Handlers EndPoint (orderItemsHandlerSpec)
+   √ Should Generated User & Admin Token Success
+   √ Should Endpoint Admin Insert New OrderItems
+   √ Should Endpoint Admin Get OrderItem details
+   √ Should Endpoint Admin Get All OrderItems
+   √ Should Endpoint Admin Update OrderItems QTY
+   √ Should Endpoint Admin Delete OrderItems
+   √ Should Endpoint Error OrderItems Require Token

  4 Test Products Handlers EndPoint (productsHandlerSpec)
+   √ Should Generated Admin Token Success
+   √ Should Endpoint Insert New Products
+   √ Should Endpoint Get All Products
+   √ Should Endpoint Get Product Data
+   √ Should Endpoint Update Products Data
+   √ Should Endpoint Delete Products Data
+   √ Should Endpoint Error Product Require Token

  5 Test ShoppingCarts Handlers EndPoint (shoppingCartsHandlerSpec)
+   √ Should Generated User Token Success
+   √ Should Endpoint User Insert New Shopping Cart Item
+   √ Should Endpoint User Insert New Shopping Cart Item 2
+   √ Should Endpoint User Get All Shopping Cart Items
+   √ Should Endpoint User Get  Shopping Cart Item
+   √ Should Endpoint User Update Shopping Cart Item 2
+   √ Should Endpoint User Delete Shopping Cart Item
+   √ Should Endpoint User Empty Shopping Cart Items
+   √ Should Endpoint Error ShoppingCart Require Token

  6 Test Users Handlers EndPoint (usersHandlerSpec)
+   √ Should Generated Admin Token Success
+   √ Should Endpoint Create New Users
+   √ Should Endpoint Get Auth Token
+   √ Should Endpoint Get User Data
+   √ Should Endpoint Admin Get All Users
+   √ Should Endpoint Update Users Data
+   √ Should Endpoint Reset User Password
+   √ Should Endpoint Delete Users Data
+   √ Should Endpoint Error User Require Token

  7 Test Hash & Token Function (hashSpec)
+   √ Should All Function Are defined
+   √ Should Hashing & verifying Password
+   √ Should Generate & verifying Tokens

  8 Test Category Model (categoryStoreSpec)
+   √ Should Category Model CRUD functions are defined
+   √ Should Insert New Category
+   √ Should Return Category Data
+   √ Should Return All Category Data
+   √ Should update Category - Just Name
+   √ Should Delete Category Data
+   √ Should Truncate Category Data

  9 Test OrderItems Model (orderItemsStoreSpec)
+   √ Should OrderItems Model CRUD functions are defined
+   √ Should Admin Insert New OrderItems
+   √ Should Return an OrderItems
+   √ Should Return All OrderItems
+   √ Should update OrderItems - Status CONFIRMED
+   √ Should Delete OrderItems
+   √ Should Truncate OrderItems Data

  10 Test Order Model (orderStoreSpec)
+   √ Should Order Model CRUD functions are defined
+   √ Should User Process New Order From Shopping Cart
+   √ Should Admin Create New Order
+   √ Should Return an Order
+   √ Should Return All Orders
+   √ Should Return All User Orders
+   √ Should update Order - Confirmed 
+   √ Should Delete Order
+   √ Should Truncate Order Data

  11 Test Product Model (productStoreSpec)
+   √ Should Product Model CRUD functions are defined
+   √ Should Insert New Product
+   √ Should Return Product Data
+   √ Should Return Product View
+   √ Should Return All Product Data
+   √ Should update Product - Just Price
+   √ Should Delete Product Data
+   √ Should Truncate Product Data

  12 Test ShoppingCart Model (shoppingCartStoreSpec)
+   √ Should ShoppingCart Model CRUD functions are defined
+   √ Should Insert New Shopping Cart Item
+   √ Should Return an Item from Shopping Cart
+   √ Should Return All User Items in the Shopping Cart
+   √ Should update Shopping Cart Item - Just QTY
+   √ Should Delete Shopping Cart Item
+   √ Should Empty Shopping Cart Item
+   √ Should Truncate ShoppingCart Data

  13 Test Users Model (userStoreSpec)
+   √ Should User Model CRUD functions are defined
+   √ Should Insert New User
+   √ Should Return User Data
+   √ Should Return User Hashed Password
+   √ Should Return All Users Data
+   √ Should update User - Just Email
+   √ Should Delete User Data
+   √ Should Truncate User Data

  14 Test API Endpoints Access (apiRouteSpec)
+   √ Should Endpoint is Responding 200 With Json
+   √ Should API Return error 404 Not found for not controlled endpoint

  15 Test Web Route Access (webRouteSpec)
+   √ Should Web Front is Responding

  16 Test Dashboard Service Controller (dashboardControllerSpec)
+   √ Should Generated Admin Token Success
+   √ Should Endpoint Return Top Purchased Products
+   √ Should Endpoint Return Top Pending Products
+   √ Should Endpoint Return List of Pending Shopping Cart
+   √ Should Endpoint Return List of Top Buyer

  17 Test Dashboard Service DataBinding (dashboardDataSpec)
+   √ Should OrderItems Model CRUD functions are defined
+   √ Should Return Top Purchased Products
+   √ Should Return Top Pending Products
+   √ Should Return List of Pending Shopping Cart
+   √ Should Return List of Top Buyer

+   Executed 112 of 112 specs SUCCESS in 5 secs.

> store-backend@1.0.0 db-test-drop
> db-migrate -e create db:drop store_db_test

[INFO] Deleted database "store_db_test"

```





