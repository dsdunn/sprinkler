const Gpio = require('onoff').Gpio;


class ValveControl {

  constructor() {
    this.currentlyOnZoneNumber: null;
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

  static testZone(zoneNumber) {
    let current = this.currentlyOnZoneNumber;

    if (current) {
      this.zoneOff(current);
    }
    if this.zoneOn(zoneNumber);
  }

  static testAllZones(zone = 1) {
    let current = this.currentlyOnZoneNumber;

    if (current) {
      this.zoneOff(current);
    }
    if (zone < 7) {
      this.zoneOn(zone);
      setTimeOut((that = this) => {
        that.testAllZones(zone + 1)
      }, 2500)
    } else {
      return;
    }
  }

  static zoneOn(zoneNumber) {
    this.zones[zoneNumber - 1].writeSync(0);
    this.currentlyOnZoneNumber = zoneNumber;
  }

  static zoneOff(zoneNumber) {
    this.zones[zoneNumber - 1].writeSync(0);
    this.currentlyOnZoneNumber = null;
  }

  static allZonesOff() {
    this.zones.forEach(zone => {
      zone.writeSync(1);
    })
  }
}

module.exports = {
  ValveControl
}
