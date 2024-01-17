const app = require('./app.js')
const connectDBsql = require('../regulatory_Unit/database/sql.js')

connectDBsql();

const port = 3003 || 3000;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
});