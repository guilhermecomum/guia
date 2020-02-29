var THREE = require("three");
var Layer = require("./layer");
var context = require("./context");
var bowser = require("bowser");
var audioInitiated = false;
var Beet = require("beet.js");

function Scene(name, options) {
  var self = this;
  this.beet = new Beet({
    context: context
  });
  this.name = name;
  this.r = window.innerWidth / 12;
  this.w = window.innerWidth / 4;
  this.h = window.innerWidth / 4;
  this.layers = [];
  this.element = options.element;

  this.playButton = self.element.children[0];
  this.slots = [];
  this.started = false;

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(
    self.w / -2,
    self.w / 2,
    self.h / 2,
    self.h / -2,
    1,
    1000
  );
  this.camera.position.z = 500;

  options.layers.forEach(function(layer, index) {
    var l = new Layer(
      self.beet,
      layer.tempo,
      index,
      layer.pulses,
      layer.slots,
      self.r,
      layer.cb,
      layer.offCb || function() {},
      options.layers.length
    );
    self.scene.add(l.circle);
    l.points.forEach(function(point) {
      self.scene.add(point);
    });
    self.scene.add(l.currentCircle);
    self.beet.add(l.audioLayer);
    self.layers.push(l);
  });

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  this.renderer.setSize(self.w, self.h);
  this.element.insertBefore(self.renderer.domElement, self.element.children[0]);
  this.element;
  this._addEventListeners();
}

Scene.prototype.render = function() {
  var self = this;
  this.renderer.render(self.scene, self.camera);
};

Scene.prototype.remove = function() {
  var self = this;
  self.renderer.dispose();
};

Scene.prototype.change = function(options) {};

Scene.prototype.start = function() {
  var self = this;
  self.playButton.className = "fa fa-stop icon";
  this.beet.start();
  self.started = true;
};

Scene.prototype.stop = function() {
  var self = this;
  self.playButton.className = "fa fa-play icon";
  this.beet.stop();
  self.started = false;
};

Scene.prototype._addEventListeners = function() {
  var self = this;
  var eventType = bowser.ios ? "mousedown" : "click";

  self.playButton.addEventListener(eventType, function() {
    if (self.started) {
      self.stop();
    } else {
      if (!audioInitiated) {
        var osc = context.createOscillator();
        osc.start(0);
        osc.stop(0);
        audioInitiated = true;
      }
      self.start();
    }
  });
};

module.exports = Scene;
