const apiFetch = (path, method = 'GET', payload = null) => {
  let body = payload ? JSON.stringify(payload) : null;

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
  let result = await response.json();

  return result;
}

export const createSchedule = async (schedule) => {
  let response = await apiFetch('/schedules', 'POST', schedule);
  let results = await response.json();

  return results;
};

export const putSchedule = async (schedule) => {
  let response = await apiFetch('/schedules', 'PUT', schedule);
  let results = await response.json();

  return results;
}

export const putRunSchedule = async (schedule) => {
  let response = await apiFetch(`/run_schedule`, 'PUT', schedule);
  let results = await response.json();

  return results;
}

export const stopCurrentRunningSchedule = async () => {
  let response = await apiFetch('/stop', 'PUT');
// not json
  return response;
}

export const deleteSchedule = async (id) => {
  let response = await apiFetch('/schedules', 'DELETE', {id})
  let results = await response.json();

  return results;
}
