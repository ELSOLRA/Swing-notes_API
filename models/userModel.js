const Datastore = require('nedb-promise');

const usersDb = new Datastore({ filename: 'database/users.db', autoload: true });

module.exports = usersDb;