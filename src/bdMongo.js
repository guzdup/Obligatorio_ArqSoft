const mongoose = require('mongoose');

const usersDbConnection = mongoose.createConnection('mongodb://localhost:27017/usersdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const plataformDbConnection = mongoose.createConnection('mongodb://localhost:27017/Plataformdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    usersDbConnection,
    plataformDbConnection
};