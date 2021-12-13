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
        const playPromise = snd.play();
        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
        if (playPromise !== undefined) {
            playPromise.then(function () {
                // Automatic playback started!
            }).catch(function (error) {
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
                //console.log(`failed to play note because "${error}"`)
            });
        }
        return true;
    }
    return false;
}