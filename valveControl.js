const Gpio = require('onoff').Gpio;


class ValveControl {

  constructor() {
    this.zones = [];
  }

  static init() {
    console.log('init')
    this.mapPins();
    this.testAllZones();
  }

  static mapPins() {
    let zone1 = new Gpio(4, 'high');
    let zone2 = new Gpio(17, 'high');
    let zone3 = new Gpio(5, 'high');
    let zone4 = new Gpio(6, 'high');
    let zone5 = new Gpio(13, 'high');
    let zone6 = new Gpio(19, 'high');

    this.zones = [zone1, zone2, zone3, zone4, zone5, zone6];
  }

  static testZone(i) {
    console.log(this.zones);
    this.zones[i - 1].writeSync(1)
    setTimeout(() => {
      this.zones[i - 1].writeSync(0);
    }, 2000)
  }

  static testAllZones() {
    let on = false;

    this.zones.forEach(zone => {
     // zone.writeSync(0);
      console.log('off', zone.readSync());
      setTimeout(() => {
     // zone.writeSync(1);
       // console.log('on', zone.readSync());
      }, 1500)
    })
  }
}

module.exports = {
  ValveControl
}
