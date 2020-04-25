class mockGpio {
  constructor(pinNumber, level) {
    this.pin = pinNumber;
    this.value = 1;
  }

  writeSync(num) {
    this.value = num;
  }
}

module.exports = mockGpio;