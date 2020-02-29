var Scene = require("./lib/scene.js");
var Beet = require("beet.js");
var context = require("./lib/context.js");
var gain = context.createGain();
gain.gain.value = 0.4;
gain.connect(context.destination);

var beet = new Beet({
  context: context
});

document.getElementById("add").onclick = function(e) {
  var sequence = document.querySelector("#sequence").value;
  var tempo = document.querySelector("#tempo").value;
  var scene = new Scene(`New Scene`, {
    element: document.getElementById("1"),
    pattern: beet.pattern(sequence),
    layers: [
      {
        pulses: sequence,
        slots: sequence.length,
        tempo: tempo,
        cb: function(time, step) {
          var osc = context.createOscillator();
          var gain = context.createGain();
          osc.connect(gain);
          gain.connect(context.destination);
          osc.frequency.value = 277;
          beet.utils.envelope(gain.gain, time, {
            start: 0,
            peake: 0.5,
            attack: 0.02,
            decay: 0.1,
            sustain: 0.1,
            release: 0.2
          });
          osc.start(time);
          osc.stop(time + 0.5);
        }
      }
    ]
  });

  function animate() {
    requestAnimationFrame(animate);
    scene.render();
  }

  animate();
};

// var sequence = document.querySelector("#sequence").value;
// var tempo = document.querySelector("#tempo").value;
// var scene1 = new Scene("Euclidean 5/9", {
//   element: document.getElementById("1"),
//   pattern: beet.pattern(sequence),
//   layers: [
//     {
//       pulses: sequence,
//       slots: sequence.length,
//       tempo: tempo,
//       cb: function(time, step) {
//         var osc = context.createOscillator();
//         var gain = context.createGain();
//         osc.connect(gain);
//         gain.connect(context.destination);
//         osc.frequency.value = 277;
//         beet.utils.envelope(gain.gain, time, {
//           start: 0,
//           peake: 0.5,
//           attack: 0.02,
//           decay: 0.1,
//           sustain: 0.1,
//           release: 0.2
//         });
//         osc.start(time);
//         osc.stop(time + 0.5);
//       }
//     }
//   ]
// });
