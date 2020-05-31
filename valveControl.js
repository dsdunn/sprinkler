let Gpio = require('onoff').Gpio;
const mockGpio = require('./mockGpio');

if (!Gpio.accessible) {
  Gpio = mockGpio;
}
class ValveControl {

  constructor() {
    this.currentlyOnZoneNumber= null;
    this.zones = [];
  }

  init() {
    this.mapPins();
  }

  mapPins() {
    let zone1 = new Gpio(4, 'high');
    let zone2 = new Gpio(17, 'high');
    let zone3 = new Gpio(5, 'high');
    let zone4 = new Gpio(6, 'high');
    let zone5 = new Gpio(13, 'high');
    let zone6 = new Gpio(19, 'high');

    this.zones = [zone1, zone2, zone3, zone4, zone5, zone6];
  }

  testAllZones(zone = 1) {
    let current = this.currentlyOnZoneNumber;

    if (current) {
      this.zoneOff(current);
    }
    if (zone < 7) {
      this.zoneOn(zone);
      setTimeout((that = this) => {
        that.testAllZones(zone + 1)
      }, 1500)
    } else {
      return;
    }
  }

  zoneOn(zoneNumber) {
    if (!this.zones[zoneNumber]) { return };

    this.zones[zoneNumber].writeSync(0);
    this.currentlyOnZoneNumber = zoneNumber;
  }

  zoneOff(zoneNumber) {
    this.zones[zoneNumber].writeSync(1);
    this.currentlyOnZoneNumber = null;
  }

  allZonesOff() {
    this.zones.forEach(zone => {
      zone.writeSync(1);
    })
    this.currentlyOnZoneNumber = null;
  }

  getCurrentlyOnZone() {
    return this.currentlyOnZoneNumber;
  }
}

module.exports = {
  ValveControl
}
