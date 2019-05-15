const express = require('express');
const http = require('http');
const path = require('path');

let app = express();

const port = 9000; //웹서버 포트
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

//라우터 파일
const router = require('./modules/router');
app.use(router);

let server = http.createServer(app);
server.listen(port, function(){
    console.log(`Express App ${port}에서 실행합니다.`)
});