const root = document.documentElement;

const fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector('.accidental-selector');
const numberOfFretsSelector = document.querySelector('#number-of-frets');
const showAllNotesSelector = document.querySelector('#show-all-notes');
const showMultipleNotesSelector = document.querySelector('#show-multiple-notes');
const noteNameSection = document.querySelector('.note-name-section');

const singleFretMarkPosition = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPosition = [12, 24];

const notesFlat = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const notesSharp = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

let accidentals = 'flats';
let allNotes;
let showMultipleNotes = false;

const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 string)': [7, 2, 9, 4]
}; 

let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
let numberOfFrets = 20;

const app = {
    init() {
        this.setupFretboard();
        this.setupSelectInstrumentSelector();
        this.setupEventListeners();
        this.setupNoteNameSection();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numberOfStrings)
        // add strings to fretboard
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);
            // add fret to string
            for (let j = 0; j <= numberOfFrets; j++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);

                let noteName = this.generateNoteNames((j + instrumentTuningPresets[selectedInstrument][i]));
                noteFret.setAttribute('data-note', noteName);

                // Add single fretmark
                if (i === 0 && singleFretMarkPosition.indexOf(j) != -1) {
                    noteFret.classList.add('single-fretmark');
                }

                if (i === 0 && doubleFretMarkPosition.indexOf(j) != -1) {
                    let doubleFretMark = tools.createElement('div');
                    doubleFretMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretMark);
                }
            }
        }
        allNotes = document.querySelectorAll('.note-fret');
    },
    generateNoteNames(noteIndex) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats') {
            noteName = notesFlat[noteIndex];
        } else if (accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    setupSelectInstrumentSelector() {
        for (instrument in instrumentTuningPresets) {
            let instrumentOption = tools.createElement('option', instrument);
            selectedInstrumentSelector.appendChild(instrumentOption);
        }
    },
    setupNoteNameSection() {
        noteNameSection.innerHTML = '';
        let noteNames;
        if (accidentals === 'flats') {
            noteNames = notesFlat;
        } else {
            noteNames = notesSharp;
        }
        noteNames.forEach((noteName) => {
            let noteNameElement = tools.createElement('span', noteName);
            noteNameSection.appendChild(noteNameElement);
        });
    },
    showNoteDot(event) {
        if (event.target.classList.contains('note-fret')) {
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 1);
            } else {
                event.target.style.setProperty('--note-dot-opacity', 1);
            }
        };
    },
    hideNoteDot(event) {
        if (event.target.classList.contains('note-fret')) {
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 0);
            } else {
                event.target.style.setProperty('--note-dot-opacity', 0);
            }
        };
    },
    toggleMultipleNotes(noteName, opacity) {
        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].dataset.note == noteName) {
                allNotes[i].style.setProperty('--note-dot-opacity', opacity);
            }
        }
    },
    setupEventListeners() {
        fretboard.addEventListener('mouseover', this.showNoteDot);
        fretboard.addEventListener('mouseout', this.hideNoteDot);
        selectedInstrumentSelector.addEventListener('change', (event) => {
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            this.setupFretboard();
        });
        accidentalSelector.addEventListener('click', (event) => {
            if (event.target.classList.contains('acc-select')) {
                accidentals = event.target.value;
                this.setupFretboard();
                this.setupNoteNameSection();
            } else {
                return;
            }
        });
        numberOfFretsSelector.addEventListener('change', () => {
            numberOfFrets = numberOfFretsSelector.value;
            this.setupFretboard();
        });
        showAllNotesSelector.addEventListener('change', (event) => {
            if (showAllNotesSelector.checked) {
                root.style.setProperty('--note-dot-opacity', 1);
                fretboard.removeEventListener('mouseover', this.showNoteDot);
                fretboard.removeEventListener('mouseout', this.hideNoteDot);
                this.setupFretboard();
            } else {
                root.style.setProperty('--note-dot-opacity', 0);
                fretboard.addEventListener('mouseover', this.showNoteDot);
                fretboard.addEventListener('mouseout', this.hideNoteDot);
                this.setupFretboard();
            }
        });
        showMultipleNotesSelector.addEventListener('change', (event) => {
            showMultipleNotes = !showMultipleNotes;
        });
        noteNameSection.addEventListener('mouseover', (event) => {
            let noteToShow = event.target.innerText;
            app.toggleMultipleNotes(noteToShow, 1);
        });
        noteNameSection.addEventListener('mouseout', (event) => {
            if (showAllNotesSelector.checked) {
                return;
            }
            let noteToShow = event.target.innerText;
            app.toggleMultipleNotes(noteToShow, 0);
        })
    }
}

const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}

app.init();