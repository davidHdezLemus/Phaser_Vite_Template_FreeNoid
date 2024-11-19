import Phaser from "phaser";

export default class Scene_05 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_05" });
  }

  preload() {
    this.load.audio('ending', 'assets/05.Ending.mp3');
  }

  create() {
    // Play ending sound at the start of the credits
    this.sound.play('ending');

    // Dark and elegant background
    this.cameras.main.setBackgroundColor('#2c3e50');

    // Game Over title without entry animation
    const gameOverText = this.add.text(240, 80, "Game Over!", {
      font: "48px Arial",
      fill: "#ecf0f1",
      fontStyle: "bold"
    });
    gameOverText.setOrigin(0.5);

    // Developer credit
    const devText = this.add.text(240, 140, "Developer: David Hdez Lemus", {
      font: "24px Arial",
      fill: "#ecf0f1"
    });
    devText.setOrigin(0.5);

    // Additional information
    const infoText = this.add.text(240, 180, "Discover more at itch.io!", {
      font: "24px Arial",
      fill: "#ecf0f1",
      fontStyle: "italic"
    });
    infoText.setOrigin(0.5);

    // Acknowledgment
    const gptText = this.add.text(240, 220, "Special thanks to Bing Copilot for the help", {
      font: "24px Arial",
      fill: "#ecf0f1"
    });
    gptText.setOrigin(0.5);

    // Thanks to professor
    const profText = this.add.text(240, 260, "Thanks to my professor EliasMarNev", {
      font: "24px Arial",
      fill: "#ecf0f1"
    });
    profText.setOrigin(0.5);

    // Final message
    const finalMessage = this.add.text(240, 320, "Thank you for playing!", {
      font: "32px Arial",
      fill: "#ecf0f1",
      fontStyle: "italic"
    });
    finalMessage.setOrigin(0.5);

    // Button to return to the menu with an attractive visual style
    const restartButton = this.add.text(240, 380, "Return to Menu", {
      font: "32px Arial",
      fill: "#ffffff",
      backgroundColor: "#3498db",
      padding: { x: 20, y: 10 }
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });

    // Action on button click
    restartButton.on("pointerdown", () => {
      this.sound.stopAll();
      this.scene.start("Scene_00");  // Return to the main menu
    });
  }
}
