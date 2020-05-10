import React from 'react';
import { Box } from '@material-ui/core';

import ScheduleCard from './ScheduleCard';


const ScheduleArchive = ({ schedules = [], currentRunningSchedule = {}, updateSelectedSchedule, runSchedule }) => {

  const createSchedules = () => {
    return schedules.map(schedule => {
      return (
          <ScheduleCard schedule={schedule} key={schedule.id} updateSelectedSchedule={updateSelectedSchedule} runSchedule={runSchedule}/>
        )
    })
  }

  return (
    <div className="schedule-archive">
      <main>
        { createSchedules() }
      </main>
    </div>
  );
}
export default ScheduleArchive;