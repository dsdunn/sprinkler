const Pool = require('pg').Pool
const pool = new Pool({
  user: 'sprinkler',
  host: 'localhost',
  database: 'sprinkler',
  password: 'password',
  port: 5432,
})

const getDays = (request, response) => {
  pool.query('SELECT * FROM week', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}

const getPrograms = (request, response) => {
  pool.query('SELECT * FROM programs', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows)
  })
}

const createProgram = (request, response) => {
  console.log(request.body);
  let {program_name, start_time, end_time, duration_per_zone, zones } = request.body;

  pool.query(
    `INSERT INTO programs (program_name, start_time, end_time, duration_per_zone, zones) VALUES ('weeknight', '23:00:00', '23:45:00', 15, ARRAY[1,2,3])`
    // ${program_name},${start_time},${end_time}, ${duration_per_zone}, ${zones}

    , (error, results) => {
    if (error) {
      throw error;
    }
    console.log(results)
    response.status(200).json(results)
  })
}

module.exports = {
  getDays,
  getPrograms,
  createProgram
}