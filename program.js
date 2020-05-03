const ValveControl = require('./valveControl');

class Program {
  constructor({ duration_per_zone, zones, iterations, interval }, valveControl) {
    this.valveControl= valveControl;
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
    let valveControl = this.valveControl;

    const zoneControl = () => {
      if (index != 0) {
        console.log('turn off ', zones[index - 1])
         valveControl.zoneOff(zones[index - 1])
      }
      if (index >= zones.length) {
        killSeries();
        maybeWait();
        return;
      }
      console.log('turn on ', zones[index]);
      valveControl.zoneOn(zones[index])
      index++;
    }

    zoneControl();

    this.series = setInterval(zoneControl, this.duration_per_zone * 1000 * 60)
  }

  init() {
    this.running = true;
    this.loop();
  }
  killSeries() {
    clearInterval(this.series);
    this.valveControl.allZonesOff();
  }
  pauseProgram() {
    this.paused = true;
  }
  unpauseProgram() {
    this.paused = false;
  }
  stopProgram() {
    this.killSeries();
    this.valveControl.allOff();
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