const socialAuthRoute = require('./socialAuth')

function route(app) {
  app.use('/auth', socialAuthRoute);
}

module.exports = route;