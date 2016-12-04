var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'Hack and Slash', { preload: preload, create: create, update: update, render: render });
var player;

var vkUpIsDown, vkDownIsDown, vkLeftIsDown, vkRightIsDown = false;

function preload()
{
	game.load.image('background','assets/spr_ground.png');
	game.load.image('player','assets/spr_player.png');

	game.load.image('health_bar','assets/ui/health_bar.png');

	game.load.image('gamepad_back','assets/ui/controller/gamepad_back.png');
	game.load.image('gamepad_up','assets/ui/controller/gamepad_up.png');
	game.load.image('gamepad_down','assets/ui/controller/gamepad_down.png');
	game.load.image('gamepad_left','assets/ui/controller/gamepad_left.png');
	game.load.image('gamepad_right','assets/ui/controller/gamepad_right.png');

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

	healthBar = game.add.image(10, 10, "health_bar");
	healthBar.height = 16;
	healthBar.width = 300;
	healthBar.initialWidth = 300;

	debugLabel = game.add.text(0, 0, 'DEBUG', { font: '14px Arial', fill: 'red' });

	gamepadBack = game.add.image(16, window.innerHeight-144, "gamepad_back");
	gamepadBack.fixedToCamera = true;

	gamepadUp = game.add.button(80, window.innerHeight-112, "gamepad_up", null, this, 0, 1, 0, 1);
    gamepadUp.events.onInputOver.add(function(){vkUpIsDown = true;});
    gamepadUp.events.onInputOut.add(function(){vkUpIsDown = false;});
    gamepadUp.events.onInputDown.add(function(){vkUpIsDown = true;});
    gamepadUp.events.onInputUp.add(function(){vkUpIsDown = false;});
	gamepadUp.fixedToCamera = true;
    gamepadUp.anchor.setTo(0.5, 0.5);

	gamepadDown = game.add.button(80, window.innerHeight-48, "gamepad_down", null, this, 0, 1, 0, 1);
    gamepadDown.events.onInputOver.add(function(){vkDownIsDown = true;});
    gamepadDown.events.onInputOut.add(function(){vkDownIsDown = false;});
    gamepadDown.events.onInputDown.add(function(){vkDownIsDown = true;});
    gamepadDown.events.onInputUp.add(function(){vkDownIsDown = false;});
	gamepadDown.fixedToCamera = true;
    gamepadDown.anchor.setTo(0.5, 0.5);

	gamepadLeft = game.add.button(48, window.innerHeight-80, "gamepad_left", null, this, 0, 1, 0, 1);
    gamepadLeft.events.onInputOver.add(function(){vkLeftIsDown = true;});
    gamepadLeft.events.onInputOut.add(function(){vkLeftIsDown = false;});
    gamepadLeft.events.onInputDown.add(function(){vkLeftIsDown = true;});
    gamepadLeft.events.onInputUp.add(function(){vkLeftIsDown = false;});
	gamepadLeft.fixedToCamera = true;
    gamepadLeft.anchor.setTo(0.5, 0.5);

	gamepadRight = game.add.button(112, window.innerHeight-80, "gamepad_right", null, this, 0, 1, 0, 1);
    gamepadRight.events.onInputOver.add(function(){vkRightIsDown = true;});
    gamepadRight.events.onInputOut.add(function(){vkRightIsDown = false;});
    gamepadRight.events.onInputDown.add(function(){vkRightIsDown = true;});
    gamepadRight.events.onInputUp.add(function(){vkRightIsDown = false;});
	gamepadRight.fixedToCamera = true;
    gamepadRight.anchor.setTo(0.5, 0.5);

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
	// I can use .fixedToCamera, but the lerp give it a nice moving effect.
	// If combined with camera shake, it should look amazing.
	menuLabel.x = game.camera.x + 10;
	menuLabel.y = game.camera.y + 28;

	healthBar.x = game.camera.x + 10;
	healthBar.y = game.camera.y + 10;
	healthBar.width = player.health / player.maxHealth * healthBar.initialWidth;

	// Debug
	debugLabel.x = game.camera.x + 10;
	debugLabel.y = game.camera.y + 90;
}

function HandleInput()
{
	player.body.setZeroVelocity();

	if (upKey.isDown | vkUpIsDown)
	{
		player.body.moveUp(300);
	}
	else if (downKey.isDown | vkDownIsDown)
	{
		player.body.moveDown(300);
	}

	if (leftKey.isDown | vkLeftIsDown)
	{
		player.body.moveLeft(300);
	}
	else if (rightKey.isDown | vkRightIsDown)
	{
		player.body.moveRight(300);
	}

	// DEBUG
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