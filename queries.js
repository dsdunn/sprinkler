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
  let { program_name, duration_per_zone, zones } = request.body;

  pool.query(
    `INSERT INTO programs (program_name, start_time, end_time, duration_per_zone, zones) VALUES ('${program_name}', ${duration_per_zone}, ARRAY[${zones}]);`


    , (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json('you have successfully added program ' + program_name)
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
  getPrograms,
  createProgram,
  deleteProgram
}