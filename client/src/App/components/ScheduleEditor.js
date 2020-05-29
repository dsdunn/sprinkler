import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, TextField, Typography } from '@material-ui/core';

import { DaysOfTheWeek } from './DaysOfTheWeek';
import { Zones } from './Zones';

import { calculateEndTime } from '../../utils.js';

const ScheduleEditor = ({ selectedSchedule, saveSchedule, deleteSchedule, ...props }) => {
  let { id, schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = selectedSchedule;

  let scheduleToEdit = {
    id: id || null,
    schedule_name: schedule_name || '',
    start_time: start_time || '06:00',
    end_time: end_time || '06:00',
    interval: interval || 1,
    iterations: iterations || 1,
    duration_per_zone: duration_per_zone || 5,
    zones: zones || [],
    days: days || []
  }

  const reducer = (state, { name, value }) => {
    return ({
      ...state,
      [name]: value
    })
  };

  const initDays = (schedule) => {
    let days = schedule.days || [];

    let newDays = new Array(7);

    for (let i = 0; i < 7; i++) {
      newDays[i] = days.includes(i);
    }
    schedule.days = newDays;

    return schedule;
  }

  const [ schedule, dispatch ] = useReducer(reducer, scheduleToEdit, initDays);

  const handleChange = (event) => {
    let { name, value } = event.target;

    if (name.includes('day_')) {
      toggleDay(name);
    } 
    else if (name.includes('zone_')) {
      toggleZone(name);
    } else {
      dispatch({name, value});
    }
    setEndTime({ [name]: value });
  }


  // const createDays = () => {
  //   let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  //   return dayNames.map((day, index) => {
  //     return (
  //         <label htmlFor={day} key={index}>
  //           <input name={ `day_${index}` } type="checkbox" checked={ schedule.days[index] } onChange={handleChange}/>
  //           <div>{day}</div>
  //         </label>
  //       )
  //   })
  // }

  // const createZones = () => {
  //   let zones = [];

  //   for (let i = 0; i < 6; i++) {
  //     zones.push(
  //         <label htmlFor={`zone_${i + 1}`} key={i}>
  //           <input type="checkbox" name={`zone_${i + 1}`} checked={schedule.zones.includes(i)} onChange={handleChange} />
  //           <div>{ `${i + 1}` }</div>
  //         </label>
  //       )
  //   }
  //   return zones;
  // }


  const updateSchedule = (event) => {
    event.preventDefault();
    if (!validateTime(schedule.end_time)) {
      alert('you suck. invalid end time' + schedule.end_time)
      return;
    }
    saveSchedule(schedule);
    props.history.goBack();
  }

  const removeSchedule = (event) => {
    event.preventDefault();
    deleteSchedule(schedule.id);
    props.history.goBack();
  }

  const setEndTime = (change) => {
    schedule.end_time = calculateEndTime({ ...schedule, ...change });
  }

  const toggleDay = (day) => {
    let days = schedule.days;
    let dayIndex = parseInt(day.slice(4));

    days[dayIndex] = !days[dayIndex];

    dispatch({name: 'days', value: days});
  }

  const toggleZone = (zone) => {
    let zones = schedule.zones;
    let zoneIndex = parseInt(zone.slice(5)) - 1;

    if (zones.includes(zoneIndex)) {
      zones = zones.filter(zone => zone !== zoneIndex);
    } else {
      zones.push(zoneIndex)
    }

    dispatch({name: 'zones', value: zones});
  }

  const validateTime = (endtime) => {
    return (schedule.end_time && !schedule.end_time.includes('NaN'));
  }

  return (
    <main className="schedule-editor">
      <section className="top">
        <DaysOfTheWeek 
          selectedSchedule={selectedSchedule}
          updateSchedule={updateSchedule} 
        />
        <div className="button-container">
          <Link to="/">
            <Button variant="contained" className="new-program-button control-button" color="primary">Back</Button>
          </Link>
          <Button variant="contained" color="secondary" className="stop-button  control-button" color="secondary">Stop</Button>
          <Button variant="contained" color="secondary" className="run-button  control-button" color="secondary">Run</Button>
        </div>
      </section>
      <section className="schedule-container">
        <form className="schedule-form-main">
          <TextField 
            id="program-name-input"
            name="schedule_name"
            variant="outlined" 
            placeholder="program name" 
            value={schedule.schedule_name || '' } 
            onChange={handleChange}
          />
          <TextField
            id="start-time-input"
            name="start_time"
            label="start time"
            type="time"
            value={schedule.start_time}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            onChange={handleChange}
          />
          <Typography>
              end time: { schedule.end_time }
          </Typography>
          <TextField
            label="iterations"
            id="iterations-input"
            name="iterations" 
            type="number" 
            min="0" 
            max="60" 
            value={schedule.iterations} 
            onChange={handleChange}
          />
          <TextField
            label="interval"
            id="interval-input"
            name="interval" 
            type="number" 
            min="0" 
            max="60" 
            value={schedule.interval} 
            onChange={handleChange}
          />
          <TextField
            label="duration per zone"
            id="duration-input"
            name="duration_per_zone" 
            type="number" 
            min="1" 
            max="30" 
            value={schedule.duration_per_zone} 
            onChange={handleChange}
          />
          {/*<div className="schedule-form-days-of-week">
            {createDays()}
          </div>*/}
          {/*<div className="flex space-evenly">
          { createZones() }
          </div>*/}
          <div className="flex space-evenly">
            <Button variant="contained" color="primary" onClick={updateSchedule}>Save Schedule</Button>
            <Button variant="contained" color="theme.pallete.button.warning" onClick={removeSchedule}>Delete</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
export default ScheduleEditor;