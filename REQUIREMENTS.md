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

> [Users Access API](#Users-Access-API)

- Index  🔴    -  GET [/api/users](#Index-Users)     
- Show  🟢    -  GET [/api/users/:id](#Show-Users)     
- Create  ⚪    -  POST [/api/users/add](#Add-Users)
- Update 🟢    -  PUT [/api/users/:id](#Update-Users)
- Delete 🔴   -  DELETE [/api/users/:id](#Delete-Users)
- Reset  🟢    -   PUT [/api/users/:id/reset](#Reset-Users-Password)
- Login  ⚪  -   POST [/api/users/auth](#Users-Login)

#### Categories
> CHANGE :id WITH Category ID NUMBER

> [Categories Access API](#Categories-Access-API)

- Create  🔴    -  POST [/api/categories/add](#Create-Categories)
- Index  ⚪    -  GET [/api/categories](#Index-Categories)     
- Show  ⚪    -  GET [/api/categories/:id](#Show-Categories)     
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

- [Users TABLE](#Users-TABLE-users)
- [Categories TABLE](#Categories-TABLE-categories)
- [Products TABLE](#Products-TABLE-products)
- [Shopping Cart TABLE](#Shopping-Cart-TABLE-shopping_cart)
- [Category Path FUNCTION](#Category-Path-FUNCTION-category_path)
- [Shopping Cart VIEW](#Shopping-Cart-View-VIEW-cart_view)
- [Orders TABLE](#Orders-TABLE-orders)
- [OrderItems TABLE](#OrderItems-TABLE-order_items)
- [Orders User VIEW](#Orders-User-View-VIEW-orders_user_view)
- [User VIEW](#User-View-VIEW-user_view)
- [Products VIEW](#Products-View-VIEW-product_view)
- [Process Orders From Shopping Cart FUNCTION](#Process-Orders-From-Shopping-Cart-FUNCTION-create_order)
- [Orders VIEW](#Orders-View-VIEW-orders_view)
- [Top Purchased Products VIEW](#Top-Purchased-Products-View-VIEW-top_purchased_products)
- [Top Pending Products VIEW](#Top-Pending-Products-View-VIEW-top_pending_products)
- [Users Pending Shopping Cart VIEW](#Users-Pending-Shopping-Cart-View-VIEW-pending_carts)




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
- parent [INTEGER] > the parent categories.id
- icon [VARCHAR(255)]
- created [DATE]

#### Products (TABLE products)
> ONE TO MANY (Categories -> Products)
- id [SERIAL PRIMARY KEY]
- name [VARCHAR(255)]
- description [TEXT] 
- category_id [INTEGER] > Forgien Key [categories.id](#Categories-TABLE-categories)
- price [NUMERIC(18,3)]
- stock [INTEGER]
- details [JSON] > Example {items: [{name: "name1", value: "value1"}, {name: "name2", value: "value2"}]}
- image [VARCHAR(255)]
- status [INTEGER] > Disabled = 0, Enabled = 1
- created [DATE]

#### Shopping Cart (TABLE shopping_cart)
> MANY TO MANY (users <-> products)
- id [SERIAL PRIMARY KEY]
- user_id [INTEGER] > Forgien Key [users.id](#Users-TABLE-users)
- product_id [INTEGER] > Forgien Key [products.id](#Products-TABLE-products)
- qty [INTEGER]
- note [TEXT]
- created [DATE]

#### Category Path (FUNCTION category_path)
> RETURN THE CATEGORY PATH OF PRODUCTS LIKE (Computers >> Laptops)
- category_path([category_id](#Categories-TABLE-categories)) > (category) [TEXT]


#### Shopping Cart View (VIEW cart_view)
> SHOPPING CART LEFT JOIN PRODUCTS LEFT JOIN CATEGOREIS
- id [INTEGER]  > from [shopping_cart.id](#Shopping-Cart-TABLE-shopping_cart)
- user_id [INTEGER] > from [shopping_cart.user_id](#Shopping-Cart-TABLE-shopping_cart)
- product_id [INTEGER] > from [shopping_cart.product_id](#Shopping-Cart-TABLE-shopping_cart)
- qty [INTEGER] > from [shopping_cart.qty](#Shopping-Cart-TABLE-shopping_cart)
- name [VARCHAR(255)] > from [products.name](#Products-TABLE-products)
- description [TEXT] > from [products.description](#Products-TABLE-products)
- category [TEXT] > from function [category_path](#Category-Path-FUNCTION-category_path)([products.category_id](#Products-TABLE-products))
- price [NUMERIC(18,3)] > from [products.price](#Products-TABLE-products)
- total [NUMERIC(18,3)] > from [products.price](#Products-TABLE-products) * [shopping_cart.qty](#Shopping-Cart-TABLE-shopping_cart)
- details [JSON] > from [products.details](#Products-TABLE-products)
- image [VARCHAR(255)] > from  [products.image](#Products-TABLE-products)
- note [TEXT] > from  [shopping_cart.note](#Shopping-Cart-TABLE-shopping_cart)

#### Orders (TABLE orders)
> ONE TO MANY (users -> orders)

> ORDERS IS SEPREATED AND SELF CONTAINED TABLE ITS PROCCESS SHOPPING CART TO FINALY BECOME A COMPLETED ORDER AND IF USERS OR PRODCUTS DELETED OR CHANGED WILL NOT EFFECTS THE ORDERS CONTENT STORAGE FOR BETTER OPTIMIZED STATICTICS 
- id [SERIAL PRIMARY KEY]
- user_id [INTEGER] > from [users.id](#Users-TABLE-users) with no refrence effect on delete or change
- user_info [JSON] > from [Users](#Users-TABLE-users) Data As JSON Format
- qty_count [INTEGER] > from sum of [cart_view.qty](#Shopping-Cart-View-VIEW-cart_view)
- total [NUMERIC(18,3)] > from sum of [cart_view.total](#Shopping-Cart-View-VIEW-cart_view)
- confirmed_by [INTEGER] > from admin [users.id](#Users-TABLE-users)
- confirmed_date [DATE]
- payment_type [INTEGER] >  COD = 1, VISA = 2
- note [TEXT] > from [cart_view.note](#Shopping-Cart-View-VIEW-cart_view)
- status [INTEGER] > PENDING = 1, CONFIRMED = 2, DELIVERING = 3, COMPLETED = 4, REFUNDING = 5, REFUNDED = 6
- created [DATE]

#### OrderItems (TABLE order_items)
> MANY TO MANY (products <-> orders <- users)

> ORDERS ITEMS IS SEPREATED AND SELF CONTAINED TABLE ITS STORE  SHOPPING CART ITEMS FOR ORDER AND IF USERS OR PRODCUTS DELETED OR CHANGED WILL NOT EFFECTS THE ORDERS ITEMS CONTENT STORAGE FOR BETTER OPTIMIZED STATICTICS 
- id [SERIAL PRIMARY KEY]
- order_id [INTEGER] > Forgien Key [orders.id](#Orders-TABLE-orders)
- product_id [INTEGER] > from [cart_view.products_id](#Shopping-Cart-View-VIEW-cart_view) with no refrence effect on delete or change
- product_info [JSON] > from [Products](#Products-TABLE-products) Data As JSON Format
- qty [INTEGER] > from [cart_view.qty Item](#Shopping-Cart-View-VIEW-cart_view)
- price [NUMERIC(18,3)] > from sum of [cart_view.price](#Shopping-Cart-View-VIEW-cart_view) Item
- total [NUMERIC(18,3)] > from sum of [cart_view.total](#Shopping-Cart-View-VIEW-cart_view) Item
- status [INTEGER] > PENDING = 1, CONFIRMED = 2, DELIVERING = 3, COMPLETED = 4, REFUNDING = 5, REFUNDED = 6
- note [TEXT] > from [cart_view.note](#Shopping-Cart-View-VIEW-cart_view)


#### Orders User View (VIEW orders_user_view)
> RETUREN ORDERS ROWS COMPAINED WITH A COLUMN WITH IMPORTED ORDER ITEMS AS JSON FORMAT
- id [INTEGER] > from [orders.id](#Orders-TABLE-orders)
- user_id [INTEGER] > from [orders.user_id](#Orders-TABLE-orders)
- qty_count [INTEGER] > from [orders.qty_count](#Orders-TABLE-orders)
- total [NUMERIC(18,3)] > from [orders.total](#Orders-TABLE-orders)
- confirmed_by [INTEGER] > from [orders.confirmed_by](#Orders-TABLE-orders)
- confirmed_date [DATE] > from [orders.confirmed_date](#Orders-TABLE-orders)
- payment_type [INTEGER] >  from [orders.payment_type](#Orders-TABLE-orders)
- note [TEXT] > from [orders.note](#Orders-TABLE-orders)
- status [INTEGER] > from [orders.status](#Orders-TABLE-orders)
- created [DATE] > from [orders.created](#Orders-TABLE-orders)
- items [JSON] > compained JSON build from [order_items](#OrderItems-TABLE-order_items) rows on order.id


#### User View (VIEW user_view)
> RETUREN USERS ROWS COMPAINED WITH 4 COMPAINED COLUMNS
- id [INTEGER] > from [users.id](#Users-TABLE-users)
- first_name [VARCHAR] > from [users.first_name](#Users-TABLE-users)
- last_name [VARCHAR] > from [users.last_name](#Users-TABLE-users)
- birthday [DATE] > from [users.birthday](#Users-TABLE-users)
- email [VARCHAR] > from [users.email](#Users-TABLE-users)
- mobile [VARCHAR] > from [users.mobile](#Users-TABLE-users)
- role [INTEGER] > from [users.role](#Users-TABLE-users)
- created [DATE] > from [users.created](#Users-TABLE-users)
- order_count [INTEGER] > from [count(user_id)](#Orders-TABLE-orders) in [orders](#Orders-TABLE-orders) on [order.user_id](#Orders-TABLE-orders)
- order_sum [NUMERIC(18,3)] > from [sum(total)](#Orders-TABLE-orders) in [orders](#Orders-TABLE-orders) on [order.user_id](#Orders-TABLE-orders)
- most_products [JSON] > compained JSON build from [order_items.product_info](#OrderItems-TABLE-order_items) from [orders](#Orders-TABLE-orders) on [order.user_id](#Orders-TABLE-orders)
- last_orders [JSON] > compained JSON build from [order](#Orders-TABLE-orders) rows on [order.user_id](#Orders-TABLE-orders)


#### Products View (VIEW product_view)
> RETURN PRODUCTS WITH COMPAINED CULOMN CATEGORY PATH
- id [INTEGER] > from [products.id](#Products-TABLE-products)
- name [VARCHAR] > from [products.name](#Products-TABLE-products)
- description [TEXT] > from [products.description](#Products-TABLE-products)
- category [TEXT] > from function [category_path](#Category-Path-FUNCTION-category_path)([products.category_id](#Products-TABLE-products))
- price [NUMERIC(18,3)] > from [products.price](#Products-TABLE-products)
- details [JSON] > from [products.details](#Products-TABLE-products)
- image [VARCHAR] > from [products.image](#Products-TABLE-products)

#### Process Orders From Shopping Cart (FUNCTION create_order)
> PROCESS CREATION OF NEW ORDER FROM CART THEN RETURN THE CREATED ORDER ID
- create_order([users.id](#Users-TABLE-users) [INTEGER] , payment_type [INTEGER], note [TEXT]) > ([orders.id](#Orders-TABLE-orders)) [INTEGER]




#### Orders View (VIEW orders_view)
> RETURN PRODUCTS WITH COMPAINED CULOMN ORDER ITEMS ROW AS JSON
- id [INTEGER] > from [orders.id](#Orders-TABLE-orders) 
- user_id [INTEGER] > from [orders.user_id](#Orders-TABLE-orders) 
- user_info [JSON] > from [orders.user_info](#Orders-TABLE-orders) 
- qty_count [INTEGER] > from [orders.qty_count](#Orders-TABLE-orders)
- total [NUMERIC(18,3)] > from [orders.total](#Orders-TABLE-orders)
- confirmed_by [INTEGER] > from [orders.confirmed_by](#Orders-TABLE-orders)
- confirmed_date [DATE] > from [orders.confirmed_date](#Orders-TABLE-orders)
- payment_type [INTEGER] > from [orders.payment_type](#Orders-TABLE-orders)
- note [TEXT] > from [orders.note](#Orders-TABLE-orders)
- status [INTEGER] > from [orders.status](#Orders-TABLE-orders)
- created [DATE] > from [orders.created](#Orders-TABLE-orders)
- items [JSON] > compained JSON build from [order_items](#OrderItems-TABLE-order_items) rows on [order.id](#Orders-TABLE-orders)


#### Top Purchased Products View (VIEW top_purchased_products)
> RETURN PRODUCTS ID & PRODUCTS COUNT FROM ORDER ITEMS WHERE ORDER ITEMS HAS BEEN COMPLETED FROM ORDER THAT PURSHASED IN 30 DAYS
- product_id [INTEGER] > from [order_items.product_id](#OrderItems-TABLE-order_items)
- product_count [INTEGER] > from COUNT([order_items.product_id](#OrderItems-TABLE-order_items))


#### Top Pending Products View (VIEW top_pending_products)
> RETURN PRODUCTS ID & PRODUCTS COUNT FROM ORDER ITEMS WHERE ORDER ITEMS IS STILL PENDING FROM ORDER THAT PURSHASED IN 30 DAYS
- product_id [INTEGER] > from [order_items.product_id](#OrderItems-TABLE-order_items)
- product_count [INTEGER] > from COUNT([order_items.product_id](#OrderItems-TABLE-order_items))

#### Users Pending Shopping Cart View (VIEW pending_carts)
> RETURN USERS WITH COMPAINED SHOPPING CART ROWS THAT WAITING FOR PROCCESSING TO NEW ORDER
- id [INTEGER] > from [users.id](#Users-TABLE-users)
- first_name [VARCHAR] > from [users.first_name](#Users-TABLE-users)
- last_name [VARCHAR] > from [users.last_name](#Users-TABLE-users)
- birthday [DATE] > from [users.birthday](#Users-TABLE-users)
- email [VARCHAR] > from [users.email](#Users-TABLE-users)
- mobile [VARCHAR] > from [users.mobile](#Users-TABLE-users)
- role [INTEGER] > from [users.role](#Users-TABLE-users)
- created [DATE] > from [users.created](#Users-TABLE-users)
- cart_items [JSON] > from [cart_view](#Shopping-Cart-View-VIEW-cart_view) rows on [cart_view.user_id](#Shopping-Cart-View-VIEW-cart_view)

## Access API
> 🔴 Means Reqiuerd Admin Token 

> 🟢 Means Reqiuerd User Or Admin Token 

> ⚪ Means No Token Reqiuerd   

> ADMINS ALLWAYS CAN HAVE USERS ROLE

> USE HTTP_PORT FROM .ENV THAT YOU PROVIDED BEFORE STARTING THE SERVER

### Users Access API

#### Index Users 
> GENERATE ONLY ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

`GET /api/users` 🔴
```
Authorization: Bearer {TOKEN}

    http://localhost:{HTTP_PORT}/api/users

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "first_name": "Admin",
            "last_name": "Admin",
            "birthday": "1990-03-30T22:00:00.000Z",
            "email": "admin@admin.com",
            "mobile": "01111111111",
            "role": 1,
            "created": "2022-03-22T02:03:50.662Z",
            "order_count": 0,
            "order_sum": 0,
            "most_products": [],
            "last_orders": []
        }
    ]
``` 

#### Show Users 
> GENERATE USER OR ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`GET /api/users/:id` 🟢
```
Authorization: Bearer {TOKEN}

    http://localhost:{HTTP_PORT}/api/users/1

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "first_name": "Admin",
            "last_name": "Admin",
            "birthday": "1990-03-30T22:00:00.000Z",
            "email": "admin@admin.com",
            "mobile": "01111111111",
            "role": 1,
            "created": "2022-03-22T02:03:50.662Z",
            "order_count": 0,
            "order_sum": 0,
            "most_products": [],
            "last_orders": []
        }
    ]
``` 

#### Add Users 
> NO TOKEN IS REQUIERD

> IF ADMIN TOKEN PROVIDED YOU CAN CREATE ADMIN ROLE OR MORDERATORS

`POST /api/users/add` ⚪
```
    http://localhost:{HTTP_PORT}/api/users/add

DATA SEND {
            "email": "user@user.com",
            "password": "123456789",
            "first_name": "User",
            "last_name": "User",
            "birthday": "1990-01-01",
            "mobile": "02222222222",
            "role": "3" // ONLY AVALIABLE FOR ADMIN TOKENS
        }


RESPONSE >>

    HTTP/1.1 201 CREATED
    Content-Type: application/json

    {
        "id": 2,
        "first_name": "User",
        "last_name": "User",
        "birthday": "1990-03-31T22:00:00.000Z",
        "email": "user@user.com",
        "mobile": "02222222222",
        "role": 3,
        "created": "2022-03-22T18:31:47.119Z"
    }
``` 

#### Update Users 
> GENERATE USER OR ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`PUT /api/users/:id` 🟢
```
    http://localhost:{HTTP_PORT}/api/users/2

DATA SEND {
            "email": "user2@user2.com",
            "first_name": "User2",
            "last_name": "User2",
            "birthday": "1980-01-01",
            "mobile": "01222222222",
        }


RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 2,
        "first_name": "User2",
        "last_name": "User2",
        "birthday": "1979-12-31T22:00:00.000Z",
        "email": "user2@user2.com",
        "mobile": "01222222222",
        "role": 3,
        "created": "2022-03-22T18:31:47.119Z"
    }
``` 

#### Delete Users 
> GENERATE ONLY ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`DELETE /api/users/:id` 🔴
```
    http://localhost:{HTTP_PORT}/api/users/2

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 2,
        "first_name": "User2",
        "last_name": "User2",
        "birthday": "1979-12-31T22:00:00.000Z",
        "email": "user2@user2.com",
        "mobile": "01222222222",
        "role": 3,
        "created": "2022-03-22T18:31:47.119Z"
    }


``` 

##### Reset Users Password
> GENERATE ONLY USER TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`PUT /api/users/:id/reset` 🟢
```
    http://localhost:{HTTP_PORT}/api/users/1/reset

DATA SEND {
            "currentPassword": "123456789",
            "newPassword": "987654321",
            "confirmNew": "987654321"
        }


RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 1,
        "first_name": "Admin",
        "last_name": "Admin",
        "birthday": "1990-03-30T22:00:00.000Z",
        "email": "admin@admin.com",
        "mobile": "01111111111",
        "role": 1,
        "created": "2022-03-22T02:03:50.662Z"
    }
``` 

#### Users Login 
> NO TOKEN IS REQUIERD

`POST /api/users/auth` ⚪
```
    http://localhost:{HTTP_PORT}/api/users/auth

DATA POST {
            "email": "admin@admin.com",
            "password": "123456789"
        }


RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "success": true,
        "err": {},
        "data": {
            "exp": 1647968643.42,
            "data": {
                "id": 1,
                "first_name": "Admin",
                "last_name": "Admin",
                "role": 1
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDc5Njg2NDMuNDIsImRhdGEiOnsiaWQiOjEsImZpcnN0X25hbWUiOiJBZG1pbiIsImxhc3RfbmFtZSI6IkFkbWluIiwicm9sZSI6MX0sImlhdCI6MTY0Nzk2NTA0M30.Cdv5PPb_47-Qb7K5FOHS58JK-E6BDlYxmDuMFt1G8go"
    }
``` 


#### Index Users 
> GENERATE ONLY ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

`GET /api/users` 🔴
```
Authorization: Bearer {TOKEN}

    http://localhost:{HTTP_PORT}/api/users

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "first_name": "Admin",
            "last_name": "Admin",
            "birthday": "1990-03-30T22:00:00.000Z",
            "email": "admin@admin.com",
            "mobile": "01111111111",
            "role": 1,
            "created": "2022-03-22T02:03:50.662Z",
            "order_count": 0,
            "order_sum": 0,
            "most_products": [],
            "last_orders": []
        }
    ]
``` 


### Categories Access API

#### Create Categories 
> GENERATE ONLY ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

`POST /api/users/add` 🔴
```
    http://localhost:{HTTP_PORT}/api/categories/add

DATA SEND {
            "email": "user@user.com",
            "password": "123456789",
            "first_name": "User",
            "last_name": "User",
            "birthday": "1990-01-01",
            "mobile": "02222222222",
            "role": "3" // ONLY AVALIABLE FOR ADMIN TOKENS
        }


RESPONSE >>

    HTTP/1.1 201 CREATED
    Content-Type: application/json

    {
        "id": 2,
        "first_name": "User",
        "last_name": "User",
        "birthday": "1990-03-31T22:00:00.000Z",
        "email": "user@user.com",
        "mobile": "02222222222",
        "role": 3,
        "created": "2022-03-22T18:31:47.119Z"
    }
``` 


#### Index Categories 
> GENERATE ONLY ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

`GET /api/users` 🔴
```
Authorization: Bearer {TOKEN}

    http://localhost:{HTTP_PORT}/api/users

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "first_name": "Admin",
            "last_name": "Admin",
            "birthday": "1990-03-30T22:00:00.000Z",
            "email": "admin@admin.com",
            "mobile": "01111111111",
            "role": 1,
            "created": "2022-03-22T02:03:50.662Z",
            "order_count": 0,
            "order_sum": 0,
            "most_products": [],
            "last_orders": []
        }
    ]
``` 

#### Show Categories 
> GENERATE USER OR ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`GET /api/users/:id` 🟢
```
Authorization: Bearer {TOKEN}

    http://localhost:{HTTP_PORT}/api/users/1

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
        {
            "id": 1,
            "first_name": "Admin",
            "last_name": "Admin",
            "birthday": "1990-03-30T22:00:00.000Z",
            "email": "admin@admin.com",
            "mobile": "01111111111",
            "role": 1,
            "created": "2022-03-22T02:03:50.662Z",
            "order_count": 0,
            "order_sum": 0,
            "most_products": [],
            "last_orders": []
        }
    ]
``` 


#### Update Categories 
> GENERATE USER OR ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`PUT /api/users/:id` 🟢
```
    http://localhost:{HTTP_PORT}/api/users/2

DATA SEND {
            "email": "user2@user2.com",
            "first_name": "User2",
            "last_name": "User2",
            "birthday": "1980-01-01",
            "mobile": "01222222222",
        }


RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 2,
        "first_name": "User2",
        "last_name": "User2",
        "birthday": "1979-12-31T22:00:00.000Z",
        "email": "user2@user2.com",
        "mobile": "01222222222",
        "role": 3,
        "created": "2022-03-22T18:31:47.119Z"
    }
``` 

#### Delete Categories 
> GENERATE ONLY ADMIN TOKEN TO CAN ACCESS THIS ENDPOINT

> CHANGE :id WITH USER ID NUMBER

`DELETE /api/users/:id` 🔴
```
    http://localhost:{HTTP_PORT}/api/users/2

RESPONSE >>

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "id": 2,
        "first_name": "User2",
        "last_name": "User2",
        "birthday": "1979-12-31T22:00:00.000Z",
        "email": "user2@user2.com",
        "mobile": "01222222222",
        "role": 3,
        "created": "2022-03-22T18:31:47.119Z"
    }


``` 
