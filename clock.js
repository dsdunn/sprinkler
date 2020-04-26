 const cron = require('node-cron');

const db = require('./queries');
const Program = require('./program');

class Clock {

  constructor() {
    this.current_schedule = null;
    this.today = null,
    this.runProgram = this.runProgram.bind(this);
    this.checkForSchedule = this.checkForSchedule.bind(this);
    this.getDay = this.getDay.bind(this);
    this.everyMinute = null;
    this.everyHour = null;
  }

  init() {
    this.getDay();

    let checkForSchedule = this.checkForSchedule;
    let getDay = this.getDay;

    this.everyMinute = cron.schedule('00 * * * * *', function() {
      checkForSchedule();
    })
    this.everyDay = cron.schedule('* * 00 * * *', function() {
      getDay();
    })
  }

  checkForSchedule() {
    // write query to get schedule starting now (days includes today and start_time minute == now.minute)
    // if schedule -> this.runProgram(schedule);
  }

  getDay() {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let now = new Date();
    
    this.today = days[now.getDay()];
  }

  runProgram(schedule) {
    this.current_schedule = schedule;
    this.program = new Program(schedule)
  }

  stopProgram() {
    this.program.stopProgram()
    // this.program = null;
  }
}

module.exports = {
  Clock
}