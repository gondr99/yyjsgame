import 'phaser';

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
	this.load.image('ship', 'assets/spaceShips_001.png');
	this.load.image('otherPlayer', 'assets/enemyBlack5.png');
}

function create() { 
	this.socket = io();
	this.socket.on('currentPlayers', (players) => {
		Object.keys(players).forEach( id => {
			if(players[id].playerId === this.socket.id){
				addPlayer(this, players[id]);
			}else {

			}
		})
		
	});
}

function update() { }

//다른 플레이어 추가
function addOtherPlayer(game, playerInfo){
	const otherPlayer = game.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer');
}

//플레이어 추가
function addPlayer(game, playerInfo){
	game.ship = game.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
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