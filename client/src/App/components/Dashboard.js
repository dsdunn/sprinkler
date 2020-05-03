import React, { useState } from 'react';

const Dashboard = ({currentRunningSchedule, schedules, selectedSchedule, }) => {

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

  tick();

  return (
    <div className="dashboard">
      <div className="clock">
        { time }
      </div>
      <div>
        { selectedSchedule }
      </div>

    </div>
    )

}

export default Dashboard;