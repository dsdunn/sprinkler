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
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getDays
}