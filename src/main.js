import Phaser from 'phaser';
import { io } from 'socket.io-client';
import { getQueryParameter, getRandomString } from './utils';
import Game from './scenes/Game';

const config = {
    type: Phaser.AUTO,
    parent: 'app',
    width: 800,
    height: 450,
    scene: [Game],
};

let room = getQueryParameter('room') || getRandomString(8);
let socket = io(`http://localhost:3000?room=${room}`);

const chatBox = document.getElementById('chat-messages');
socket.on('chatMsg', (msg) => {
    const p = document.createElement('p');
    p.innerText = msg;
    chatBox.prepend(p);
});

const input = document.getElementById('chat-input');
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        socket.emit('chatMsg', input.value);
        input.value = '';
    }
});

export default new Phaser.Game(config);
