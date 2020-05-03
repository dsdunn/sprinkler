class mockGpio {
  constructor(pinNumber, level) {
    this.pin = pinNumber;
    this.value = 0;
  }

  writeSync(level) {
    this.value = level === "high" ? 0 : 1;
  }
}

module.exports = mockGpio;