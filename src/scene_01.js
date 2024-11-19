import Phaser from 'phaser';

export default class Scene_01 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_01" });
    this.money = null;
    this.coins = 0;
    this.ballLaunched = false;
    this.lives = [];
    this.livesCount = 3;
    this.powerUps = null;
  }

  preload() {
    // Load images and audio assets
    this.load.image("background_01", "assets/background01.png");
    this.load.image("blocks", "assets/bricks.png");
    this.load.atlas("player", "assets/move.png", "assets/move.json");
    this.load.atlas("life", "assets/life.png", "assets/life.json");
    this.load.tilemapTiledJSON("map", "assets/freenoid.json");
    // Load block images
    for (let i = 1; i <= 20; i++) {
      this.load.image(`block${i}`, `assets/${String(i).padStart(2, '0')}-Breakout-Tiles.png`);
    }
    this.load.image("ball", "assets/58-Breakout-Tiles.png");
    this.load.audio('hit', 'assets/hit.mp3');
    this.load.audio('gameplay', 'assets/06.GamePlaySound.mp3');
    this.load.audio('gameClear', 'assets/07.GameClear.mp3');
    this.load.audio('extraLife', 'assets/04.ExtraLife.mp3');
    this.load.audio('gameOver', 'assets/03.GameOver.mp3');
    this.load.audio('loseLife', 'assets/loseLife.wav');
    this.load.atlas("powerup", "assets/powerUps.png", "assets/powerUps.json");
  }

  create() {
    // Reset game state variables
    this.coins = 0;
    this.ballLaunched = false;
    this.livesCount = 3;

    // Set up background and floor
    const map = this.make.tilemap({ key: "map" });
    const skyTile01 = map.addTilesetImage("background01", "background_01");
    const tilesetTile = map.addTilesetImage("bricks", "blocks");
    map.createLayer("background01", skyTile01);
    const floor = map.createLayer("screen", tilesetTile);
    floor.setCollisionByExclusion([-1], true);

    // Create player sprite
    this.player = this.physics.add.sprite(240, 430, "player");
    this.player.setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);
    this.player.body.setImmovable(true);
    this.player.setScale(1 / 5);

    // Player animation
    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNames("player", {
        prefix: "move_",
        start: 1,
        end: 3,
        zeroPad: 2,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.player.anims.play("move", true);

    // Create blocks
    this.createBlocks();

    // Create power-ups group
    this.powerUps = this.physics.add.group();
    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject && this.powerUps.contains(body.gameObject)) {
        body.gameObject.destroy();
      }
    });

    // Create ball
    this.ball = this.physics.add.sprite(this.player.x, this.player.y - 20, "ball");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.ball.setVelocity(0, 0);
    this.ball.setScale(0.15);
    const ballSize = 52;
    this.ball.body.setCircle(ballSize);
    this.ball.body.setOffset(
      (this.ball.width - ballSize) / 4,
      (this.ball.height - ballSize) / 3.8
    );

    // Set up collisions
    this.physics.add.collider(this.player, floor);
    this.physics.add.collider(this.ball, floor);
    this.physics.add.collider(this.ball, this.player, this.handleBallPlayerCollision, null, this);
    this.physics.add.collider(this.ball, this.blocks, this.collect, null, this);
    this.physics.add.collider(this.player, this.powerUps, this.collectPowerUp, null, this);
    this.physics.add.collider(this.powerUps, floor);

    // Set up controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Set up score display
    this.money = this.add.text(40, 13, "Points: " + this.coins, {
      fontFamily: "Quicksand",
      fontSize: "16px",
      color: "#101010",
      fontStyle: "normal",
      strokeThickness: 2,
    });

    // Create lives display
    this.createLives();

    // Add background music with adjusted volume
    if (!this.backgroundMusic || !this.backgroundMusic.isPlaying) {
      this.backgroundMusic = this.sound.add('gameplay', { loop: true, volume: 0.5 });
      this.backgroundMusic.play();
    }

    // Add bottom collider
    this.bottomCollider = this.physics.add.staticImage(240, 480, null).setSize(480, 10);
    this.bottomCollider.visible = false;
    this.physics.add.collider(this.ball, this.bottomCollider, this.hitBottom, null, this);

    // Add initial text
    this.startText = this.add.text(240, 300, 'To start, press SPACE', {
      fontFamily: 'Quicksand',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.startText.visible = false; // Initially hidden
  }

  createBlocks() {
    this.blocks = this.physics.add.staticGroup();
    const blockWidth = 64;
    const blockHeight = 32;
    const startX = 80;
    const startY = 100;
    const endX = 400;
    const rows = 4;
    const padding = 2;
    const cols = Math.floor((endX - startX) / blockWidth);
    const totalBlocks = rows * cols;
    for (let i = 0; i < totalBlocks; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * (blockWidth + padding);
      const y = startY + row * (blockHeight + padding);
      const blockType = Phaser.Math.Between(1, 10) * 2 - 1;
      const block = this.blocks.create(x + blockWidth / 2, y + blockHeight / 2, `block${blockType}`);
      block.setDisplaySize(blockWidth - padding, blockHeight - padding);
      block.body.setSize(blockWidth - padding, blockHeight - padding);
      block.body.setOffset(161, 50);
      if (Phaser.Math.FloatBetween(0, 1) < 0.05) {
        block.setPowerUp = true;
      }
    }
  }

  createLives() {
    this.lives = [];
    for (let i = 0; i < this.livesCount; i++) {
      const life = this.add.sprite(165 + (i * 20), 24, 'life', 'life_02');
      life.setScale(1.5);
      this.lives.unshift(life);
    }
  }

  handleBallPlayerCollision(ball, player) {
    this.sound.play('hit', { volume: 0.3 });
    const diff = ball.x - player.x;
    const maxBounceAngle = Math.PI / 3;
    const bounceAngle = (diff / (player.width / 2)) * maxBounceAngle;
    const speed = 500;
    const velocityX = Math.sin(bounceAngle) * speed;
    const velocityY = -Math.cos(bounceAngle) * speed;
    ball.setVelocity(velocityX, velocityY);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // Show the text if the ball has not been launched
    if (!this.ballLaunched) {
      this.startText.visible = true;
      this.ball.setPosition(this.player.x, this.player.y - 25);
      this.ball.setVelocity(0, 0); // Ensure the ball has no residual velocity
    } else {
      this.startText.visible = false;
    }

    // Only launch the ball if the spacebar is pressed AND the ball has not been launched
    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.ballLaunched) {
      this.ball.setVelocity(0, -400);
      this.ballLaunched = true;
    }
  }

  collect(ball, block) {
    this.coins += 1;
    this.money.setText("Points: " + this.coins);
    this.sound.play('hit', { volume: 0.5 });
    if (block.setPowerUp) {
      const powerUp = this.powerUps.create(block.x, block.y, 'powerup', 'powerUps_01');
      powerUp.setScale(1.5);
      powerUp.setBounce(0.2);
      powerUp.setCollideWorldBounds(true);
      powerUp.setGravityY(300);
    }
    block.destroy();
    if (this.blocks.countActive() === 0) {
      // Stop background music when all blocks are cleared
      if (this.backgroundMusic) {
        this.backgroundMusic.stop();
      }
      this.sound.play('gameClear');
      this.scene.start('Scene_02', {
        coins: this.coins,
        lives: this.livesCount
      });
    }
  }

  collectPowerUp(player, powerUp) {
    if (this.livesCount < 3) {
      this.livesCount++;
      this.sound.play('extraLife');
      // Update lives display
      this.lives[this.livesCount - 1].setTexture('life', 'life_02');
    }
    powerUp.destroy();
  }

  hitBottom(ball, bottom) {
    this.sound.play('loseLife');
    this.livesCount--;
    if (this.livesCount >= 0) {
      this.lives[this.livesCount].setTexture('life', 'life_01');
    }
    if (this.livesCount <= 0) {
      this.backgroundMusic.stop();
      this.sound.play('gameOver');
      this.physics.pause();
      this.ball.setVelocity(0, 0);
      this.player.setVelocity(0, 0);
      this.gameOver = true;
      // Add Game Over text
      this.add.text(240, 200, 'Game Over', {
        fontFamily: 'Quicksand',
        fontSize: '32px',
        color: '#ff0000',
        fontStyle: 'bold',
        strokeThickness: 2,
      }).setOrigin(0.5);
      // Add restart button
      const button = this.add.rectangle(240, 280, 200, 40, 0x00ff00);
      const buttonText = this.add.text(240, 280, 'Return to Main Menu', {
        fontFamily: 'Quicksand',
        fontSize: '16px',
        color: '#000000',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      // Make the button interactive
      button.setInteractive();
      button.on('pointerover', () => {
        button.setFillStyle(0x00dd00);
      });
      button.on('pointerout', () => {
        button.setFillStyle(0x00ff00);
      });
      button.on('pointerdown', () => {
        if (this.backgroundMusic) {
          this.backgroundMusic.stop();
        }
        this.scene.start('Scene_00');
      });
      // Make the text interactive
      buttonText.setInteractive();
      buttonText.on('pointerover', () => {
        button.setFillStyle(0x00dd00);
      });
      buttonText.on('pointerout', () => {
        button.setFillStyle(0x00ff00);
      });
      buttonText.on('pointerdown', () => {
        if (this.backgroundMusic) {
          this.backgroundMusic.stop();
        }
        this.scene.start('Scene_00');
      });
    } else {
      this.resetBall();
    }
  }

  resetBall() {
    // Set ballLaunched to false to require user input
    this.ballLaunched = false;
    // Completely stop the ball
    this.ball.setVelocity(0, 0);
    // Position the ball above the player
    this.ball.setPosition(this.player.x, this.player.y - 20);
    // Ensure physics is active
    if (this.physics.world.isPaused) {
      this.physics.resume();
    }
  }
}
