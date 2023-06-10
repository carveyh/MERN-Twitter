const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// CORS setup for development environment:
const cors = require('cors');
const { isProduction } = require('./config/keys');

// CSRF Protection
const csurf = require('csurf');

const usersRouter = require('./routes/api/users');
const tweetsRouter = require('./routes/api/tweets');
const csrfRouter = require('./routes/api/csrf');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if(!isProduction){
	app.use(cors());
}

app.use(
	csurf({
		cookie: {
			secure: isProduction,
			sameSite: isProduction && "Lax",
			httpOnly: true
		}
	})
)

// Attach Express routers
app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter);
app.use('/api/csrf', csrfRouter);

module.exports = app;
