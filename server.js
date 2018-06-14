var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();


// Socket.io
app.io = require('socket.io')();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var userId = {};

//建立一個監聽是否有使用者連進來的function
var userData = [];  //暫存目前正連線中使用者的name/id對應表

app.io.sockets.on('connection', function (socket) {
  // console.log('有使用者連進來');

  //建立一個監聽“'NewUser'”的function
  socket.on('newUser', function (userName) {
    var player = new Object();
    player.id = userName;
    player.socket = socket.id;
    userData.push(player);
    socket.broadcast.emit('UserType', userName, '加入聊天!');
    socket.broadcast.emit('updateUserList', userData);
    socket.emit('updateUserList', userData);
  });

  //建立一個監聽“'addchat'”的function
  socket.on('addchat', function (data, userName) {
    var isUser = false;
    for (var key in userData) {
      if (userData[key].id == userName) {
        isUser = true;
        break;
      }
    }
    if (isUser == false) {
      var player = new Object();
      player.id = userName;
      player.socket = socket.id;
      userData.push(player);
      socket.broadcast.emit('UserType', userName, '加入聊天!');
      socket.broadcast.emit('updateUserList', userData);
      socket.emit('updateUserList', userData);
    }
    //廣播一個事件名稱為update和data的資料(只會傳給其他使用者)
    socket.broadcast.emit('update', data, userName);
    //讓傳送過來的使用者也能收到
    socket.emit('updateMe', data, userName);
    socket.broadcast.emit('updateUserList', userData);
    socket.emit('updateUserList', userData);
  });

  socket.on('disconnect', function () {
    // console.log(socket.id);
    for (var key in userData) {
      if (userData[key].socket == socket.id) {
        socket.broadcast.emit('UserType', userData[key].id, '離開聊天!');
        userData.splice(key, 1);
        break;
      }
    }

    socket.broadcast.emit('updateUserList', userData);
    socket.emit('updateUserList', userData);
  });

})

module.exports = app;
