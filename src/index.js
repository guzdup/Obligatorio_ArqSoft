

const app = require('./app.js')


const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
});
