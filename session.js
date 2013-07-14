
'use strict';

var app = require('./app'),
    express = require('express');

if ('production' === app.get('env')) {

  /*
   * Si vous utilisez Redis Cloud sur Heroku, les indentifiants
   * de connexion se trouvent dans l'environement (process.env.REDISCLOUD_URL)
   * sous cette forme: redis://rediscloud:************@pub-redis-15630.eu-west-1-1.1.ec2.garantiadata.com:15630
   */
  app.set('redisDbUri', process.env.REDISCLOUD_URL);

  /*
   * En production, on utilise le serveur Redis.
   */
  var RedisStore = require('connect-redis')(express),
      redis      = require('redis'),
      urlParser  = require('url').parse,  // pour parser les identifiants
      redisClient;

  /*
   * Connexion au serveur redis
   */
  var url = urlParser(app.get('redisDbUri'));
  redisClient = redis.createClient(url.port, url.hostname);
  redisClient.auth(
    url.auth.substr(url.auth.indexOf(':') + 1), // on recupere le mot de passe
    function(err) {
      if (err) {
        // impossible de se connecter au serveur Redis
        throw err;
      }
    });


  // http://www.senchalabs.org/connect/session.html
  module.exports = express.session({
    secret : 'abcdef',
    store  : new RedisStore({
      client: redisClient   // on remplace le data store par defaut par notre client Redis
    })
  });

} else {

  /*
   * Si nous ne sommes pas en production
   * on garde le data store par defaut
   * (celui qui stocke les variables de session dans la RAM)
   */
  module.exports = express.session({ secret: 'abcdef' });
}
