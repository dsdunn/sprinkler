function calculateEndTime({ start_time, interval, iterations, zones, duration_per_zone }) {
  let session = zones.length * duration_per_zone;
  let totalTime = session * iterations + (iterations - 1) * interval;
  let startSeconds = timeStringToSeconds(start_time);

  return secondsToTimeString(startSeconds + totalTime * 60);
}

function timeStringToSeconds(string) {
  if (!string) {
    return;
  }

  let array = string.split(':');
  let hoursInSeconds = parseInt(array[0]) * 60 * 60;
  let minutesInSeconds = parseInt(array[1]) * 60;
  return hoursInSeconds + minutesInSeconds + parseInt(array[2]);
}

function secondsToTimeString(totalSeconds) {
  if (totalSeconds < 60) {
    return '00:00:' + totalSeconds.toString();
  } 
  if (totalSeconds > 24 * 60 * 60){
    totalSeconds = totalSeconds - (24 * 60 * 60);
  } 
  let minutesAndSeconds = totalSeconds % (60 * 60);
  let seconds = minutesAndSeconds % 60;
  let minutes = (minutesAndSeconds - seconds) / 60;
  let hours = (totalSeconds - minutesAndSeconds) / (60 * 60);
  
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (hours < 10) {
    hours = '0' + hours;
  } 

  return hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
}

module.exports = {
  calculateEndTime
}