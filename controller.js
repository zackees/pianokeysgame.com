class Controller {
    static shuffle_array(array) {
        let out = array.slice(0, array.length); // copy.
        for (let i = 0; i < out.length; ++i) {
            let j = Math.floor(Math.random() * out.length);
            let tmp = out[i];
            out[i] = out[j];
            out[j] = tmp;
        }
        return out;
    }

    static random_int(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    constructor(notes,
                max_active_test_sets,
                on_new_gamestate,
                on_success_cb,
                on_miss_cb,
                on_game_complete) {
        this.original_notes = notes.slice(0, notes.length);
        this.max_active_test_sets = max_active_test_sets;
        this.notes = null;
        this.note_order = null;
        this.note_working_set = null;        
        this.curr_random_note = null;
        this.on_new_gamestate = on_new_gamestate;
        this.on_success_cb = on_success_cb;
        this.on_miss_cb = on_miss_cb;
        this.on_game_complete = on_game_complete;
        this.init();
    }

    init() {
        this.notes = this.original_notes.slice(0, this.original_notes.length);
        this.note_order = Controller.shuffle_array(this.notes);
        this.note_working_set = {}
        this.curr_random_note = null;
        while (this.has_more_notes()) {
            this.note_working_set[this.note_order.pop()] = 0;
        }
        this.random_next();
    }

    reset() { this.init(); }

    play_current_note() {
        play_note(this.curr_random_note);
    }

    has_more_notes() {
        const n = Object.keys(this.note_working_set).length;
        return n < this.max_active_test_sets && this.note_order.length > 0;
    }


    reveal_answer() {
        const num_wrong = -(this.note_working_set[this.curr_random_note] - 1);
        const msg = `Wrong, it was "${this.curr_random_note}", which needs ${num_wrong} right answers before it's finished.`;
        this.on_miss_cb(msg);
    }

    random_next() {
        const i = Controller.random_int(0, this.notes.length);
        const note_working_set_array = Object.keys(this.note_working_set);
        if (note_working_set_array.length == 0) {
            return false;  // No more items.
        }
        let note = null;
        while (true) {
            const i = Controller.random_int(0, note_working_set_array.length);
            note = note_working_set_array[i];
            if (note_working_set_array.length == 1 || note != this.curr_random_note) {
                break;
            }
        }
        this.curr_random_note = note;
        console.log("curr_random_note", this.curr_random_note);
        if (this.on_new_gamestate) {
            this.on_new_gamestate(this.curr_random_note);
        }
        //right_answer.innerText = "";
        //const ctx = context();
        return true;  // More in the set.
    }

    submit(value) {
        if (value != this.curr_random_note) {
            console.log(`${value} != ${this.curr_random_note}`);
            // Two, because the next answer will be right.
            this.note_working_set[this.curr_random_note] -= 2;
            //document.getElementById("correct").innerText = "";
            this.reveal_answer();
        } else {
            this.note_working_set[this.curr_random_note] += 1;
            if (this.note_working_set[this.curr_random_note] > 0) {
                delete this.note_working_set[this.curr_random_note];
                if (this.has_more_notes()) {
                    this.note_working_set[this.note_order.pop()] = 0;
                }
                const msg = `"${value}" is correct!`;
                this.on_success_cb(value, msg);
            } else {
                const num_left = this.note_working_set[this.curr_random_note]
                const msg = `"${value}" is correct! There are ${-num_left + 1} more until "${value}" is finished.`;
                this.on_success_cb(value, msg);
            }
            if (!this.random_next()) {
                this.on_game_complete(this);
            };
        }
    }
};