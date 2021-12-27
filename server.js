const express = require('express');
const { keystone, apps } = require('./index');
const route = require('./routes');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors')

keystone.prepare({
  apps: apps,
  dev: process.env.NODE_ENV !== 'production',
})
  .then(async ({ middlewares }) => {
    await keystone.connect();
    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    }));
    

    route(app);

    app.use(middlewares)
    app.listen(3001);
  });
