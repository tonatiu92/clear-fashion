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
  response.send({'ack2': true});
});



app.get("/products/search", (request, response) =>{
  let {limit = 12 ,brand,price} = request.query
  let agg = null
  if(brand==undefined && price == undefined){
    agg = [{$limit:parseInt(limit)}]
  }
  else if(brand==undefined){
    agg = [{$match:{$and:[{"price":{$lte : parseInt(price)}}]}},{$limit:parseInt(limit)}]
  }
  else if(price==undefined){
    agg = [{$match:{$and:[{"brand" : brand}]}},{$limit:parseInt(limit)}]
  }
  else{
    agg = [{$match:{$and:[{"price":{$lte : parseInt(price)}},{"brand" : brand}]}},{$limit:parseInt(limit)}]
  }
  db.aggregate(agg).then(x => response.send(x)).catch(e => response.send(e))
})

//http://localhost:8092/products/5312759f-8530-5740-ae14-947e62ad094e
app.get('/products/:id',(request, response) => {
  db.find({"_id":request.params.id}).then(x => response.send(x)).catch(e => response.send(e))
})

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
