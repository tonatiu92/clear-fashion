require('dotenv').config();
const {MongoClient, ServerApiVersion} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
//const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = "mongodb+srv://tonatiu:3pwpGDFRracIL9EG@cluster0.b4dzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */

const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    database = client.db(MONGODB_DB_NAME);
    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();
  //  console.log(result)
    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};
module.exports.aggregate = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.aggregate(query).toArray();
  //  console.log(result)
    return result;
  } catch (error) {
    console.error('🚨 collection.aggregate...', error);
    return null;
  }
};

/**
 * Delete all products
 * @return {Object}
 */
 module.exports.deleteAll = async () => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.deleteMany({});

    return result;
  } catch (error) {
    console.error('🚨 collection.delete...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {

    };
  }
};
/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};
