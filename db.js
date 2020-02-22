const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./public/db.json')
const db = low(adapter)

db.defaults({ bills: [], count: 0 })
  .write();

  //export default db;

  module.exports = db;