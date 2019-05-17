const express = require('express');
const http = require('http');
const path = require('path');
const { PI, floor, ceil, random } = Math;

let app = express();
const server = http.createServer(app);

const io = require('socket.io').listen(server);


const port = 9000; //웹서버 포트
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

//라우터 파일
const router = require('./modules/router');
app.use(router);

//게임서버 관련 변수들
const players = {};

//소켓IO 프로토콜
io.on('connection', (soc) => {
    console.log('user connected : ' + soc.id);

    //플레이어 접속시 처리 작업
    players[soc.id] = {
        rotation: 0, 
        x: floor(random() * 700) + 50,
        y: floor(random() * 500) + 50,
        playerId: soc.id,
        team: floor(random() * 2 ) == 0 ? 'red' : 'blue'
    }
    //해당 플레이어에게 모든 플레이어 리스트 보내주기
    soc.emit('currentPlayers', players);

    //자신을 제외한 모든 플레이어게 브로드캐스트로 전송
    soc.broadcast.emit('newPlayer', players[soc.id]); 

    soc.on('disconnect', () => {
        console.log('user disconnected : ' + soc.id);
        //해당 유저의 로그아웃을 알림.
        delete players[soc.id];
        io.emit('disconnect', soc.id);
    })
});


server.listen(port, function () {
    console.log(`Express App ${port}에서 실행합니다.`)
});