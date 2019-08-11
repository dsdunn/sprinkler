import React, { Component } from 'react';

const ScheduleCard = ({ schedule, updateSelectedSchedule }) => {
  const handleUpdateSelectedSchedule = () => {
    updateSelectedSchedule(schedule.id)
  }
  return (
    <div>
      <div className="schedule-card">
        { schedule.schedule_name }
        <div>{ schedule.id }</div>
      </div>
      <div onClick={ handleUpdateSelectedSchedule }>UpdateSelected</div>
    </div>
  );
}


export default ScheduleCard;