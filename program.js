class Program {
  constructor(schedule) {
    this.schedule: schedule,
    this.currentZone: null, 
    this.iteration: 0,
    this.running: false
  }
  runProgram() {

  // while interval < than schedule.interval
    // zones.forEach(turn off previous zone, turn on next zone, set timeout for next switch)

    // program = setTimeout() for interval time

  // exit()
  }

  turnPinOff(pin) {
    // send off to pin
  }
  turnPinOn(pin) {
    // send on to pin
  }

  // killProgram() {
  //   all pins off and reset Program
  // }
}

let program;

const mainLoop = setTimeout(() => {
  // make checks
    // find today's day
    // find now's time to the second
    // SELECT from schedules WHERE start_time === now and days includes today
    // if resulting_schedule 
      // program = new Program(resulting_schedule)
      // program.runProgram();

  // call functions
}, 1000)