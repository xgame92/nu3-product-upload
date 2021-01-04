# nu3-product-upload
NU3.DE Task 

Crate SPA application where we can upload xml or csv files and write them to a database 

## Express.js API Requirements

- [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
- [Yarn](https://yarnpkg.com/en/docs/install)

#### Install dependencies:

```bash
yarn
```

#### Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn start
```

## V1 API Docs
Upload csv or xml file (put file into form body)
```bash
POST FORM// http://localhost:3000/v1/products/upload
```
Get all uploaded csv or xml files
```bash
GET // http://localhost:3000/v1/products/files
```
Get uploaded csv or xml file by name
```bash
GET // http://localhost:3000/v1/products/file/{xml-or-csv-file-name}
```
## Todo
- [x] create express.js server
- [x] create API for list uploaded products
- [x] create API for get uploaded product
- [x] create API for upload product.xml and inventory.csv
- [x] create Vue.js UI
- [x] create UI for upload product.xml and inventory.csv
- [ ] add unit tests
- [x] Passwordless authentication With a single use code to given email or github account
- [ ] add automated tests
- [ ] add webhooks (A request to given url after every single row update.These requests should be sent only for changed rows.You can use https://requestbin.com/ for testing)



## Inspirations

- [tutts/es6-express-mongoose-passport-rest-api](https://github.com/tutts/es6-express-mongoose-passport-rest-api)
- [danielfsousa/express-rest-boilerplate](https://github.com/danielfsousa/express-rest-boilerplate)
