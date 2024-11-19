import Phaser from 'phaser';
import Scene_00 from './Scene_00';
import Scene_01 from './Scene_01';
import Scene_02 from './Scene_02';
import Scene_03 from './Scene_03';
import Scene_04 from './Scene_04';
import Scene_05 from './Scene_05';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 480,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'app'
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Scene_00, Scene_01, Scene_02, Scene_03, Scene_04, Scene_05],
  audio: {
    disableWebAudio: false
  }
};

export default new Phaser.Game(config);
