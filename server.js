
'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
var mongoose = require('mongoose');

let bookApi = require('./routes/books');
let userApi = require('./routes/users');

let facebook = require('./routes/auth/facebook');
let twitter = require('./routes/auth/twitter');
let linkedin = require('./routes/auth/linkedin');

let index = require('./routes/index');
let partials = require('./routes/partials');
let checkout = require('./routes/checkout');

let auth = require('./config/auth');

let DATABASE = process.env.MONGOLAB_URI || 'mongodb://localhost/bookstore';
console.log('Connecting to mongodb: ', DATABASE);
mongoose.connect(DATABASE);

let app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(auth.auth);

app.use('/api/books', bookApi);
app.use('/api/users', userApi);
app.use('/api/checkout', auth.isAuth, checkout);

app.use('/auth/facebook', facebook);
app.use('/auth/twitter', twitter);
app.use('/auth/linkedin', linkedin);

app.use('/', index);
app.use('/partials', partials);

let PORT = process.env.PORT || 3000;
let server = require('http').createServer(app);
let io = require('socket.io')(server);

server.listen(PORT, () => {
  console.log('Server listening at port %d', PORT);
});

process.on('exit', (code) => {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});

io.on('connection', function (socket) {

  socket.on('join book', function (book) {
    socket.join(book);
    socket.book = book;
  });

  socket.on('leave book', function (book) {
    socket.leave(book);
    delete socket.book;
  });

  socket.on('book over', function (data) {
    socket.to(socket.book).emit('book over', data);
  });

  socket.on('new move', function (data) {
    socket.to(socket.book).emit('new move', data);
  });
});
