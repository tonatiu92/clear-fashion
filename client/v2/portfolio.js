// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand="All"
let currentSort = "";
let favoriteProduct = [];
//RAJOUTER: 


//Save the whole database
let CompleteBase = [];
let MyFavorite ={};


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const sectionFavorites = document.querySelector("#Favorites")
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrands = document.querySelector("#brand-select");
const selectRecProd = document.querySelector("#By-recently-released");
const selectReasPrice = document.querySelector("#By-reasonable-price");
const selectSort = document.querySelector("#sort-select");
const spanNbNewProducts = document.querySelector("#nbNewProducts");
const spanp50 = document.querySelector("#p50");
const spanp90 = document.querySelector("#p90");
const spanp95 = document.querySelector("#p95");
const lastDate = document.querySelector("#lastDate")
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12,brand="") => {
  if (brand == "All")
    brand="";
  try {
    const response = await fetch(
      //`https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brand}`
      `https://server-smoky-beta.vercel.app/products/search?limit=${size}&brand=${brand}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {   
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <input name ="${product.name}" type="button" value="Fav" onclick="AddFavorite(this)">
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;                   
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

function AddFavorite(event) {
  const addFav = currentProducts.find(product => product.name == event.name)
  favoriteProduct.push(addFav)
  renderFavorite()
}

const renderFavorite = ()=>{
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = favoriteProduct
    .map(product => {   
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <input name ="${product.name}" type="button" value="Del" onclick="DelFavorite(this)">
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;                   
  fragment.appendChild(div);
  sectionFavorites.innerHTML = '<h2>Favorites</h2>';
  sectionFavorites.appendChild(fragment);
}
function DelFavorite(event) {
  const del_index = favoriteProduct.indexOf(currentProducts.find(product => product.name == event.name))
  favoriteProduct.splice(del_index,1)
  renderFavorite()
}

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;

  //Feature 9
  spanNbNewProducts.innerHTML = parseInt(CompleteBase.result.filter(a =>  (new Date()/86400000 - new Date(a.released)/86400000) < 15).length);

  //Feature 10
  spanp50.innerHTML = parseInt(pValues(0.5));
  spanp90.innerHTML = parseInt(pValues(0.9));
  spanp95.innerHTML = parseInt(pValues(0.95));
  lastDate.innerHTML = CompleteBase.result.reduce(function(a, b) {return  new Date(a.released)<new Date(b.released) ? b : a}).released;

};

const renderBrands = products =>{
  let options = "<option value=All>All</option>" + Array.from(
    new Set(products.map(a => a.brand)),
      (value) => `<option value="${value}">${value}</option>`
    ).join('');
  selectBrands.innerHTML = options;

}

const render = (products, pagination) => {
  let products_2 = check_reas_price(products);
  let products_3 = check_rec_rel(products_2);
  let products_4 = selectedSort(products_3);
  renderProducts(products_4);
  renderPagination(pagination);
  renderFavorite();
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  CompleteBase = await fetchProducts(1, 199);
  renderBrands(CompleteBase.result);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Feature 0:Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value),currentBrand);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Feature 1: Browse pages
 */

 selectPage.addEventListener('change', async (event) =>{
  const products = await fetchProducts(parseInt(event.target.value), currentProducts.length,currentBrand);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
})

/**
 * Feature 2: Filter By Brand
 */
 selectBrands.addEventListener('change', async (event) =>{
  const products = await fetchProducts(currentPagination.currentPage, currentProducts.length,event.target.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  currentBrand = event.target.value;
})

/**
 * Feature 3: Filter by recent products
 */
selectRecProd.addEventListener("change", async (event) =>{
  render(currentProducts, currentPagination);

})
const check_rec_rel = products =>{
  var checkbox = document.getElementById("By-recently-released")
  if(checkbox.checked == true){
    return products.filter(a =>  (new Date()/86400000 - new Date(a.date)/86400000) < 15)
  }
  else{
    return products
  }

}
/**
 * Feature 4 Filter by reasonable price
 */

 selectReasPrice.addEventListener("change", async(event) =>{
  render(currentProducts, currentPagination,currentBrand);
});

const check_reas_price = products =>{
  var checkbox = document.getElementById("By-reasonable-price")
  if(checkbox.checked == true){
    return products.filter(a =>a.price < 50 )
  }
  else{
    return products
  }
}


/**
 * Feature 5 Sort by Price
 * Feature 6 Sort by Date
 */
 selectSort.addEventListener('change', async (event) => {
  currentSort = event.target.value;
  render(currentProducts, currentPagination,currentBrand);
  
});

const selectedSort = products =>{
  switch(currentSort){
    case "price-asc":
      return products.sort((a,b)=>(a.price > b.price) ? 1 :-1);
    case "price-desc":
      return products.sort((a,b)=>(a.price < b.price) ? 1 :-1);
    case "date-asc":
      return products.sort((a,b)=>(a.date < b.date) ? 1 :-1);
    case "date-desc":
      return products.sort((a,b)=>(a.date > b.date) ? 1 :-1);
    default:
      return products
  } 
}

/**
 * Feature 8 Number of products indicator
 */

//OK


/**
 * Feature 9 Number of recent products indicator
 */

//OK

/**
 * Feature 10 p50, p90 and p95 price value
 */

 function percentile(arr, p) {
  if (arr.length === 0) return 0;
  if (typeof p !== 'number') throw new TypeError('p must be a number');
  if (p <= 0) return arr[0];
  if (p >= 1) return arr[arr.length - 1];

  var index = (arr.length - 1) * p,
      lower = Math.floor(index),
      upper = lower + 1,
      weight = index % 1;

  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}

function pValues(p){
  var list_of_price = []
  CompleteBase.result.forEach(a => list_of_price.push(a.price));
  return percentile(list_of_price.sort((a,b) => a-b), p);
}

/**
 * Feature 11: Last released date indicator
 */
//OK

/**
 * Feature 12: Open product link
 */

//OK

/**
 * Feature 13: Save as favorite
 */
//ok

/**
 * Feature 14: Filter by favorite
 */

