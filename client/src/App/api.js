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

export const getPrograms = async () => {
  let response = await apiFetch('/get_programs');
  let result = await response.json();
  
  return result;
}

export const createProgram = async (program_name, zones, duration_per_zone) => {
  let response = await apiFetch('/create_program','POST', {
      program_name,
      zones,
      duration_per_zone
    }
  )
  let result = response.json()

  return result;
}

export const deleteProgram = async (program_name) => {
  let response = await apiFetch('/delete_program','DELETE',
      program_name
  )
  let result = response.json();
   console.log(result)
   return result;
}


export default {
  getWeek,
  getPrograms,
  createProgram,
  getSchedules,
  createSchedule,
  deleteProgram
}