const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: 'localhost',
  database: 'sprinkler',
  password: 'password',
  port: 5432,
})

const getSchedules = (request, response) => {
  pool.query('SELECT * FROM schedules', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const createSchedule = (request, response) => {
  let { schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = request.body;

  pool.query(`INSERT INTO schedules (schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days) VALUES ('${schedule_name}','${start_time}', '${end_time}', '${interval}', '${iterations}', '${duration_per_zone}', ARRAY [${zones.join(',')}]::integer[], ARRAY [${days.join(',')}]::integer[]) returning *;`,(error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({
      text: 'you have successfully created a Schedule' + results.rows[0].schedule_name,
      schedule: results.rows[0]
    })
  })
}

const putSchedule = (request, response) => {
  let { id, schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = request.body;

  pool.query(`UPDATE schedules SET schedule_name = '${schedule_name}', start_time = '${start_time}', end_time = '${end_time}', interval = '${interval}', iterations = '${iterations}', duration_per_zone = '${duration_per_zone}', zones = ARRAY [${zones}]::integer[], days = ARRAY[${days}]::integer[] WHERE ID = ${id} returning *;`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({
      text: 'you have successfully updated schedule' + results.rows[0].schedule_name,
      schedule: results.rows[0]
    })
  })
}

const deleteSchedule = (request, response) => {
  let id = request.body.id;

  pool.query(`DELETE FROM schedules WHERE id = ${id} returning *;`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({
      text: 'you have successfully deleted schedule ' + results.rows[0].schedule_name,
      schedule: results.rows[0]
    })
  })
}


module.exports = {
  getSchedules,
  createSchedule,
  putSchedule,
  deleteSchedule
}