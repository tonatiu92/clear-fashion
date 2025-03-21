const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  return $('.main-container .category-products .item ')
    .map((i, element) => {
      const name = $(element)
        .find('.product-info')
        .text()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[0-9]|,|€/g,"")
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      
      );
      if ($(element).find(' .product-image')[0]!= undefined){
        const link = $(element)
        .find(' .product-image')[0].children[1].attribs.href
        return {name, price,  brand: "montlimar", link};
      }
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
