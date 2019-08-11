import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ScheduleCard from './ScheduleCard';


const ScheduleArchive = ({ state, updateSelectedSchedule }) => {

  const createSchedules = () => {
   return state.schedules.map(schedule => {
      return (
          <ScheduleCard schedule={schedule} key={schedule.id} updateSelectedSchedule={updateSelectedSchedule}/>
        )
    })
  }

  return (
    <div className="schedule-archive">
      <div>
        <h2>
          Check out all your sweet schedules
        </h2>
        <Link to="/edit_schedule" >
          <button>Create New Schedule</button>
        </Link>
      </div>
      <main>
        { createSchedules() }
      </main>
    </div>
  );
}
export default ScheduleArchive;