const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const commentsSocketsController = require('./controllers/comments');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/trovekeeperdb', {
    autoIndex: true,
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true,
        methods: 'GET, PUT, PATCH, POST, DELETE',
        allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    },
});
commentsSocketsController(io);

app.use(helmet());
// app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//     cors({
//         origin: '*',
//         credentials: true,
//         methods: 'GET, PUT, PATCH, POST, DELETE',
//         allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//     })
// );

app.use(requestLogger);
app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
