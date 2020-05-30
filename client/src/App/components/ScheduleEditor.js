import React, { useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DaysOfTheWeek } from './DaysOfTheWeek';
import { Zones } from './Zones';

import { calculateEndTime } from '../../utils.js';

const useStyles = makeStyles({
  editor: {
    '& > *' : {
      marginTop: '1em',
    },
    '& .flex-full': {
      display: 'flex',
      width: '100%'
    },
    '& .w-full': {
      width: '100%'
    },
    '& input': {
      textAlign: 'center'
    },
    '& .zones-title': {
      textAlign: 'center',
      fontSize: '12px'
    },
    '& .active': {
      background: 'orange'
    }
  }
})

const ScheduleEditor = ({ selectedSchedule, saveSchedule, deleteSchedule, setSelectedSchedule, ...props }) => {
  let { id, schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = selectedSchedule;

  let scheduleToEdit = {
    id: id || null,
    schedule_name: schedule_name || '',
    start_time: start_time || '06:00',
    end_time: end_time || '06:00',
    interval: interval || 0,
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

    if (name != 'schedule_name') {
      value = parseInt(value);
      setEndTime({ [name]: value });
    }

    dispatch({name, value});
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

  const toggleDay = (dayToToggle) => {
    let days = schedule.days;

    days[dayToToggle] = !days[dayToToggle];
    dispatch({name: 'days', value: days});
  }

  const toggleZone = (zoneToToggle) => {
    let zones = schedule.zones;

    if (zones.includes(zoneToToggle)) {
      zones = zones.filter(zone => zone !== zoneToToggle);
    } else {
      zones.push(zoneToToggle)
    }
    dispatch({name: 'zones', value: zones});
    setEndTime({ zones });
  }

  const validateTime = (endtime) => {
    return (schedule.end_time && !schedule.end_time.includes('NaN'));
  }

  const classes = useStyles();

  return (
    <main className="schedule-editor">
      <section className="top">
        <DaysOfTheWeek 
          days={schedule.days}
          toggleDay={toggleDay} 
        />
        <div className="button-container">
          <Link to="/">
            <Button 
              variant="contained"
              className="new-program-button control-button"
              color="primary"
              onClick={() => setSelectedSchedule({})}>
            Back</Button>
          </Link>
          <Button variant="contained" color="secondary" className="stop-button  control-button" color="secondary">Stop</Button>
          <Button variant="contained" color="secondary" className="run-button  control-button" color="secondary">Run</Button>
        </div>
      </section>
      <section className="schedule-container">
        <form className={`schedule-form-main ${classes.editor}`}>
          <TextField 
            id="program-name-input"
            name="schedule_name"
            variant="outlined" 
            placeholder="program name" 
            value={schedule.schedule_name || '' } 
            onChange={handleChange}
          />
          <Zones zones={schedule.zones} toggleZone={toggleZone}/>
          <div className="flex-full">
            <TextField
              id="start-time-input"
              className="w-full"
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
            <TextField
              id="end-time-field"
              className="w-full"
              name="end_time"
              label="end time"
              type="time"
              value={schedule.end_time}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="flex-full">
            <TextField
              label="iterations"
              id="iterations-input"
              className="w-full"
              name="iterations" 
              type="number"
              InputProps={{inputProps: { min: 1, max: 6 } }}
              value={schedule.iterations} 
              onChange={handleChange}
            />
            <TextField
              label="interval"
              id="interval-input"
              className="w-full"
              name="interval" 
              type="number" 
              InputProps={{inputProps: { min: 0, max: (60 * 5) } }}
              value={schedule.interval} 
              onChange={handleChange}
            />
            <TextField
              label="dur. per zone"
              id="duration-input"
              className="w-full"
              name="duration_per_zone" 
              type="number" 
              InputProps={{inputProps: { min: 1, max: 60 } }}
              value={schedule.duration_per_zone} 
              onChange={handleChange}
            />
          </div>
          <div className="flex space-evenly">
            <Button variant="contained" color="primary" onClick={updateSchedule}>Save Schedule</Button>
            <Button variant="contained" color="secondary" onClick={removeSchedule}>Delete</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
export default ScheduleEditor;