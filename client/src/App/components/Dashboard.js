import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const Dashboard = ({currentRunningSchedule, currentlyOnZone }) => {

  const [time, setTime] = useState(null);

  const clock = () => {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    let timeVal = h + ":" + m + ":" + s + " " + session;

    setTime(timeVal);

    
  }

  const tick = () => {
    setTimeout(clock, 1000);
  }

  const scheduleDisplay = () => {
    const namedDays =['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (!currentRunningSchedule) {
      return (
        <p>no schedule currently running</p>
        );
    } else {
      let { schedule_name, id, start_time, end_time, duration_per_zone, iterations, interval, zones, days } = currentRunningSchedule;

      zones = zones.join(', ');
      days = days.map(day => {
        return namedDays[day];
      })

      return (
        <div> 
          <h2>Currently On Zone: { typeof currentlyOnZone === 'number' ? currentlyOnZone + 1 : 'None'  }</h2>
          <h2>Currently Running: { schedule_name }</h2>
          <p>Zones { zones } will each run for { duration_per_zone } minutes, starting at { start_time }, repeating { iterations } time(s) with { interval } minutes between sessions.</p>
          <p>end time: {end_time}</p>
        </div>
        );
    }
  }


  let useStyles = makeStyles({
    time: {
      textAlign: 'right',
      color: 'purple',
      margin: '0.4rem auto'
    },
    feedback: {
      '& p': { 
        margin: '0 auto 0.4rem'
      }
    }
  })



  tick();


  let classes = useStyles();

  return (
    <div className="dashboard">
      <div className={classes.time}>
        { time }
      </div>
      <div className={classes.feedback}>
        { scheduleDisplay()  }
      </div>

    </div>
    )

}

export default Dashboard;