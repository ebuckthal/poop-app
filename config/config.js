
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://localhost/poop-app-dev',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'POOP-APP dev'
    }
  },
  test: {
    db: 'mongodb://localhost/poop-app-test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'POOP-APP test'
    }
  },
  production: {
    db: 'mongodb://localhost/poop-app',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'POOP-APP production'
    }
  }
}
