import Phaser from "phaser";

export default class FinalStatsScene extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_04" });
    this.stats = null;
  }

  init(data) {
    this.stats = data;
  }

  create() {
    // Background color
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Title
    const titleText = this.add.text(240, 80, "Game Completed!", {
      font: "48px Arial",
      fill: "#ecf0f1",
      fontStyle: "bold"
    });
    titleText.setOrigin(0.5);

    // Final statistics
    const pointsText = this.add.text(240, 160, `Final Score: ${this.stats.coins}`, {
      font: "32px Arial",
      fill: "#ecf0f1"
    });
    pointsText.setOrigin(0.5);

    const livesText = this.add.text(240, 210, `Lives remaining: ${this.stats.lives}`, {
      font: "32px Arial",
      fill: "#ecf0f1"
    });
    livesText.setOrigin(0.5);

    // Main menu button
    const menuButton = this.add.text(240, 300, "Credits", {
      font: "32px Arial",
      fill: "#ffffff",
      backgroundColor: "#3498db",
      padding: { x: 20, y: 10 }
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    // Action on button click
    menuButton.on("pointerdown", () => {
      this.scene.start("Scene_05");
    });
  }
}
