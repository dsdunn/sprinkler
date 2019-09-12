const apiFetch = (path, method = 'GET', payload = null) => {
  console.log(payload);
  let body = payload ? JSON.stringify(payload) : null
  return fetch(`/api/v1${path}`, {
    method,
    headers: {
     'Content-Type': 'application/json',
     'Accept': 'application/json'
    },
    body
  })
}


export const getWeek = async () => {
  let response = await apiFetch('/get_week');
  let results = await response.json();

  return results;
}  

export const getSchedules = async () => {
  let response = await apiFetch('/get_schedules');
  let results = await response.json();

  return results;
}

export const createSchedule = async (
  schedule_name, start_time, end_time, program, interval, iterations) => {

  let response = await apiFetch('/create_schedule', 'POST', {
    schedule_name,
    start_time,
    end_time,
    program,
    interval,
    iterations
  })
  let results = await response.json();

  return results;
};

export default {
  getWeek,
  getSchedules,
  createSchedule,
}