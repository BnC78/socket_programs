const socket = io();

socket.on('message', (msg) => {
    console.log(msg);
});


const canvas = document.querySelector('canvas');
canvas.height = document.body.scrollHeight;
canvas.width = document.body.scrollWidth;
const ctx = canvas.getContext('2d');
const offset = canvas.getBoundingClientRect();
ctx.lineJoin = 'round';
ctx.strokeStyle = 'black';
ctx.lineWidth = 5;

let cursor = {
    x: 0,
    y: 0,
    start: false,
    pushed: false
};

canvas.addEventListener('mousedown', () => {
    cursor.pushed = true;
});

canvas.addEventListener('mouseup', () => {
    cursor.pushed = false;
    cursor.start = false;
});

canvas.addEventListener('mouseleave', () => {
    cursor.pushed = false;
    cursor.start = false;
});

canvas.addEventListener('mousemove', (evt) => {
    if (!cursor.pushed) return;

    if (cursor.start) {
        ctx.beginPath();
        ctx.moveTo(cursor.x - offset.x, cursor.y - offset.y);
        ctx.lineTo(evt.x - offset.x, evt.y - offset.y);
        ctx.closePath();
        ctx.stroke();
        socket.emit('drawing', {
            from: {
                x: cursor.x - offset.x,
                y: cursor.y - offset.y
            }, 
            to: {
                x: evt.x - offset.x,
                y: evt.y - offset.y
            }
        });
        cursor.x = evt.x;
        cursor.y = evt.y;
    } else {
        cursor.x = evt.x;
        cursor.y = evt.y;
        cursor.start = true;
    }
});

socket.on('drawing', (line) => {
    const {from, to} = line;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.closePath();
    ctx.stroke();
})