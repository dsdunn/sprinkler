const apiFetch = (path, method = 'GET', payload = null) => {
  console.log('payload: ', payload);
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


export const getSchedules = async () => {
  let response = await apiFetch('/schedules');
  let results = await response.json();

  return results;
}

export const createSchedule = async (schedule) => {
  let response = await apiFetch('/schedules', 'POST', schedule)
  let results = await response.json();

  return results;
};

export const putSchedule = async (schedule) => {
  let response = await apiFetch('/schedules', 'PUT', schedule)
  let results = await response.json();

  return results;
}

export const deleteSchedule = async (id) => {
  let response = await apiFetch('/schedules', 'DELETE', {id})
  let results = await response.json();
  // console.log(results)

  return results;
}

// export default {
//   getSchedules,
//   createSchedule,
// }