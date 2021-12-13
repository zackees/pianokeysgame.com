const __notes_snds = {
    "A": new Audio("snd/a5.mp3"),
    "B": new Audio("snd/b5.mp3"),
    "C": new Audio("snd/c5.mp3"),
    "D": new Audio("snd/d5.mp3"),
    "E": new Audio("snd/e5.mp3"),
    "F": new Audio("snd/f5.mp3"),
    "G": new Audio("snd/g5.mp3"),
};

function play_note(note) {
    const snd = __notes_snds[note];
    if (snd) {
        snd.play();
        return true;
    }
    return false;
}