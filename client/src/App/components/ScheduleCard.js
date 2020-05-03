import React, { Component } from 'react';

const ScheduleCard = ({ schedule, updateSelectedSchedule }) => {
  const handleUpdateSelectedSchedule = () => {
    updateSelectedSchedule(schedule)
  }
  return (
    <div>
      <div className="schedule-card">
        { schedule.schedule_name }
        <div>id: { schedule.id }</div>
      </div>
      <div onClick={ handleUpdateSelectedSchedule }>Edit</div>
    </div>
  );
}


export default ScheduleCard;