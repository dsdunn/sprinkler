export function calculateEndTime({ start_time, interval, iterations, zones, duration_per_zone }) {
  let session = zones.length * duration_per_zone;
  let totalTime = session * iterations + (iterations - 1) * interval;
  let startMinutes = timeStringToMinutes(start_time);

  return minutesToTimeString(startMinutes + totalTime);
}

function timeStringToMinutes(string) {
  if (!string) {
    return;
  }

  let array = string.split(':');
  let minutes = parseInt(array[0]) * 60;

  return minutes + parseInt(array[1]);
}

function minutesToTimeString(totalMinutes) {
  if (totalMinutes < 60) {
    return '00:' + totalMinutes.toString();
  } 
  if (totalMinutes > 24 * 60){
    totalMinutes = totalMinutes - (24 * 60);
  } 
  let minutes = totalMinutes % 60;
  let hours = (totalMinutes - minutes) / 60;

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (hours < 10) {
    hours = '0' + hours;
  } 

  return hours.toString() + ':' + minutes.toString();
}
