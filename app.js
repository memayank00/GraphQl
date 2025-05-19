const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/restRoutes');
const graphqlMiddleware = require('./routes/graphqlRoutes');
require('./db'); // Initialize MongoDB connection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Node.js Express API with REST and GraphQL!</h1>');
});

app.use('/api', apiRoutes);
app.use('/graphql', graphqlMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
