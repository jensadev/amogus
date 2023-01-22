import Phaser from 'phaser';

import Game from './scenes/Game';

const config = {
    type: Phaser.AUTO,
    parent: 'app',
    width: 800,
    height: 450,
    scene: [Game],
};

export default new Phaser.Game(config);
