var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'Hack and Slash', { preload: preload, create: create, update: update, render: render });
var player;

function preload()
{
	game.load.image('background','assets/spr_ground.png');
	game.load.image('player','assets/spr_player.png');
	game.load.image('health_bar','assets/ui/health_bar.png');

	game.load.tilemap('MainWorld_json_file', 'assets/maps/data/MainWorld.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('MainWorld_tiles_file', 'assets/maps/tiles/Outside_A2.png');
}

function create()
{
	game.world.setBounds(0, 0, 1920, 1080);
	game.physics.startSystem(Phaser.Physics.P2JS);

	map = game.add.tilemap('MainWorld_json_file');
	map.addTilesetImage('Outside_A2', 'MainWorld_tiles_file');
	layer = map.createLayer('MainWorld_layer01');
	layer.resizeWorld();

	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	game.physics.p2.enable(player);
	player.body.fixedRotation = true;

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

	// DEBUG ONLY
	healthUp = game.input.keyboard.addKey(Phaser.Keyboard.U);
	healthDown = game.input.keyboard.addKey(Phaser.Keyboard.J);

	menuLabel = game.add.text(0, 0, 'MENU', { font: '18px Arial', fill: '#FFFFFF' });
	menuLabel.inputEnabled = true;
	menuLabel.events.onInputUp.add(ToggleMenu, self);

	healthBar = game.add.image(0, 0, "health_bar");
	healthBar.height = 16;
	healthBar.width = 300;
	healthBar.initialWidth = 300;

	debugLabel = game.add.text(0, 0, 'DEBUG', { font: '14px Arial', fill: 'red' });

	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function update()
{
	HandleInput();

	debugLabel.text =   
		"Screen Size: [w: " + window.innerWidth + ", h: " + window.innerHeight + "]\n" +
		"Player Location: [x: " + parseInt(player.x, 10) + ", y: " + parseInt(player.y, 10) + "]\n" + 
		"Player Health: [c: " + parseInt(player.health) + ", m: " + parseInt(player.maxHealth, 10) + "]\n\n" + 

		"Move: [W, A, S, D]\n" + 
		"Health: [U, J] [Increment, Decrement]"
}

function render()
{
	menuLabel.x = game.camera.x + 10;
	menuLabel.y = game.camera.y + 28;

	healthBar.x = game.camera.x + 10;
	healthBar.y = game.camera.y + 10;

	debugLabel.x = game.camera.x + 10;
	debugLabel.y = game.camera.y + 90;

	healthBar.width = player.health / player.maxHealth * healthBar.initialWidth;
}

function HandleInput()
{
	player.body.setZeroVelocity();

	if (upKey.isDown)
	{
		player.body.moveUp(300)
	}
	else if (downKey.isDown)
	{
		player.body.moveDown(300);
	}

	if (leftKey.isDown)
	{
		player.body.moveLeft(300);
	}
	else if (rightKey.isDown)
	{
		player.body.moveRight(300);
	}

	if(healthUp.isDown)
	{
		if(player.health < 100)
		{
			player.health++;
		}
	}
	if(healthDown.isDown)
	{
		if(player.health > 0)
		{
			player.health--;
		}
	}
}