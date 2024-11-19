export default class Scene_00 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_00" });
    this.menuMusic = null;
  }

  preload() {
    // Load the map JSON file
    this.load.tilemapTiledJSON('menuMap', 'assets/freenoid.json');

    // Load the tileset images
    this.load.image('background04', 'assets/background04.png');
    this.load.image('logo', 'assets/logo.png');

    // Load the audio files
    this.load.audio('menuMusic', 'assets/01.GameStart.mp3');
    this.load.audio('startGame', 'assets/02.RoundStart.mp3');
  }

  create() {
    // Create the map
    const map = this.make.tilemap({ key: 'menuMap' });

    // Add the tilesets to the map
    const backgroundTileset = map.addTilesetImage('background04', 'background04');
    const logoTileset = map.addTilesetImage('logo', 'logo');

    // Add the layers to the map
    const menuBG = map.createLayer('MenuBG', backgroundTileset, 0, 0);
    const menuTitle = map.createLayer('MenuTitle', logoTileset, 0, 0);

    // Start the menu music
    this.menuMusic = this.sound.add('menuMusic', { loop: true });
    this.menuMusic.play();

    // Start button
    const startButton = this.add.text(240, 250, "Start!", {
      font: "32px Arial",
      fill: "#ffffff",
      backgroundColor: "#4CAF50",
      padding: { x: 40, y: 10 }
    });
    startButton.setOrigin(0.5); // Text origin on center
    startButton.setInteractive({ useHandCursor: true }); // Make the text interactive

    // Action on button click
    startButton.on("pointerdown", () => {
      if (this.menuMusic) {
        this.menuMusic.stop();
      }
      this.sound.play('startGame');
      this.scene.start("Scene_01");
    });
  }
}
