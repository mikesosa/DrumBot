let genres = [];

var base = {
    kickInputs: document.getElementsByClassName('kick'),
    snareInputs:  document.getElementsByClassName('snare'),
    rinInputs:  document.getElementsByClassName('rin'),
    hihatInputs:  document.getElementsByClassName('hihat'),
    kickSound: new Tone.Player("./sound/kicks/kick.wav").toMaster(),
    snareSound: new Tone.Player("./sound/snares/snare.wav").toMaster(),
    rinSound: new Tone.Player("./sound/rins/rin.wav").toMaster(),
    hihatSound: new Tone.Player("./sound/hihats/hihat.wav").toMaster(),
    index: 0,
    oldStep: 0,
    kickSteps: [],
    hihatSteps: [],
    snareSteps: [],
    rinSteps: []
}

var controller = {
    init: () => {
        view.init();
    },
    sequencer: () => {
        Tone.Transport.scheduleRepeat(controller.repeat, '10n');
    },
    repeat: () => {
        let step = base.index % 16;
        view.unpaintOld();
        // console.log(`step:${step}`);
        // console.log(`olsStep: ${base.oldStep}`);

        if (base.kickInputs[step].classList.contains('pressed')) {
            base.kickSound.start();
        }
        if (base.snareInputs[step].classList.contains('pressed')) {
            base.snareSound.start();
        }
        if (base.rinInputs[step].classList.contains('pressed')) {
            base.rinSound.start();
        }
        if (base.hihatInputs[step].classList.contains('pressed')) {
            base.hihatSound.start();
        }

        base.oldStep = step;
        view.paintCurrent(step);
        base.index++;
    },
    toggleStep: (element) => {
        element.classList.toggle('pressed');
    },
    stop: () => {
        Tone.Transport.stop();
        // Tone.Transport.clear();
        console.log("stopped");
        base.index = 0;
    },
    reset: () => {
        Tone.Transport.stop();
        base.index = 0;
        document.querySelectorAll('.step').forEach(item => {
            item.classList.remove('pressed');
            item.classList.remove('running');
        });
        document.getElementById('genreButton').innerHTML = "Genre";
        base.kickSteps = [];
        base.hihatSteps = [];
        base.snareSteps = [];
        base.rinStep = [];
    },
    fetchGenres: () => {
        const api_url = 'https://api.noopschallenge.com/drumbot/patterns';
        async function getISS() {
            const response = await fetch(api_url);
            const data = await response.json();
            for (var i = 0 ; i <= data.length - 1; i++) {
                genres.push(data[i].name);
            };
            view.displayGenres();
        }
        getISS();
    },
    setGenre: (item) => {
        var value = item.innerHTML;
        const api_url = `https://api.noopschallenge.com/drumbot/patterns/${value}`;

        // Cleaning the steps or each track
        controller.reset();
        document.getElementById('genreButton').innerHTML = value;


        async function getISS() {
            const response = await fetch(api_url);
            const data = await response.json();

            if (data.tracks.length > 0) {
                for (var i = 0 ; i <= 15; i++) {
                    base.hihatSteps.push(data.tracks[0].steps[i]);
                };
            }
            if (data.tracks.length > 1) {
                for (var i = 0 ; i <= 15; i++) {
                    base.rinSteps.push(data.tracks[1].steps[i]);
                };
            }
            if (data.tracks.length > 2) {
                for (var i = 0 ; i <= 15; i++) {
                    base.snareSteps.push(data.tracks[2].steps[i]);
                };
            }
            if (data.tracks.length > 3) {
                for (var i = 0 ; i <= 15; i++) {
                    base.kickSteps.push(data.tracks[3].steps[i]);
                };
            }
            view.paintGender();
        }
        getISS();
    },

}

var view = {
    init: () => {
        controller.fetchGenres();
        // The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.
        document.getElementById("audioButton").onclick = function() {
            if (Tone.context.state !== 'running') {
                Tone.context.resume();
                controller.sequencer();
            }
        }
        document.getElementById("startButton").onclick =  function() {
            mouse_IsDown = true;
            // If firefox, it's trigered too.
            console.log("starteds");
            controller.sequencer();
            Tone.Transport.start();
        };
        // Event listernes for all the .step
        document.querySelectorAll('.step').forEach(item => {
          item.addEventListener('click', event => {
              controller.toggleStep(item);
          })
        });
		document.getElementById('stopButton').onclick = function() {
            controller.stop();
        };
        document.getElementById('resetButton').onclick = function() {
            controller.reset();
        };

    },
    paintCurrent: (step) => {
        base.kickInputs[step].classList.add('running');
        base.snareInputs[step].classList.add('running');
        base.rinInputs[step].classList.add('running');
        base.hihatInputs[step].classList.add('running');
    },
    unpaintOld: () => {
        base.kickInputs[base.oldStep].classList.remove('running');
        base.snareInputs[base.oldStep].classList.remove('running');
        base.rinInputs[base.oldStep].classList.remove('running');
        base.hihatInputs[base.oldStep].classList.remove('running');
    },
    displayGenres: () => {
        var parent = document.getElementById("genreList");
        for (var i = 0; i < genres.length; i++) {
            var button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.setAttribute('class', 'dropdown-item genre');
            button.innerHTML = genres[i];
            parent.appendChild(button);
        }
        // Event listernes for all the .genre
        document.querySelectorAll('.genre').forEach(item => {
          item.addEventListener('click', event => {
              controller.setGenre(item);
          })
        })
    },
    paintGender: () => {
        base.index = 0;
        document.querySelectorAll('.step').forEach(item => {
            item.classList.remove('pressed');
            item.classList.remove('running');
        });
        //Paiting steps for each track
        for (var i = 0; i < base.kickInputs.length; i++) {
            if (base.kickSteps[i] === 1) {
                base.kickInputs[i].classList.add('pressed');
            }
        }
        for (var i = 0; i < base.snareInputs.length; i++) {
            if (base.snareSteps[i] === 1) {
                base.snareInputs[i].classList.add('pressed');
            }
        }
        for (var i = 0; i < base.rinInputs.length; i++) {
            if (base.rinSteps[i] === 1) {
                base.rinInputs[i].classList.add('pressed');
            }
        }
        for (var i = 0; i < base.hihatInputs.length; i++) {
            if (base.hihatSteps[i] === 1) {
                base.hihatInputs[i].classList.add('pressed');
            }
        }
    }
}

controller.init();
$('#alertModal').modal('show');
