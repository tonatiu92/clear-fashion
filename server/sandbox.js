/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adressebrand = require("./sources/adressebrand");
const fs = require("fs");

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    if (eshop.match("adresse")!=null){
      const products = await adressebrand.scrape(eshop);
      console.log(products);
      let data = JSON.stringify(products)
      fs.writeFileSync("adresse_products.json",data)
      console.log('done');
      process.exit(0);
    }
    else if(eshop.match("dedicated")!=null){
      const products = await dedicatedbrand.scrape(eshop);
      console.log(products);
      let data = JSON.stringify(products)
      fs.writeFileSync("dedicated_products.json",data)
      console.log('done');
      process.exit(0);
    }
    else if(eshop.match("montlimar")!=null){
      const products = await montlimartbrand.scrape(eshop);
      console.log(products);
      let data = JSON.stringify(products)
      fs.writeFileSync("montlimar_products.json",data)
      console.log('done');
      process.exit(0)
    }


    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);