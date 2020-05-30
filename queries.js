const { calculateEndTime } = require('./utils');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'pi',
    password : 'raspberry',
    database : 'sprinkler',
    port: 5432
  }
});

const daysBoolToInt = (bools) => {
  return bools.reduce((newDays, bool, i) => {
    if (bool) { newDays.push(i)}
    return newDays;
  }, [])
}

const pollSchedules = (day, minute) => {
  try{
    return knex('schedules').whereRaw('days @> ARRAY[?]::integer[]',[day])
    .then(result => result);
  } catch(err) {
    console.log('query error: ', + err);
  }
}

const getSchedules = (request, response) => {
  knex('schedules')
    .then(result => response.status(200).json(result));
}

const getSingleScheduleToRunNow = (id) => {
  return knex('schedules').where({id: id})
    .then(result => {
      let schedule = result[0];
      schedule = updateTimes(schedule);
      return new Promise( (resolve, reject) => resolve(schedule));
    });
}

const updateTimes = (schedule) => {
  let { duration_per_zone, zones, iterations, interval } = schedule;
  let startTime = formatTime(new Date());

  schedule.start_time = startTime;
  schedule.end_time = calculateEndTime(schedule);

  return schedule;
}

const formatTime = (rawDate) => {
  let h = rawDate.getHours();
  let m = rawDate.getMinutes();
  let s = rawDate.getSeconds();
    
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  
  return `${h}:${m}:${s}`;
}

// const putRunSchedule = (request, response, next) => {
//   console.log('middleware: ', request, response);
// }

const createSchedule = (request, response) => {
  let { schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = request.body;
  days = daysBoolToInt(days);

  knex('schedules').insert({schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days}, '*')
    .then(result => {
      response.status(200).json({
        text: 'you have successfully created a Schedule' + result[0].schedule_name,
        schedule: result[0]
      });
    });
}

const putSchedule = (request, response) => {
  let { id, schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = request.body;

  days = daysBoolToInt(days);

  knex('schedules')
    .update({schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days}, '*')
    .where({id: id}) 
    .then(result => {
      response.status(200).json({
        text: 'you have successfully updated schedule' + result[0].schedule_name,
        schedule: result[0]
      });
    });
}

const deleteSchedule = (request, response) => {
  let id = request.body.id;
  console.log('delete: ', id)

  knex('schedules').delete({id: id}, '*')
    .then(result => {
      response.status(200).json({
        text: 'you have successfully deleted schedule ' + result[0].schedule_name,
        schedule: result[0]
      })
    });
}


module.exports = {
  getSchedules,
  getSingleScheduleToRunNow,
  createSchedule,
  putSchedule,
  deleteSchedule,
  pollSchedules
}