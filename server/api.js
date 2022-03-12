const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');


const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});



app.get("/products/search", (request, response) =>{
  const {limit,brand,price} = request.query
  db.aggregate([{$match:{$and:[{"price":parseInt(price)},{"brand" : brand}]}},{$limit:parseInt(limit)}]).then(x => response.send(x))
})

//http://localhost:8092/products/5312759f-8530-5740-ae14-947e62ad094e
app.get('/products/:id',(request, response) => {
  db.find({"_id":request.params.id}).then(x => response.send(x))
})

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
