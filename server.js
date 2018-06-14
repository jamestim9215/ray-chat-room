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
var angelData = {
  "小天使": [
    "嗨!有人呼叫我嗎? 你可以下達指令 ex:'小天使 抽卡'or'小天使 講笑話'",
    "嗨!有人想我嗎?可是我不想你歐!!",
    "其實我跟惡魔是好朋友!",
    "Hi!你好!!"
  ],
  "小天使 抽卡": [
    "整天只會想抽卡，你還會幹嘛?",
    "霹靂卡霹靂拉拉....卡片不見了",
    "看你可憐送你一張圖啦!<br><img src='http://lorempixel.com/400/200/cats' class='rounded' width='250'>",
    "看你可憐送你一張圖啦!<br><img src='http://lorempixel.com/400/200/cats' class='rounded' width='250'>",
    "看你可憐送你一張圖啦!<br><img src='http://lorempixel.com/400/200/cats' class='rounded' width='250'>",
    "看你可憐送你一張圖啦!<br><img src='http://lorempixel.com/400/200/cats' class='rounded' width='250'>",
    "看你可憐送你一張圖啦!<br><img src='http://lorempixel.com/400/200/cats' class='rounded' width='250'>"
  ],
  "小天使 講笑話": [
    '不要啦!我講的笑話不好笑',
    '好吧!你堅持的話!<br>有一天，小美走在路上，遇到一隻烏龜，小美很驚慌地說:"你是要劫財還是劫色阿!"，結果你知道烏龜說什麼嗎? "傑泥傑泥"'
  ],
  "小天使 天氣": [
    '你當我氣象局?',
    '天氣的基本釋義:在較短時間內特定地區的大氣狀況、氣象情況<br>詳細釋義:古人指輕清之氣。 《逸周書·時訓》：“小雪之日，虹藏不見。又五日，天氣上騰，地氣下降。” 泛指空氣。 太平天囯 洪仁玕 《自傳》：“鼻之呼吸，刻不能不與天氣相通。” 天命，氣數。 唐 許敬宗 《尉遲恭碑》：“ 劉武周 不稽天氣，寔暗人謀。” 氣候。 三國 魏 曹丕 《燕歌行》：“秋風蕭瑟天氣涼，草木搖落露為霜。” 宋 張先 《八寶裝》詞：“正不寒不暖，和風細雨，困人天氣。” 清 程趾祥 《此中人語·河中井》：“時天氣炎熱，游泳於河，竟失足墮下。” 丁玲 《阿毛姑娘》：“不怕天氣已很冷，沿路上還是有不少燒香的客。” 時候。指某一時刻。 《水滸傳》第八回：“兩個公人帶了 林沖 出店，卻是五更天氣。”《兒女英雄傳》第五回：“莫如趁天氣還早，躲了他。” 魏巍 《在風雪里》三：“吃過飯，天氣已經不早了。” 指一段時間。 明 馮夢龍 《掛枝兒·醉歸》：“俏冤家夜深歸，喫得爛醉……枉了奴對孤燈守了三更多天氣。” 康濯 《徐水平原的白天黑夜》：“他并不是黨員，快到六十歲，結婚才不過十年天氣。”'
  ]
};



var angelDo = function (data) {
  var mes = "";
  var len = angelData[data].length;
  var id = Math.floor((Math.random() * len));
  if(len != 0){
    mes = angelData[data][id];
  }else{
    
  }
  
  return mes;
}

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

    for (var key in angelData) {
      if (key == data) {
        socket.broadcast.emit('angel', angelDo(key));
        socket.emit('angel', angelDo(key));

        break;
      }
    }

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
