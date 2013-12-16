var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var dburl = 'mongodb://127.0.0.1/webOS';

global.db = mongoose.connect(dburl);


var app = express();

app.configure(function ()
{
    app.set('port', process.env.PORT || 4000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon()); 
    app.use(express.logger('dev'));

    app.engine('html', require('ejs').renderFile);
    app.use(express.bodyParser({
        uploadDir: __dirname + '/uploads'
    }));

    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: "webOS"
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

if( 'development' == app.get('env') ){
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/movieHtml', routes.movieHtml);
app.get('/search', routes.search);
app.get('/getHtml', routes.getHtml);
app.get('/render', routes.render);
app.get('/index', routes.index);
app.get('/register', routes.register);
app.get('/login', routes.login);
app.post('/register', user.register);
app.post('/login', user.login);
app.post('/mount', user.mount);
app.post('/upload', user.upload);
app.post('/createFile', user.createFile);
app.post('/getFilesByPath', user.getFilesByPath);
app.post('/updateFileName', user.updateFileName);
app.post('/deleteFile', user.deleteFile);
app.post('/changeFilePath', user.changeFilePath);

http.createServer(app).listen(app.get('port'), function (){
    console.log('Express server listening on port ' + app.get('port'));
});
