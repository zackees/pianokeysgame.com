
function shuffleArray(array) {
    for (let i = 0; i < array.length; ++i) {
        let j = Math.floor(Math.random() * array.length);
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}


function draw_piano(context) {
    const width = context.canvas.clientWidth;
    const height = context.canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
}

function draw_note(context, note_str) {
    function draw_circle(x, y, radius) {
        context.beginPath();
        context.fillStyle = '#ff0000';
        context.strokeStyle = '#ff0000';
        context.lineWidth = 2;
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
    }
    // Coordinates are relative to the png of the piano.
    const data = {
        "C": [0.075, 0.8],
        "D": [0.2175, 0.8],
        "E": [0.36, 0.8],
        "F": [0.5025, 0.8],
        "G": [0.645, 0.8],
        "A": [0.7875, 0.8],
        "B": [0.93, 0.8],
        "C#/Db": [0.145, 0.4],
        "D#/Eb": [0.2875, 0.4],
        "F#/Gb": [0.5725, 0.4],
        "G#/Ab": [0.715, 0.4],
        "A#/Bb": [0.8575, 0.4]
    }
    const [x, y] = data[note_str];
    const radius = 10 / 400;
    draw_circle(
        x * context.canvas.clientWidth,
        y * context.canvas.clientHeight,
        radius * context.canvas.clientWidth);
}