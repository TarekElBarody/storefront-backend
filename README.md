# Storefront-Backend

This is a starter API application for building Store Backend routes to manage and process Shopping Cart, Orders, Categories, Products, Users, JWT Authentication && Store data in Database PostgreSQL.
> modules [`nodeJS`](https://nodejs.org/en/) with [`Express`](https://www.npmjs.com/package/expresss), [`TypeScript`](https://www.npmjs.com/package/typescript) , [`ESlint`](https://www.npmjs.com/package/eslint), [`Prettier`](https://www.npmjs.com/package/prettier) , [`Jasmine`](https://www.npmjs.com/package/jasmine) , [`supertest`](https://www.npmjs.com/package/supertest) , [`pg`](https://www.npmjs.com/package/pg) , [`dotenv`](https://www.npmjs.com/package/dotenv) , [`compression`](https://www.npmjs.com/package/compression) , [`bcrypt`](https://www.npmjs.com/package/bcrypt) , [`db-migrate`](https://www.npmjs.com/package/db-migrate) , [`db-migrate-pg`](https://www.npmjs.com/package/db-migrate-pg) , [`morgan`](https://www.npmjs.com/package/morgan) , [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) , [`cors`](https://www.npmjs.com/package/cors) , [`helmet`](https://www.npmjs.com/package/helmet) . 

- The API application supports SSL and is ready to work on both HTTP and HTTPS. [Create Self Signed Certificate](https://devcenter.heroku.com/articles/ssl-certificate-self)
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
  - User can process cart and create new order.
  - User can update their owen information
- All necessary checks have been done as a reference that you can develop on
- Strong typing is providing by Typescript for reduce errors
- Testing all Models and Handlers and Functions

# Table of contents:

- [Database Setup](#Database-Setup)
- [Environment Setup](#Environment-Setup)
- [App Directory](#App-Directory) 
- [Running the server](#Running-the-server)
	 - [Starting the server](#Starting-the-server)
	 - [Linting code error](#Linting-code-error)
	 - [Formatting the code](#Formatting-the-code)
	 - [Clean destination folder](#Clean-dist-folder)
	 - [build the project](#Build-the-project)
	 - [Build and Serve the project](#Build-and-Serve-the-project)
	 - [Run jasmine test](#Run-jasmine-test)
- [API Documentation](https://github.com/TarekElBarody/storefront-backend/blob/main/REQUIREMENTS.md)



# Database Setup 
- Using PostgreSQL 14
- [Download & Install PostgreSQL](https://www.postgresql.org/download/)
- Run psql script
- Create User & database :

```ssh
CREATE USER store_user WITH PASSWORD '123456789' SUPERUSER  CREATEDB CREATEROLE;
returns > CREATE ROLE

CREATE DATABASE store_db;
returns > CREATE DATABASE

CREATE DATABASE store_db_test;
returns > CREATE DATABASE

GRANT ALL PRIVILEGES ON DATABASE store_db TO store_user;
returns > GRANT

GRANT ALL PRIVILEGES ON DATABASE store_db_test TO store_user;
returns > GRANT

```


# Environment Setup 
- Using nodeJS v16.13.2 and NPM 8.4.1 [Download nodejs](https://nodejs.org/en/download/)
- If you using lower or higher version of node please use [Node Package Manager](https://nodejs.org/en/download/package-manager/)
- Install all modules by using :
```ssh
git clone https://github.com/TarekElBarody/storefront-backend.git
cd  storefront-backend
npm install
```
- Change .env.example to .env and fill necessary data
  * ENV                 # dev or test or production
  * HTTP_PORT           # http port like 8080 or 3000 
  * HTTPS_PORT          # https port like 8443 or 4000
  * POSTGRES_HOST       # postgreSQL database hostname for local use localhost
  * POSTGRES_DB         # dev database name "store_db"
  * POSTGRES_DB_TEST    # test database name "store_db_test"
  * POSTGRES_USER       # postgreSQL user name store_user
  * POSTGRES_PASSWORD   # postgreSQL user password like "123456789"
  * SECURE              # 0 or 1 to force using https secure connection and not allow regular http
  * MORGAN              # to enable Morgan to show http access log in console
  * PEPPER              # a secret word masked with users password to maximize security
  * ROUND               # bcrypt hasing rounds default 10
  * TOKEN_SECRET        # JWT token secret for generate tokens
  * SESSION_SLAT        # session security salt to secure the saved sessions by express
  * NO_CONSOLE          # 0 or 1 to enable or disable console log for logger function

- you can use this default values for .env

```
ENV=dev

HTTP_PORT=8080
HTTPS_PORT=8443

POSTGRES_HOST=localhost
POSTGRES_DB=store_db
POSTGRES_DB_TEST=store_db_test
POSTGRES_USER=store_user
POSTGRES_PASSWORD=123456789

SECURE=0
MORGAN=0

PEPPER=make-password-hash-harder
ROUND=10

TOKEN_SECRET=Cx3hmbWGG7GKpJHg0JsAu9tWUT9Wp0dBu9axV5rzKK7PR1ULKa

SESSION_SLAT=Cx3hmbWGG7GKpJHg0JsAu9tWUT9Wp0dBu9axV5rzKK7PR1ULKa

NO_CONSOLE=1
```

- Run db migration's
```ssh
npm run db-migrate
```

- You can create the store_db by using built in script

> you have to change the database name inside the package.json script block

```ssh
npm run prep-db
```

# App Directory 
```
   - dist                # transpile Typescript to es5 js to this folder
   - cert                # store ssl keys (server.cert) & (server.key)
   - logs                # store user logs and Morgan access server logs
   - public              # public folder for front-end (html > css > js)
   - spec                # configures for Jasmine Testing
   - src                 # source code for typescript *.ts
     - handlers          # endpoint handler files for model store
        - test           # test file for handlers file
     - lib               # function , middleware , helper , config , app
        - config         # config file like database.ts for database client configuration
        - function       # general functions & hash & token function & logger function
            - test       # test for important function like hashing and jwt tokens
        - helpers        # helper file like reporter for jasmine and session data
        - middleware     # express middleware controller like forcing https and jwt authentication
     - models            # all models file that connect to the database using CRUD SQL
        - test           # test file for Models file
     - routes            # API routs & web routs
     - services          # services controller for more complex data structure
        - controller     # controller files calls data binding from endpoint requests
          - test         # test for controller files 
        - dataBinding    # data joins and relations for complex data binding 
          - test         # test for data binding files
     - types             # configure all types for all data and function
   - package.json        # store all script and module and configuration for node project
   - tsconfig.json       # store Typescript Configuration
   - .prettierrc         # store Prettier configuration for code formatter
   - .eslintrc           # store ESlint code linting for typescript
   - database.json       # db-migrate configuration file
   - .env.example        # example of .env for store node environment sensitive data

```

## Running the server

#### Starting the server
> we user ts-node & nodemon to running the code
```ssh
npm run watch
> storefront-backend@1.0.0 db-test-drop
12:00:00 AM - Starting compilation in watch mode...


12:00:10 AM - Found 0 errors. Watching for file changes.
HTTP server on port 8080 at http://localhost:8080/api
HTTPS server on port 8443 at https://localhost:8443/api
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

[INFO] Processed migration 20220308230147-users-table
[INFO] Processed migration 20220314111816-categories-table
[INFO] Processed migration 20220314111824-products-table
[INFO] Processed migration 20220315125802-shopping-cart-table
[INFO] Processed migration 20220316041426-category-path-func
[INFO] Processed migration 20220316042444-cart-view
[INFO] Processed migration 20220316084230-orders-table
[INFO] Processed migration 20220316162325-order-items-table
[INFO] Processed migration 20220317064003-orders-user-view
[INFO] Processed migration 20220317064403-user-view
[INFO] Processed migration 20220317082605-product-view
[INFO] Processed migration 20220317082759-create-order-func
[INFO] Processed migration 20220317101941-orders-view
[INFO] Processed migration 20220320170043-top-purchased-products-view
[INFO] Processed migration 20220320170453-pending-carts-view
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
>   √ Should Generated Admin Token Success
>   √ Should Endpoint Insert New Categories
>   √ Should Endpoint Get All Categories
>   √ Should Endpoint Get Category Data
>   √ Should Endpoint Update Categories Data
>   √ Should Endpoint Delete Categories Data
>   √ Should Endpoint Error Category Require Token

  2 Test Orders Handlers EndPoint (ordersHandlerSpec)
>   √ Should Generated User & Admin Token Success
>   √ Should Endpoint User Process New Order
>   √ Should Endpoint Admin Create New Order
>   √ Should Endpoint User Get Order details
>   √ Should Endpoint User Get All His Orders
>   √ Should Endpoint Admin Get Order details
>   √ Should Endpoint Admin Get All Orders
>   √ Should Endpoint Admin Update Order to confirmed
>   √ Should Endpoint Admin Delete Order
>   √ Should Endpoint Error Order Require Token

  3 Test OrderItems Handlers EndPoint (orderItemsHandlerSpec)
>   √ Should Generated User & Admin Token Success
>   √ Should Endpoint Admin Insert New OrderItems
>   √ Should Endpoint Admin Get OrderItem details
>   √ Should Endpoint Admin Get All OrderItems
>   √ Should Endpoint Admin Update OrderItems QTY
>   √ Should Endpoint Admin Delete OrderItems
>   √ Should Endpoint Error OrderItems Require Token

  4 Test Products Handlers EndPoint (productsHandlerSpec)
>   √ Should Generated Admin Token Success
>   √ Should Endpoint Insert New Products
>   √ Should Endpoint Get All Products
>   √ Should Endpoint Get Product Data
>   √ Should Endpoint Update Products Data
>   √ Should Endpoint Delete Products Data
>   √ Should Endpoint Error Product Require Token

  5 Test ShoppingCarts Handlers EndPoint (shoppingCartsHandlerSpec)
>   √ Should Generated User Token Success
>   √ Should Endpoint User Insert New Shopping Cart Item
>   √ Should Endpoint User Insert New Shopping Cart Item 2
>   √ Should Endpoint User Get All Shopping Cart Items
>   √ Should Endpoint User Get  Shopping Cart Item
>   √ Should Endpoint User Update Shopping Cart Item 2
>   √ Should Endpoint User Delete Shopping Cart Item
>   √ Should Endpoint User Empty Shopping Cart Items
>   √ Should Endpoint Error ShoppingCart Require Token

  6 Test Users Handlers EndPoint (usersHandlerSpec)
>   √ Should Generated Admin Token Success
>   √ Should Endpoint Create New Users
>   √ Should Endpoint Get Auth Token
>   √ Should Endpoint Get User Data
>   √ Should Endpoint Admin Get All Users
>   √ Should Endpoint Update Users Data
>   √ Should Endpoint Reset User Password
>   √ Should Endpoint Delete Users Data
>   √ Should Endpoint Error User Require Token

  7 Test Hash & Token Function (hashSpec)
>   √ Should All Function Are defined
>   √ Should Hashing & verifying Password
>   √ Should Generate & verifying Tokens

  8 Test Category Model (categoryStoreSpec)
>   √ Should Category Model CRUD functions are defined
>   √ Should Insert New Category
>   √ Should Return Category Data
>   √ Should Return All Category Data
>   √ Should update Category - Just Name
>   √ Should Delete Category Data
>   √ Should Truncate Category Data

  9 Test OrderItems Model (orderItemsStoreSpec)
>   √ Should OrderItems Model CRUD functions are defined
>   √ Should Admin Insert New OrderItems
>   √ Should Return an OrderItems
>   √ Should Return All OrderItems
>   √ Should update OrderItems - Status CONFIRMED
>   √ Should Delete OrderItems
>   √ Should Truncate OrderItems Data

  10 Test Order Model (orderStoreSpec)
>   √ Should Order Model CRUD functions are defined
>   √ Should User Process New Order From Shopping Cart
>   √ Should Admin Create New Order
>   √ Should Return an Order
>   √ Should Return All Orders
>   √ Should Return All User Orders
>   √ Should update Order - Confirmed 
>   √ Should Delete Order
>   √ Should Truncate Order Data

  11 Test Product Model (productStoreSpec)
>   √ Should Product Model CRUD functions are defined
>   √ Should Insert New Product
>   √ Should Return Product Data
>   √ Should Return Product View
>   √ Should Return All Product Data
>   √ Should update Product - Just Price
>   √ Should Delete Product Data
>   √ Should Truncate Product Data

  12 Test ShoppingCart Model (shoppingCartStoreSpec)
>   √ Should ShoppingCart Model CRUD functions are defined
>   √ Should Insert New Shopping Cart Item
>   √ Should Return an Item from Shopping Cart
>   √ Should Return All User Items in the Shopping Cart
>   √ Should update Shopping Cart Item - Just QTY
>   √ Should Delete Shopping Cart Item
>   √ Should Empty Shopping Cart Item
>   √ Should Truncate ShoppingCart Data

  13 Test Users Model (userStoreSpec)
>   √ Should User Model CRUD functions are defined
>   √ Should Insert New User
>   √ Should Return User Data
>   √ Should Return User Hashed Password
>   √ Should Return All Users Data
>   √ Should update User - Just Email
>   √ Should Delete User Data
>   √ Should Truncate User Data

  14 Test API Endpoints Access (apiRouteSpec)
>   √ Should Endpoint is Responding 200 With Json
>   √ Should API Return error 404 Not found for not controlled endpoint

  15 Test Web Route Access (webRouteSpec)
>   √ Should Web Front is Responding

  16 Test Dashboard Service Controller (dashboardControllerSpec)
>   √ Should Generated Admin Token Success
>   √ Should Endpoint Return Top Purchased Products
>   √ Should Endpoint Return Top Pending Products
>   √ Should Endpoint Return List of Pending Shopping Cart
>   √ Should Endpoint Return List of Top Buyer

  17 Test Dashboard Service DataBinding (dashboardDataSpec)
>   √ Should OrderItems Model CRUD functions are defined
>   √ Should Return Top Purchased Products
>   √ Should Return Top Pending Products
>   √ Should Return List of Pending Shopping Cart
>   √ Should Return List of Top Buyer

>   Executed 112 of 112 specs SUCCESS in 5 secs.

> store-backend@1.0.0 db-test-drop
> db-migrate -e create db:drop store_db_test

[INFO] Deleted database "store_db_test"

```





