const ValveControl = require('./valveControl');

class Program {
  constructor({ duration_per_zone, zones, iterations, interval }) {
    this.iterations = iterations;
    this.interval = interval;
    this.duration_per_zone = duration_per_zone;
    this.zones = zones;
    this.series = null;
    this.running = false;
    this.paused = false;
    this.current_iteration = 1;
    this.killSeries = this.killSeries.bind(this);
    this.loop = this.loop.bind(this);
    this.maybeWait = this.maybeWait.bind(this);
  }

  loop() {
    let index = 0;
    let zones = this.zones;
    let killSeries = this.killSeries;
    let maybeWait = this.maybeWait;
    let paused = this.paused;

    this.series = setInterval(function() {
      if (index != 0) {
        console.log('turn off ', zones[index - 1])
         //ValveControl.zoneOff(zones[index - 1])
      }
      if (index >= zones.length) {
        killSeries();
        maybeWait();
        return;
      }
      console.log('turn on ', zones[index]);
      //ValveControl.zoneOn(zones[index])
      index++;
    }, this.duration_per_zone)
    index++;
  }
  init() {
    this.running = true;
    this.loop();
  }
  killSeries() {
    clearInterval(this.series);
    //ValveControl.allOff();
  }
  pauseProgram() {
    this.paused = true;
  }
  unpauseProgram() {
    this.paused = false;
  }
  stopProgram() {
    this.killSeries();
    //ValveControl.allOff();
    this.running = false;
  }
  maybeWait() {
    if (this.current_iteration < this.iterations){
      this.current_iteration++;
      this.series = setTimeout(() => {
        this.loop()
      },this.interval);
    } else {
      this.running = false;
    }
  }
}

module.exports = {
  Program
}