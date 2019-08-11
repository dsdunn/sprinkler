const Pool = require('pg').Pool
const pool = new Pool({
  user: 'sprinkler',
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
  let { schedule_name, start_time, end_time, program, interval, iterations } = request.body;


  pool.query(`INSERT INTO schedules (schedule_name, start_time, end_time, program, interval, iterations) VALUES ('${schedule_name}','${start_time}', '${end_time}', ${program}, ${interval}, ${iterations}) returning *;`,(error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json({
      text: 'you have successfully created a Schedule' + results.rows[0].schedule_name,
      schedule: results.rows[0]
    })
  })
}

const getPrograms = (request, response) => {
  pool.query('SELECT * FROM programs', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const createProgram = (request, response) => {
  let { program_name, zones, duration_per_zone } = request.body;

  pool.query(
    `INSERT INTO programs (program_name, duration_per_zone, zones) VALUES ('${program_name}', ${duration_per_zone}, ARRAY[${zones}]) returning *;`


    , (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json({
      text: 'you have successfully added program ' + program_name,
      id: results.rows[0].id
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
  getPrograms,
  createProgram,
  deleteProgram
}