const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: 'localhost',
  database: 'sprinkler',
  password: 'password',
  port: 5432,
})

const getWeek = (request, response) => {
  pool.query('SELECT * FROM week', (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  })
}
const getSchedules = (request, response) => {
  pool.query('SELECT * FROM schedules', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const createSchedule = (request, response) => {
  let { schedule_name, start_time, end_time, program, interval, iterations, duration_per_zone, zones } = request.body;


  pool.query(`INSERT INTO schedules (schedule_name, start_time, end_time, program, interval, iterations, duration_per_zone, zones) VALUES ('${schedule_name}','${start_time}', '${end_time}', ${program}, ${interval}, ${iterations}, ${duration_per_zone}, ${zones}) returning *;`,(error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({
      text: 'you have successfully created a Schedule' + results.rows[0].schedule_name,
      schedule: results.rows[0]
    })
  })
}


const deleteProgram = (request, response) => {
  let { program_name } = request.body;

  pool.query(`DELETE FROM programs WHERE programs.program_name = '${program_name}'`
    , (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json('you have successfully deleted program ' + program_name)
  })
}

module.exports = {
  getWeek,
  getSchedules,
  createSchedule,
  deleteProgram
}