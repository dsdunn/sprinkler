import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { ScheduleCard } from './ScheduleCard';
import { DaysOfTheWeek } from './DaysOfTheWeek';


const ScheduleArchive = ({ schedules = [], currentRunningSchedule, setSelectedSchedule, editSchedule, runSchedule, stopRunning, ...props }) => {

  let [ days, setDays ] = useState([]);

  const filterSchedules = (schedules) => {
    if (!days.length) return schedules;

    return schedules.filter(schedule => {
      let hasDay = false;

      for (let i = 0; i < days.length; i++) {
        let day = days[i];
        
        if (schedule.days.includes(day)) {
          hasDay = true;
          break;
        }
      }
      return hasDay;
    })
  }

  const createSchedules = () => {
    return filterSchedules(schedules).map(schedule => {
      return (
          <ScheduleCard schedule={schedule} key={schedule.id} editSchedule={editSchedule} runSchedule={runSchedule}/>
        )
    })
  }

  const toggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(i => i !== day))
    } else {
      setDays([...days, day].sort());
    }
  }

  const goToRunning = () => {
    setSelectedSchedule(currentRunningSchedule);
    props.history.push('/program');
  }

  return (
    <main className="schedule-archive">
      <section className="top">
        <DaysOfTheWeek days={days} toggleDay={ toggleDay }/>
        <div className="button-container">
          <Link to="/program">
            <Button variant="contained" className="new-program-button control-button" color="primary">New</Button>
          </Link>
          { 
            currentRunningSchedule && 
              <Button variant="contained" color="secondary" className="stop-button control-button" onClick={ stopRunning }>
                Stop
              </Button> 
          }
          { 
            currentRunningSchedule && 
              <Button variant="contained" color="secondary" className="running-button control-button" onClick={goToRunning}>
                Running
              </Button> 
          }
        </div>
      </section>
      <section className="schedule-container">
        { createSchedules() }
      </section>
    </main>
  );
}
export default ScheduleArchive;