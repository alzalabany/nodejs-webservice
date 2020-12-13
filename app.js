import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, static, urlencoded } from 'express';
import logger from 'morgan';
import { join } from 'path';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const PORT = process.env.PORT || 7001;


var app = express();
var corsOptions = {
  origin: 'http://localhost:' + PORT
};

app.use(cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(static(join(__dirname, 'public')));
export default app;
