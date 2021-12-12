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

const notes_snds = {
    "A": new Audio("snd/a5.mp3"),
    "B": new Audio("snd/b5.mp3"),
    "C": new Audio("snd/c5.mp3"),
    "D": new Audio("snd/d5.mp3"),
    "E": new Audio("snd/e5.mp3"),
    "F": new Audio("snd/f5.mp3"),
    "G": new Audio("snd/g5.mp3"),
};

function play_note(note) {
    const snd = notes_snds[note];
    if (snd) {
        snd.play();
        return true;
    }
    return false;
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
    right_answer.innerText = "";
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
        play_note(value);
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
