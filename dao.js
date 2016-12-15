const MongoClient = require('mongodb').MongoClient;

var db;
var users;

function connect(opts) {
    const url = 'mongodb://' + opts.dbUser + ':' + opts.dbPassword + '@' + opts.dbUrl
    return MongoClient.connect(url)
        .then(_db => {
            db = _db
            users = db.collection("users")
            return db
        });
}

function disconnect(){
    if(db) db.close()
}

function getUser(id) {
    return users.findOne({ id: id })
}

function createUser(user) {
    return users.insert(user)
}

function updateUser(user) {
    return users.update({ id: user.id }, user)
}

function removeUser(id) {
    return users.deleteOne({ id: id })
}

module.exports = {
    connect,
    disconnect,
    getUser,
    createUser,
    updateUser,
    removeUser
};