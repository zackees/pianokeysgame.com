const img_url = "piano_keys.png";
const img_ratio = 0.6270833333333333;
const canvas = document.getElementById("my_canvas");
const context = canvas.getContext("2d");
context.globalCompositeOperation = "source-over";
canvas.height = canvas.width * img_ratio;
const img = new Image();
img.src = img_url;
const notes = [
    "C", "D", "E", "F", "G", "A", "B",
    "C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb"
];
function shuffleArray(array) {
    for (let i = 0; i < array.length; ++i) {
        let j = Math.floor(Math.random() * array.length);
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}

// Wow, black keys are hard so just slice them out (for now).
let note_order = shuffleArray(notes.slice(0, 7));
let note_working_set = {}
function has_more_notes() {
    return Object.keys(note_working_set).length < 4 && note_order.length > 0;
}
while (has_more_notes()) {
    note_working_set[note_order.pop()] = 0;
}
const right_answer = document.getElementById("right_answer");
function random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function draw_piano(context) {
    const width = context.canvas.clientWidth;
    const height = context.canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
}

function draw_note(context, note_str) {
    right_answer.innerText = "";
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
function reveal_answer() {
    const num_wrong = -(note_working_set[curr_random_note] - 1);
    right_answer.innerText = `Wrong, it was "${curr_random_note}", which needs ${num_wrong} right answers before it's finished.`;
}
let curr_random_note = null;
function random_next() {
    //const i = random_int(0, notes.length);
    const note_working_set_array = Object.keys(note_working_set);
    if (note_working_set_array.length == 0) {
        return false;  // No more items.
    }
    let note = null;
    while (true) {
        const i = random_int(0, note_working_set_array.length);
        note = note_working_set_array[i];
        if (note_working_set_array.length == 1 || note != curr_random_note) {
            break;
        }
    }
    curr_random_note = note;
    draw_piano(context);
    draw_note(context, note);
    return true;  // More in the set.
}

function submit(value) {
    if (value != curr_random_note) {
        // Two, because the next answer will be right.
        note_working_set[curr_random_note] -= 2;
        document.getElementById("correct").innerText = "";
        reveal_answer();
    } else {
        note_working_set[curr_random_note] += 1;

        if (note_working_set[curr_random_note] > 0) {
            delete note_working_set[curr_random_note];
            if (has_more_notes()) {
                note_working_set[note_order.pop()] = 0;
            }
            document.getElementById("correct").innerText = `"${value}" is correct!`;
        } else {
            const num_left = note_working_set[curr_random_note]
            document.getElementById("correct").innerText = `"${value}" is correct! There are ${-num_left + 1} more until "${value}" is finished.`;
        }
        if (!random_next()) {
            alert("Finished.");
            window.location.reload();
        };
    }
}

// Init.
window.onload = random_next;
notes.forEach((note) => {
    const el = document.getElementById(note);
    el.onclick = () => {
        submit(note);
    }
});

// Keyboard access to keys.
document.onkeydown = (evt) => {
    const key = evt.key.toUpperCase();
    const found_key = document.getElementById(key);
    if (found_key) {
        found_key.click();
    }
};
