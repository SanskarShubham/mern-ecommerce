 
const { MongoClient, ServerApiVersion } = require('mongodb'); 
const password = process.env.MONGO_DB_PASSWORD; // Example password with special characters
const encodedPassword = encodeURIComponent(password); 
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${encodedPassword}@cluster0.hroigvw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);
let _db; 
/**
 * Asynchronously connects to the MongoDB database using the provided URI
 * and calls the callback function once the connection is established.
 *
 * @param {function} cb - Callback function to be called once the connection is established.
 * @throws {Error} If the connection to the database fails.
 */
const mongoClient = async (cb) =>{
    // Connect to the MongoDB database using the provided URI
    const client =  await MongoClient.connect(uri);
    // Get a reference to the database
    _db = client.db();
    // Call the callback function
    cb();
}
const getDB = () => {
    if(_db){
        return _db
    }
    throw 'No database found';
}
module.exports = {mongoClient, getDB};
