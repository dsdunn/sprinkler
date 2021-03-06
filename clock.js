const cron = require('node-cron');

const db = require('./queries');
const { Program } = require('./program');
const Queries = require('./queries');

class Clock {

  constructor(valveControl) {
    this.current_schedule = null;
    this.today = null,
    this.runProgram = this.runProgram.bind(this);
    this.checkForSchedule = this.checkForSchedule.bind(this);
    this.getDay = this.getDay.bind(this);
    this.everyMinute = null;
    this.everyHour = null;
    this.valveControl = valveControl;
    this.resetCurrentSchedule = this.resetCurrentSchedule.bind(this);
    this.getCurrentSchedule = this.getCurrentSchedule.bind(this);
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

  async checkForSchedule() {
    let now = new Date();
    let thisHour = now.getHours();
    thisHour = thisHour < 9 ? '0' + thisHour : thisHour;
    let thisMinute = now.getMinutes();
    thisMinute = thisMinute < 9 ? '0' + thisMinute : thisMinute;
    let nowTime = thisHour + ':' + thisMinute + ':00';

    let todaysSchedules = await Queries.pollSchedules(this.today, nowTime);
    console.log('today, ', this.today);
    console.log('todays, ', todaysSchedules);
    console.log('nowTime: ', nowTime)
    let scheduleNow = todaysSchedules.find(schedule => {
      return schedule.start_time === nowTime || null;
    })

    if (scheduleNow) {
      this.runProgram(scheduleNow);
    } 
  }

  getDay() {
    let now = new Date();
    let daySunStart = now.getDay();
    // our week starts Monday
    this.today = daySunStart === 0 ? 6 : daySunStart - 1;
  }

  getCurrentSchedule() {
    return this.current_schedule;
  }

  runProgram(schedule) {
    if (this.current_schedule) {
      this.stopProgram();
    }
    this.current_schedule = schedule;
    this.program = new Program(schedule, this.valveControl, this.resetCurrentSchedule);
    this.program.init();
  }

  resetCurrentSchedule() {
    this.current_schedule = null;
  }

  stopProgram() {
    this.program && this.program.stopProgram();
    this.valveControl.allZonesOff();
    this.current_schedule = null;
  }
}

module.exports = {
  Clock
}
