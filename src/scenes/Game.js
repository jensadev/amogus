import Phaser from 'phaser';
import playerSprite from '../assets/player.png';
import shipImg from '../assets/ship.png';
import Player from '../entities/Player';
import { io } from 'socket.io-client';

import {
    getQueryParameter,
    getRandomString,
    updateQueryParameter,
} from '../utils';

// import tiledMap from '../assets/map.json';

// https://www.youtube.com/watch?v=lbbPP9Wqy50

import {
    PLAYER_SPRITE_HEIGHT,
    PLAYER_SPRITE_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from '../constants';

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');

        this.player = null;
        this.other = null;
        this.others = [];

        this.socket;

        this.room = getQueryParameter('room') || getRandomString(8);
        window.history.replaceState(
            {},
            document.title,
            updateQueryParameter('room', this.room)
        );
    }

    preload() {
        this.load.image('ship', shipImg);
        // this.load.image('player', playerImg);

        // this.load.tilemapTiledJSON('map', tiledMap);

        this.load.spritesheet('player', playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });

        this.socket = io(`http://localhost:3000?room=${this.room}`);
    }

    create() {
        const ship = this.add.image(0, 0, 'ship');

        this.player = new Player(
            this,
            PLAYER_START_X,
            PLAYER_START_Y,
            'player'
        );

        this.socket.on('move', (x, y) => {
            if (this.other) {
                if (this.other.x > x) {
                    this.other.flipX = true;
                } else if (this.other.x < x) {
                    this.other.flipX = false;
                }
                this.other.setPosition(x, y);
                this.other.isMoving = true;
            }
        });
        this.socket.on('moveEnd', () => {
            console.log('moveEnd');
            if (this.other) {
                this.other.isMoving = false;
            }
        });
        this.socket.on('playerJoined', () => {
            console.log('player joined');
            this.other = new Player(
                this,
                PLAYER_START_X,
                PLAYER_START_Y,
                'player'
            );
            this.other.tint = Math.random() * 0xffffff;
            // let other = new Player(this, PLAYER_START_X, PLAYER_START_Y, 'player');
            // this.others.push(other);
        });
    }

    update() {
        this.scene.scene.cameras.main.centerOn(this.player.x, this.player.y);
        const playerMoved = this.player.update();

        if (playerMoved) {
            this.socket.emit('move', { x: this.player.x, y: this.player.y });
            this.player.movedLastFrame = true;
        } else {
            if (this.player.movedLastFrame) {
                this.socket.emit('moveEnd');
            }
            this.player.movedLastFrame = false;
        }

        if (this.other) {
            if (this.other.isMoving && !this.other.anims.isPlaying) {
                this.other.anims.play('running', true);
            } else if (!this.other.isMoving && this.other.anims.isPlaying) {
                this.other.anims.stop();
            }
        }
    }
}
