# node-postgres-koa
Tiny api in nodejs(koa) and postgresql .<br />

## Get Started
To build the nodejs app with Docker use following commands

`docker-compose up --build` <br/>

**POST /api/products/** expects json with the following format
```javascript
  {
    "product":{
    "name": "A",
    "category": "Some category",
    "price": "23.33"
    }
  }
```
**GET /api/products/** returns all products <br /><br />
**PUT /api/products/:id** REQUIRES AUTH update product info by id <br /><br />
**DELETE /api/products/:id** REQUIRES AUTH delete product info by id<br /><br />

**POST /api/orders/** expects json with the following format
```javascript
  {
    "order":{
    "date": "2012-12-01",
    "products": [1,2,3],
    "status": "PENDING"
    }
  }
```
**GET /api/orders/** returns all orders <br /><br />
**PUT /api/order/status/:id** REQUIRES AUTH update order status by id <br /><br />

**POST /api/users/login expects json wwith the following format (user is prepopulated)
```javascript
  {
    "user":{
    "name": "test_admin",
    "password": "test",
    }
  }
```


