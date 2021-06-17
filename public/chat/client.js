const socket = io();

socket.on('message', (msg) => {
    console.log(msg);
});

const msgbox = document.querySelector('#sent-messages');

function connection(user, connect) {
    let message = `<p><b>${user}</b> ` + (connect ? '' : 'dis') + `connected.</p><br/>`;
    msgbox.innerHTML += message;
}

let user = '';
socket.on('user-new', (num) => {
    if (user === '') {
        user = `User ${num}`;
    }
    socket.emit('username', user);
});

socket.on('user-connect', (user) => {
    connection(user, true);
});

socket.on('user-disconnect', (user) => {
    connection(user, false);
});

const message = document.querySelector('#message');
const send = document.querySelector('#send');

function createMessage(user, msg) {
    let message = `<p><b>${user}:</b> ${msg}</p><br/>`;
    msgbox.innerHTML += message;
}

send.addEventListener('click', () => {
    if (message.value.trim() != '') {
        socket.emit('chat', {user: user, msg: message.value});
        message.value = '';
    }
});

socket.on('chat', ({user, msg}) => {
    createMessage(user, msg);
});