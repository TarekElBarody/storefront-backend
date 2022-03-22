# API Endpoints & Database Schema

Use the coming structre to can undertand and maintaned the functionality of the storefront backend API and database schema and to learn how to process and access difrent endpoint to perform defrent actions
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
* For Admins
> CHANGE :id WITH Order ID NUMBER
- Index  🔴    -  GET [/api/orders](#Index-Orders)     
- Show  🔴    -  GET [/api/orders/:id](#Show-Orders)     
- Create  🔴    -  POST [/api/orders/add](#Add-Orders)
- Update 🔴    -  PUT [/api/orders/:id](#Update-Orders)
- Delete 🔴   -  DELETE [/api/orders/:id](#Delete-Orders)

* For Users
> CHANGE :id WITH User ID NUMBER & :oid with Order ID NUMBER
- Process 🟢    -  POST [/api/orders/process](#Process-Orders)
- Index 🟢   -  DELETE [/api/users/:id/orders](#User-Orders)
- Show 🟢   -  DELETE [/api/users/:id/orders/:oid](#User-Orders)


## Database Shcema
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
