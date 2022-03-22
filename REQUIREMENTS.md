# API Endpoints & Database Schema

Use the following structre to can undertand and maintaned the functionality of the storefront backend API and database schema and to learn how to process and access difrent endpoints to perform defrent actions
> NOTE THAT THE SERVER AT START WILL INSERT THE DEFAULT ADMIN USER WITH DEFAULT PASSWORD

> YOU SOULD LOGIN FIRST TO GENERATE ADMIN TOKEN
```

{
    "email": "admin@admin.com",
    "password": "123456789"
}
```

- [API Endpoints](#API-Endpoints)
- [Database Shcema](#Database-Shcema)
- [Access API](#Access-API)

## API Endpoints
> 🔴 Means Reqiuerd Admin Token 

> 🟢 Means Reqiuerd User Token 

> ⚪ Means No Token Reqiuerd   

> ADMINS ALLWAYS CAN HAVE USERS ROLE

- [Users Endpoints](#Users)
- [Categories Endpoints](#Categories)
- [Products Endpoints](#Products)
- [Shopping Cart Endpoints](#Shopping-Cart)
- [Orders Endpoints](#Orders)
- [OrderItems Endpoints](#OrderItems)
- [Dashboard Endpoints](#Dashboard)

#### Users
> CHANGE :id WITH USER ID NUMBER
- Index  🔴    -  GET [/api/users](#Index-Users)     
- Show  🟢    -  GET [/api/users/:id](#Show-Users)     
- Create  ⚪    -  POST [/api/users/add](#Add-Users)
- Update 🟢    -  PUT [/api/users/:id](#Update-Users)
- Delete 🔴   -  DELETE [/api/users/:id](#Delete-Users)
- Reset  🟢    -   PUT [/api/users/:id/reset](#Reset-Users)
- Login  ⚪  -   POST [/api/users/auth](#Login-Users)

#### Categories
> CHANGE :id WITH Category ID NUMBER
- Index  ⚪    -  GET [/api/categories](#Index-Categories)     
- Show  ⚪    -  GET [/api/categories/:id](#Show-Categories)     
- Create  🔴    -  POST [/api/categories/add](#Add-Categories)
- Update 🔴    -  PUT [/api/categories/:id](#Update-Categories)
- Delete 🔴   -  DELETE [/api/categories/:id](#Delete-Categories)

#### Products
> CHANGE :id WITH Product ID NUMBER
- Index  ⚪    -  GET [/api/products](#Index-Products)     
- Show  ⚪    -  GET [/api/products/:id](#Show-Products)     
- Create  🔴    -  POST [/api/products/add](#Add-Products)
- Update 🔴    -  PUT [/api/products/:id](#Update-Products)
- Delete 🔴   -  DELETE [/api/products/:id](#Delete-Products)

#### Shopping Cart
> CHANGE :id WITH User ID NUMBER & :cid WITH Shopping Cart Item Number
- Index  🟢    -  GET [/api/users/:id/cart](#Index-Shopping-Cart)     
- Show  🟢    -  GET [/api/users/:id/cart/:cid](#Show-Shopping-Cart)     
- Create  🟢    -  POST [/api/users/:id/cart/add](#Add-Shopping-Cart)
- Update 🟢    -  PUT [/api/users/:id/cart/:cid](#Update-Shopping-Cart)
- Delete 🟢   -  DELETE [/api/users/:id/cart/:cid](#Delete-Shopping-Cart)
- Empty 🟢   -  DELETE [/api/users/:id/cart](#Delete-Shopping-Cart)


#### Orders
> FOR ADMINS

> CHANGE :id WITH Order ID NUMBER
- Index  🔴    -  GET [/api/orders](#Index-Orders)     
- Show  🔴    -  GET [/api/orders/:id](#Show-Orders)     
- Create  🔴    -  POST [/api/orders/add](#Add-Orders)
- Update 🔴    -  PUT [/api/orders/:id](#Update-Orders)
- Delete 🔴   -  DELETE [/api/orders/:id](#Delete-Orders)

> FOR USERS

> CHANGE :id WITH User ID NUMBER & :oid with Order ID NUMBER
- Process 🟢    -  POST [/api/orders/process](#User-Process-Orders)
- Index 🟢   -  GET [/api/users/:id/orders](#User-Index-Orders)
- Show 🟢   -  GET [/api/users/:id/orders/:oid](#User-Show-Orders)

#### OrderItems
> FOR ADMIN

> CHANGE :id WITH OrderItem ID NUMBER & :oid with Order ID NUMBER
- Index  🔴    -  GET [/api/orders/:oid/items](#Index-OrderItems)     
- Show  🔴    -  GET [/api/orders/:oid/items/:id](#Show-OrderItems)     
- Create  🔴    -  POST [/api/orders/:oid/items/add](#Add-OrderItems)
- Update 🔴    -  PUT [/api/orders/:oid/items/:id](#Update-OrderItems)
- Delete 🔴   -  DELETE [/api/orders/:oid/items/:id](#Delete-OrderItems)

> FOR USERS

> CHANGE :id WITH OrderItem ID NUMBER & :oid with Order ID NUMBER & :uid WITH User ID NUMBER
- Index 🟢   -  GET [/api/users/:id/orders/:oid/items](#User-Index-OrderItems)
- Show 🟢   -  GET [/api/users/:id/orders/:oid/items/:id](#User-Show-OrderItems)

#### Dashboard
> THIS ENDPOINT FOR STATISTICS AND DASHBOARD USAGE ONLY

> YOU CAN LIMIT THE RESAULT BY USING ?limit=5 or ?limit=10 DEFAULT IS 5
- Top Purshaed Products   ⚪    -  GET [/api/dashboard/top_purchased_products](#Dashboard-Top-Purshaed-Products) 
- Top Pending Products   🔴    -  GET [/api/dashboard/top_pending_products](#Dashboard-Top-Pending-Products)    
- Pending Shopping Cart   🔴    -  GET [/api/dashboard/pending_carts](#Dashboard-Pending-Shopping-Cart)        
- Top User Buyers  🔴    -  GET [/api/dashboard/top_buyer](#Dashboard-Top-User-Buyers)   


## Database Shcema

- [Users TABLE](#Users-(TABLE-users))
- [Categories TABLE](#Categories-(TABLE-categories))
- [Products TABLE](#Products-(TABLE-products))
- [Shopping Cart TABLE](#Shopping-Cart-(TABLE-shopping_cart))
- [Category Path FUNCTION](#Category-Path-(FUNCTION-category_path))
- [Shopping Cart VIEW](#Shopping-Cart-(VIEW-cart_view))
- [Categories TABLE](#Categories-(TABLE-categories))
- [Categories TABLE](#Categories-(TABLE-categories))
- [Categories TABLE](#Categories-(TABLE-categories))


#### Users (TABLE users)
- id [SERIAL PRIMARY KEY]
- first_name [VARCHAR(50)]
- last_name [VARCHAR(50)]
- birthday [DATE]
- email [VARCHAR(200)] [UNIQUE]
- password [VARCHAR(255)]
- mobile [VARCHAR(20)] [UNIQUE]
- role [INTEGER]  >  Admin = 1, Moderator = 2, User = 3
- created [DATE]

#### Categories (TABLE categories)
- id [SERIAL PRIMARY KEY]
- name [VARCHAR(100)] [UNIQUE]
- parent [INTEGER] > the parent Categories.id
- icon [VARCHAR(255)]
- created [DATE]

#### Products (TABLE products)
> ONE TO MANY (Categories -> Products)
- id [SERIAL PRIMARY KEY]
- name [VARCHAR(255)]
- description [TEXT] 
- category_id [INTEGER] > Forgien Key [categories.id](#Categories-(TABLE-categories))
- price [NUMERIC(18,3)]
- stock [INTEGER]
- details [JSON] > Example {items: [{name: "name1", value: "value1"}, {name: "name2", value: "value2"}]}
- image [VARCHAR(255)]
- status [INTEGER] > Disabled = 0, Enabled = 1
- created [DATE]

#### Shopping Cart (TABLE shopping_cart)
> MANY TO MANY (users <-> products)
- id [SERIAL PRIMARY KEY]
- user_id [INTEGER] > Forgien Key [users.id](#Users-(TABLE-users))
- product_id [INTEGER] > Forgien Key [products.id](#Products-(TABLE-products))
- qty [INTEGER]
- note [TEXT]
- created [DATE]

#### Category Path (FUNCTION category_path)
> RETURN THE CATEGORY PATH OF PRODUCTS LIKE (Computers >> Laptops)
- category_path([category_id](#Categories-(TABLE-categories))) > (category) [TEXT]


#### Shopping Cart View (VIEW cart_view)
> SHOPPING CART LEFT JOIN PRODUCTS LEFT JOIN CATEGOREIS
- id [INTEGER]  > from [shopping_cart.id](#Shopping-Cart-(TABLE-shopping_cart))
- user_id [INTEGER] > from [shopping_cart.user_id](#Shopping-Cart-(TABLE-shopping_cart))
- product_id [INTEGER] > from [shopping_cart.product_id](#Shopping-Cart-(TABLE-shopping_cart))
- qty [INTEGER] > from [shopping_cart.qty](#Shopping-Cart-(TABLE-shopping_cart))
- name [VARCHAR(255)] > from [products.name](#Products-(TABLE-products))
- description [TEXT] > from [products.description](#Products-(TABLE-products))
- category [TEXT] > from function [category_path](#Category-Path-(FUNCTION-category_path))([products.category_id](#Products-(TABLE-products)))
- price [NUMERIC(18,3)] > from [products.price](#Products-(TABLE-products))
- total [NUMERIC(18,3)] > from [products.price](#Products-(TABLE-products)) * [shopping_cart.qty](#Shopping-Cart-(TABLE-shopping_cart))
- details [JSON] > from [products.details](#Products-(TABLE-products))
- image [VARCHAR(255)] > from  [products.image](#Products-(TABLE-products))
- note [TEXT] > from  [shopping_cart.note](#Shopping-Cart-(TABLE-shopping_cart))

#### Orders (TABLE orders)
> ONE TO MANY (users -> orders)

> ORDERS IS SEPREATED AND SELF CONTAINED TABLE ITS PROCCESS SHOPPING CART TO FINALY BECOME A COMPLETED ORDER AND IF USERS OR PRODCUTS DELETED OR CHANGED WILL NOT EFFECTS THE ORDERS CONTENT STORAGE FOR BETTER OPTIMIZED STATICTICS 
- id [SERIAL PRIMARY KEY]
- user_id [INTEGER] > from users.id with no refrence effect on delete or change
- user_info [JSON] > from Users Data As JSON Format
- qty_count [INTEGER] > from sum of cart_view.qty
- total [NUMERIC(18,3)] > from sum of cart_view.total
- confirmed_by [INTEGER] > from admin users.id
- confirmed_date [DATE]
- payment_type [INTEGER] >  COD = 1, VISA = 2
- note [TEXT] > from cart_view.note
- status [INTEGER] > PENDING = 1, CONFIRMED = 2, DELIVERING = 3, COMPLETED = 4, REFUNDING = 5, REFUNDED = 6
- created [DATE]

#### OrderItems (TABLE order_items)
> MANY TO MANY (products <-> orders <- users)

> ORDERS ITEMS IS SEPREATED AND SELF CONTAINED TABLE ITS STORE  SHOPPING CART ITEMS FOR ORDER AND IF USERS OR PRODCUTS DELETED OR CHANGED WILL NOT EFFECTS THE ORDERS ITEMS CONTENT STORAGE FOR BETTER OPTIMIZED STATICTICS 
- id [SERIAL PRIMARY KEY]
- order_id [INTEGER] > Forgien Key orders.id
- product_id [INTEGER] > from cart_view.products_id with no refrence effect on delete or change
- product_info [JSON] > from Products Data As JSON Format
- qty [INTEGER] > from cart_view.qty Item
- price [NUMERIC(18,3)] > from sum of cart_view.price Item
- total [NUMERIC(18,3)] > from sum of cart_view.total Item
- status [INTEGER] > PENDING = 1, CONFIRMED = 2, DELIVERING = 3, COMPLETED = 4, REFUNDING = 5, REFUNDED = 6
- note [TEXT] > from cart_view.note


#### Orders User View (VIEW orders_user_view)
> RETUREN ORDERS ROWS COMPAINED WITH A COLUMN WITH IMPORTED ORDER ITEMS AS JSON FORMAT
- id [INTEGER] > from orders.id
- user_id [INTEGER] > from orders.user_id
- qty_count [INTEGER] > from orders.qty_count
- total [NUMERIC(18,3)] > from orders.total
- confirmed_by [INTEGER] > from orders.confirmed_by
- confirmed_date [DATE] > from orders.confirmed_date
- payment_type [INTEGER] >  from orders.payment_type
- note [TEXT] > from orders.note
- status [INTEGER] > from orders.status
- created [DATE] > from orders.created
- items [JSON] > compained JSON build from order_items rows on order.id


#### User View (VIEW user_view)
> RETUREN USERS ROWS COMPAINED WITH 4 COMPAINED COLUMNS
- id [INTEGER] > from users.id
- first_name [VARCHAR] > from users.first_name
- last_name [VARCHAR] > from users.last_name
- birthday [DATE] > from users.birthday
- email [VARCHAR] > from users.email
- mobile [VARCHAR] > from users.mobile
- role [INTEGER] > from users.role
- created [DATE] > from users.created
- order_count [INTEGER] > from count(user_id) in orders on order.user_id
- order_sum [NUMERIC(18,3)] > from sum(total) in orders on order.user_id
- most_products [JSON] > compained JSON build from order_items.product_info in orders on order.user_id
- last_orders [JSON] > compained JSON build from order rows on order.user_id


#### Products View (VIEW product_view)
> RETURN PRODUCTS WITH COMPAINED CULOMN CATEGORY PATH
- id [INTEGER] > from products.id
- name [VARCHAR] > from products.name
- description [TEXT] > from products.description
- category [TEXT] > from function category_path(products.category_id)
- price [NUMERIC(18,3)] > from products.price
- details [JSON] > from products.details
- image [VARCHAR] > from products.image

#### Process Orders From Shoppinf Cart (FUNCTION create_order)
> PROCESS CREATION OF NEW ORDER FROM CART THEN RETURN THE CREATED ORDER ID
- create_order(users.id [INTEGER] , payment_type [INTEGER], note [TEXT]) > (orders.id) [INTEGER]


