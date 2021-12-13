
const img_url = "piano_keys.png";
const img_ratio = 0.6270833333333333;
const img = new Image();
img.src = img_url;
const notes_snds = {
    "A": new Audio("snd/a5.mp3"),
    "B": new Audio("snd/b5.mp3"),
    "C": new Audio("snd/c5.mp3"),
    "D": new Audio("snd/d5.mp3"),
    "E": new Audio("snd/e5.mp3"),
    "F": new Audio("snd/f5.mp3"),
    "G": new Audio("snd/g5.mp3"),
};


let g_canvas_id = null;

function canvas() {
    return document.getElementById(g_canvas_id);
}

function context() {
    return canvas().getContext("2d");
}

function init_piano_canvas(convas_id, width, height_opt=undefined) {
    g_canvas_id = convas_id;
    const c = canvas();
    c.width = width;
    c.height = height_opt === undefined ? c.width * img_ratio : height_opt;
}



function css_get_global_var(key) {
    const styles = getComputedStyle(document.documentElement);
    const out = styles.getPropertyValue(key);
    return out;
}


function shuffleArray(array) {
    for (let i = 0; i < array.length; ++i) {
        let j = Math.floor(Math.random() * array.length);
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}

function play_note(note) {
    const snd = notes_snds[note];
    if (snd) {
        snd.play();
        return true;
    }
    return false;
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