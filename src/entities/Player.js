import Phaser from 'phaser';
import { PLAYER_SPEED, SHIP_WIDTH, SHIP_HEIGHT } from '../constants';
import { mapBounds } from '../assets/mapBounds';

const isWithinBounds = (x, y) => {
    return !mapBounds[y] ? true : !mapBounds[y].includes(x);
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        this.scene.add.existing(this);
        // this.scene.physics.add.existing(this);
        // this.setCollideWorldBounds(true);
        this.x = x;
        this.y = y;
        this.movedLastFrame = false;
        this.isMoving = false;
        // this.setBounce(0.2);
        // this.setGravityY(300);
        // this.setDragX(1000);
        // this.setMaxVelocity(200, 400);
        // this.scale = 0.4;
        this.displayHeight = 50;
        this.displayWidth = 37;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
        });
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 24,
            repeat: -1,
        });
        //     this.anims.create({
        //         key: 'left',
        //         frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        //         frameRate: 10,
        //         repeat: -1,
        //     });
        //     this.anims.create({
        //         key: 'turn',
        //         frames: [ { key: 'player', frame: 4 } ],
        //         frameRate: 20,
        //     });
        //     this.anims.create({
        //         key: 'right',
        //         frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        //         frameRate: 10,
        //         repeat: -1,
        //     });
    }
    update() {
        let moved = false;
        const absPlayerX = this.x + SHIP_WIDTH / 2;
        const absPlayerY = this.y + SHIP_HEIGHT / 2 + 20;
        if (
            (this.cursors.left.isDown || this.keys.a.isDown) &&
            isWithinBounds(absPlayerX - PLAYER_SPEED, absPlayerY)
        ) {
            this.x -= PLAYER_SPEED;
            // this.setVelocityX(-PLAYER_SPEED);
            this.flipX = true;
            moved = true;
        } else if (
            (this.cursors.right.isDown || this.keys.d.isDown) &&
            isWithinBounds(absPlayerX + PLAYER_SPEED, absPlayerY)
        ) {
            this.x += PLAYER_SPEED;
            // this.setVelocityX(PLAYER_SPEED);
            this.flipX = false;
            moved = true;
        }

        if (
            (this.cursors.up.isDown || this.keys.w.isDown) &&
            isWithinBounds(absPlayerX, absPlayerY - PLAYER_SPEED)
        ) {
            this.y -= PLAYER_SPEED;
            moved = true;
            // this.setVelocityY(-PLAYER_SPEED);
        } else if (
            (this.cursors.down.isDown || this.keys.s.isDown) &&
                isWithinBounds(absPlayerX, absPlayerY + PLAYER_SPEED)
        ) {
            this.y += PLAYER_SPEED;
            moved = true;
            // this.setVelocityY(PLAYER_SPEED);
        }
        if (
            this.cursors.left.isDown ||
            this.keys.a.isDown ||
            this.cursors.right.isDown ||
            this.keys.d.isDown ||
            this.cursors.up.isDown ||
            this.keys.w.isDown ||
            this.cursors.down.isDown ||
            this.keys.s.isDown
        ) {
            this.anims.play('running', true);
        } else {
            this.anims.stop();
        }
        return moved;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
