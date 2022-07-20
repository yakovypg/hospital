const http = require('http');
const express = require('express');

const setupMiddlewares = require('./middlewares');

const { PORT } = require('./config');
const { mainRouter, apiRouter } = require('./routers');

const app = express();

setupMiddlewares(app);

app.use('/api', apiRouter);
app.use('/', mainRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
