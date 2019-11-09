const Gpio = require('onoff').Gpio;


class ValveControl {

  constructor() {
    this.zones = [];
  }

  static init() {
    console.log('init')
    this.mapPins();
  }

  static mapPins() {
    let zone1 = new Gpio(4, 'out');
    let zone2 = new Gpio(17, 'out');
    let zone3 = new Gpio(5, 'out');
    let zone4 = new Gpio(6, 'out');
    let zone5 = new Gpio(13, 'out');
    let zone6 = new Gpio(19, 'out');

    this.zones = [zone1, zone2, zone3, zone4, zone5, zone6];
    console.log('pins mapped')
  }

  static testZone(i) {
    console.log(this.zones);
    this.zones[i - 1].write(1)
    setTimeout(() => {
      this.zones[i - 1].write(0);
    }, 2000)
  }

  static testAllZones() {
    this.zones.forEach(zone => {
      zone.write(1);
      setTimeout(() => {
        zone.write(0);
      }, 1500)
    })
  }
}

module.exports = {
  ValveControl
}