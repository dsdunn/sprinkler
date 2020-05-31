import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { ScheduleCard } from './ScheduleCard';
import { DaysOfTheWeek } from './DaysOfTheWeek';


const ScheduleArchive = ({ schedules = [], currentRunningSchedule, setSelectedSchedule, editSchedule, runSchedule, ...props }) => {

  let [ filter, setFilter ] = useState([]);

  const createSchedules = () => {
    return schedules.map(schedule => {
      return (
          <ScheduleCard schedule={schedule} key={schedule.id} editSchedule={editSchedule} runSchedule={runSchedule}/>
        )
    })
  }

  const updateFilter = (days = []) => {
    setFilter(days)
  }

  const goToRunning = () => {
    setSelectedSchedule(currentRunningSchedule);
    props.history.push('/program');
  }

  return (
    <main className="schedule-archive">
      <section className="top">
        <DaysOfTheWeek setFilter={ setFilter }/>
        <div className="button-container">
          <Link to="/program">
            <Button variant="contained" className="new-program-button control-button" color="primary">New</Button>
          </Link>
          <Button variant="contained" color="secondary" className="stop-button control-button">Stop</Button>
          { 
            currentRunningSchedule &&
              <Button variant="contained" color="secondary" className="running-button control-button" onClick={goToRunning}>Running</Button>
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