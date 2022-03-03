/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adressebrand = require("./sources/adressebrand");
const fs = require("fs");
let product_list = [];

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    checkFile()
    if (eshop.match("adresse")!=null){
      scrape(await adressebrand.scrape(eshop));
    }
    else if(eshop.match("dedicated")!=null){
      scrape(await dedicatedbrand.scrape(eshop));
    }
    else if(eshop.match("montlimar")!=null){
      scrape(await montlimartbrand.scrape(eshop));
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
let checkFile =() =>{
  fs.access('products.json', fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFileSync("products.json", "[");
      fs.access('products.json', fs.constants.F_OK, (err) => {
        if (err)
          console.error('File does not exist');
      });
    }
    else{
      
    }
  });
}

let readProductList = () => {
  let products = fs.readFileSync("products.json", "utf-8")
  product_list = JSON.parse(products)
  fs.writeFileSync("products.json",products.replace(products[products.length-1],""))
}
let scrape = products =>{
  console.log(products);
  products.forEach(x => {
    if (x in product_list){

    }
    else if (x != products[products.length -1])
      fs.appendFileSync("products.json",JSON.stringify(x) + ",")
    else
      fs.appendFileSync("products.json",JSON.stringify(x))
  })
  fs.appendFileSync("products.json","]")
  console.log('done');
  process.exit(0);
}

const [,, eshop] = process.argv;

sandbox(eshop);