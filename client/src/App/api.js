const apiFetch = (path, method = 'GET', payload = null) => {
  let body = payload ? JSON.stringify(payload) : null
  return fetch(`/api/v1/get_week`, {
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

  return await response.json();
}  

export const getPrograms = async () => {
  let response = await apiFetch('/get_programs');
  let result = await response.json();
  
  return result;
}

export const createProgram = async (program_name, start_time, end_time, zones, duration_per_zone) => {
  let response = await apiFetch('/create_program','POST', {
      program_name,
      start_time,
      end_time,
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
  deleteProgram
}