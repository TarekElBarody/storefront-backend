# API Endpoint & Database Schema
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
- [Environment Setup](#Environment-Setup)

## API Endpoints
#### Users
> CHANGE :id WITH ACTUAL USER NUMBER
- Index  [admin token]   🚩    ✅ GET [/api/users](#Index-Users)     
- Show   [user token]    🚩    ✅ GET [/api/users/:id](#Show-Users)     
- Create [general role]  🏳     ✅ POST [/api/users/add](#Add-Users)
- Update [user token]    🚩    ✅ PUT [/api/users/:id](#Update-Users)
- Delete [admin token]   🚩    ✅ DELETE [/api/users/:id](#Delete-Users)
- Reset  [user token]    🚩    ✅ PUT [/api/users/:id/reset](#Reset-Users)
- Login  [user token]    🚩    ✅ DELETE [/api/users/auth](#Login-Users)


- Index 
- Show
- Create [token required] <span style="color:orange;">Word up</span>
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required] 🚩
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

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
