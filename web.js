#!/usr/bin/env node

'use strict';

var express = require('express'),
    app     = require('./app'),
    session = require('./session');


/*
 * /!\ Important /!\
 *
 * Pensez a gerer le endpoint : GET /favicon.ico avant vos session !
 * Certains navigateurs effectuent cette requete spontaneement
 * sans forcement passer les cookies du domaine (si ils n'ont pas
 * encore ete cree)
 * Cela vous evitera de voir votre base de donnee gonfler sans explication
 */
app.use(express.favicon()); // http://www.senchalabs.org/connect/favicon.html

/*
 * Necessaire pour lire et ecrire les cookies de session
 */
app.use(express.cookieParser());

app.use(session); // ./session.js

app.use(express.logger());
app.use(app.router);

app.get('/', function(req, res) {
  if (req.session.i) {
    ++req.session.i;
  } else {
    req.session.i = 1;
  }
  res.end(req.session.i.toString());
});

var port = process.env.PORT || 5000;
console.log('listening on port ' + port);
app.listen(port);
