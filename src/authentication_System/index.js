const app = require('./app.js')
const {usersDbConnection } = require('../bdMongo');

const connectDBsql = require('../regulatory_Unit/database/sql.js')

connectDBsql();


const port = 3002 || 3000;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
});