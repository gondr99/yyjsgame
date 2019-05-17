import 'phaser';

const Vector2 = Phaser.Math.Vector2;

let config = {
	type: Phaser.AUTO,
	parent: 'gondr-game',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 0 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

function preload() {
	this.load.image('player1', 'assets/player1.png');
	this.load.image('player2', 'assets/player2.png');
}

function create() { 
	this.socket = io();
	//첫 접속후 플레이어 리스트를 받았을 때
	this.otherPlayers = this.physics.add.group(); //피직스 그룹에 다른 플레이어 추가.
	this.socket.on('currentPlayers', (players) => {
		Object.keys(players).forEach( id => {
			if(players[id].playerId === this.socket.id){
				addPlayer(this, players[id]);
			}else {
				addOtherPlayer(this, players[id]);
			}
		});
	});

	//이후 새로운 플레이가 들어올 때
	this.socket.on('newPlayer', (playerInfo)=>{
		addOtherPlayer(this, playerInfo);
	});

	//다른 플레이어가 나갔을 때
	this.socket.on('disconnect', (playerId) => {
		let other = this.otherPlayers.getChildren().find(o => o.playerId === playerId);
		if(other !== undefined){
			other.destroy();
		}
	});

	this.socket.on('playerMoved', (playerInfo)=>{
		console.log(playerInfo);
		let o = this.otherPlayers.getChildren().find(o => {
			console.log(o);
			return o.playerId === playerInfo.playerId;
		});
		if(o !== undefined){
			console.log(playerInfo);
			o.setRotation(playerInfo.rotation);
			o.setPosition(playerInfo.x, playerInfo.y);
		}
	})

	//키입력 핸들링
	this.cursors = this.input.keyboard.createCursorKeys();

}

function update() { 
	if(this.ship){ //소켓 연결되어 할당 받았을 때
		//좌우 회전
		if(this.cursors.left.isDown){
			this.ship.setAngularVelocity(-150);
		}else if(this.cursors.right.isDown){
			this.ship.setAngularVelocity(150);
		}else {
			this.ship.setAngularVelocity(0);
		}
		
		//앞뒤 이동
		if(this.cursors.up.isDown){
			this.physics.velocityFromRotation(this.ship.rotation + Math.PI / 2, 100, this.ship.body.acceleration);
		}else if(this.cursors.down.isDown) {
			console.log(this.ship);
			this.physics.velocityFromRotation(this.ship.rotation + Math.PI * 3 / 2, 100, this.ship.body.acceleration);
		}else {
			this.ship.setAcceleration(0);
		}

		//this.physics.world.wrap(this.ship, 5);

		let x = this.ship.x;
		let y = this.ship.y;
		let r = this.ship.rotation;

		if(this.ship.oldPostion && (x !== this.ship.oldPostion.x || y !== this.ship.oldPostion.y || r !== this.ship.oldPostion.r)){
			this.socket.emit("playerMovement", {x: this.ship.x, y: this.ship.y, r:r});
		}
		this.ship.oldPostion = {
			x:x, y:y, r:r
		}
		
	}
}

//다른 플레이어 추가
function addOtherPlayer(game, playerInfo){
	const otherPlayer = game.physics.add.sprite(playerInfo.x, playerInfo.y, playerInfo.sprite).setDisplaySize(53, 40);
	if(playerInfo.team === 'blue'){
		otherPlayer.setTint(0x0000ff);
	}else {
		otherPlayer.setTint(0xff0000);
	}
	otherPlayer.playerId = playerInfo.playerId;
	game.otherPlayers.add(otherPlayer);
}

//플레이어 추가
function addPlayer(game, playerInfo){
	game.ship = game.physics.add.sprite(playerInfo.x, playerInfo.y, playerInfo.sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
	game.ship.setCollideWorldBounds(true); //월드 경계선을 못벗어 나도록
	//setOrigin은 안해줘도 된다.기본이 0.5 0.5다
	if(playerInfo.team === 'blue') {
		game.ship.setTint(0x0000ff);
	}else {
		game.ship.setTint(0xff0000);
	}

	game.ship.setDrag(100);
	game.ship.setAngularDrag(100);
	game.ship.setMaxVelocity(200);
}


window.addEventListener("load", () => {

	const game = new Phaser.Game(config);
})