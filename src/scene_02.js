import Phaser from "phaser";

export default class StatsScene extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_02" });
    this.stats = null;
  }

  init(data) {
    this.stats = data;
  }

  preload() {
    this.load.audio('roundStart', 'assets/02.RoundStart.mp3');
  }

  create() {
    // Background color
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Title
    const titleText = this.add.text(240, 80, "Level 1 Completed", {
      font: "48px Arial",
      fill: "#ecf0f1",
      fontStyle: "bold"
    });
    titleText.setOrigin(0.5);

    // Statistics
    const pointsText = this.add.text(240, 160, `Points: ${this.stats.coins}`, {
      font: "32px Arial",
      fill: "#ecf0f1"
    });
    pointsText.setOrigin(0.5);

    const livesText = this.add.text(240, 210, `Lives remaining: ${this.stats.lives}`, {
      font: "32px Arial",
      fill: "#ecf0f1"
    });
    livesText.setOrigin(0.5);

    // Continue button
    const continueButton = this.add.text(240, 300, "Continue", {
      font: "32px Arial",
      fill: "#ffffff",
      backgroundColor: "#27ae60",
      padding: { x: 20, y: 10 }
    });
    continueButton.setOrigin(0.5);
    continueButton.setInteractive({ useHandCursor: true });

    // Action on button click
    continueButton.on("pointerdown", () => {
      this.sound.play('roundStart');
      this.scene.start("Scene_03", {
        coins: this.stats.coins,
        lives: this.stats.lives
      });
    });
  }
}
