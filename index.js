var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var multer = require('multer');

var pageRoutes = require('./routes/pageRoutes');
var users = require('./routes/users');
var cms = require('./routes/cms');
var secret = require('./keys/secret');

var app = express();

// View engine setup
// this is where you can set up an engine to render jade or ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'res/icon/favicon.ico')));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(session({secret: secret.secretKey, resave: false, saveUninitialized: false}));
// app.use(multer({dest: '../uploads/', rename: function (fieldname, filename) {
//     return filename;
//   },
// }));

app.use('/', pageRoutes);
app.use('/users', users);
app.use('/cms', cms);

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});