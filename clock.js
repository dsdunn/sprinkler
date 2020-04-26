 const cron = require('node-cron');

const db = require('./queries');
const Program = require('./program');
const Queries = require('./queries');

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

  async checkForSchedule() {
    let now = new Date();
    let thisHour = now.getHours();
    let thisMinute = now.getMinutes();
    let nowTime = thisHour + ':' + thisMinute + ':00';

    let result = await Queries.internalGetThisMinuteSchedule(this.today, nowTime);
    let todaysSchedules = result.rows;
    console.log('todays: ', todaysSchedules);
    let scheduleNow = todaysSchedules.find(schedule => {
      return schedule.start_time === nowTime;
    })
    if (scheduleNow) {
      console.log('scheduleNow: ', scheduleNow);
      // this.runProgram(schedule);
    } 
  }

  getDay() {
    // let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let now = new Date();
    
    this.today = now.getDay();
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