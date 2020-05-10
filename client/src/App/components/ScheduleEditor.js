import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { calculateEndTime } from '../../utils.js';

const ScheduleEditor = ({ selectedSchedule, saveSchedule, deleteSchedule, ...props }) => {
  let { id, schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = selectedSchedule;

  let scheduleToEdit = {
    id: id || null,
    schedule_name: schedule_name || 'New Schedule',
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


  const initDays = (schedule) => {
    days = schedule.days || [];

    let newDays = new Array(7);

    for (let i = 0; i < 7; i++) {
      newDays[i] = days.includes(i);
    }
    schedule.days = newDays;

    return schedule;
  }

  const [ schedule, dispatch ] = useReducer(reducer, scheduleToEdit, initDays);

  const createDays = () => {
    let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return dayNames.map((day, index) => {
      return (
          <label htmlFor={day} key={index}>
            <input name={ `day_${index}` } type="checkbox" checked={ schedule.days[index] } onChange={handleChange}/>
            <div>{day}</div>
          </label>
        )
    })
  }

  const createZones = () => {
    let zones = [];

    for (let i = 0; i < 6; i++) {
      zones.push(
          <label htmlFor={`zone_${i + 1}`} key={i}>
            <input type="checkbox" name={`zone_${i + 1}`} checked={schedule.zones.includes(i)} onChange={handleChange} />
            { `Zone ${i + 1}` }
          </label>
        )
    }
    return zones;
  }


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
    <div className="schedule-editor">
      <h5>{ schedule.schedule_name || 'Another Schedule'}</h5>
      <Link to="/">
        <button>back to schedules</button>
      </Link>
      <section className="schedule-editor-main">
        <form className="schedule-form-main">
          <label htmlFor="schedule_name">
            Schedule Name:
            <input name="schedule_name" value={schedule.schedule_name || '' } onChange={handleChange}/>
          </label>
          <label htmlFor="start_time">
            Start Time:
            <input name="start_time" type="time" value={schedule.start_time} onChange={handleChange}/>
          </label>
          <div>
            <p>
              end time: { schedule.end_time }
            </p>
          </div>
          <label htmlFor="interval">
            Interval:
            <input name="interval" type="number" min="0" max="300" value={schedule.interval} onChange={handleChange}/>
          </label>
          <label htmlFor="iterations">
            Iterations:
            <input name="iterations" type="number" min="1" max="20" value={schedule.iterations} onChange={handleChange}/>
          </label>
        </form>
        <form className="schedule-form-days-of-week">
          {createDays()}
        </form>
        <form className="schedule-form-program">
          <h4>Pattern</h4>
          <label htmlFor="duration_per_zone">
            <input type="number" min="1" max="30" name="duration_per_zone" value={schedule.duration_per_zone} onChange={handleChange}/>
            minutes per zone
          </label>
          <fieldset>
          { createZones() }
          </fieldset>
          <button onClick={updateSchedule}>Save Schedule</button>
          <button onClick={removeSchedule}>Delete</button>
        </form>
      </section>
    </div>
  );
}
export default ScheduleEditor;