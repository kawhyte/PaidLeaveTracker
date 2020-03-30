const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./data-clean/firebase/test.json')
const db = low(adapter)

db.defaults({ bills: []})
  .write();

  //export default db;

  module.exports = db;