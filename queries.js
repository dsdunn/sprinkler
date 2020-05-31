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

const createSchedule = (request, response) => {
  let { schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = request.body;

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
  createSchedule,
  putSchedule,
  deleteSchedule,
  pollSchedules
}