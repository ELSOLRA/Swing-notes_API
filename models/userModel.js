const Datastore = require('nedb-promise');

const usersDb = new Datastore({ filename: 'users.db', autoload: true });

module.exports = usersDb;