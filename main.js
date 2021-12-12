
const img_url = "piano_keys.png";
const img_ratio = 0.6270833333333333;

function canvas() {
    return document.getElementById("my_canvas");
}

function context() {
    return canvas().getContext("2d");
}

function set_canvas_size(width, height_opt) {
    const c = canvas();
    c.width = width;
    c.height = height_opt === undefined ? c.width * img_ratio : height_opt;
}


function css_get_global_var(key) {
    const styles = getComputedStyle(document.documentElement);
    const out = styles.getPropertyValue(key);
    return out;
}

const img = new Image();
img.src = img_url;
const notes = [
    "C", "D", "E", "F", "G", "A", "B",
    "C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb"
];



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
    const ctx = context();
    draw_piano(ctx);
    draw_note(ctx, note);
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
