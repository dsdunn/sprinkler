import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';

import { Button, TextField } from '@material-ui/core';
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

const ScheduleSingle = ({ 
  currentlyOnZone, 
  currentRunningSchedule, 
  selectedSchedule, 
  saveSchedule, 
  deleteSchedule, 
  setSelectedSchedule,
  runSchedule,
   ...props 
 }) => {

  let isCurrentRunningSchedule = currentRunningSchedule && selectedSchedule && currentRunningSchedule.id === selectedSchedule.id;

  // const initDays = (schedule) => {
  //   let days = schedule.days || [];

  //   let newDays = new Array(7);

  //   for (let i = 0; i < 7; i++) {
  //     newDays[i] = days.includes(i);
  //   }
  //   schedule.days = newDays;

  //   return schedule;
  // }

  const reducer = (state, { name, value }) => {
    if (name === "schedule") {
      return value;
    }

    return ({
      ...state,
      [name]: value
    })
  };

  let { 
    id, 
    schedule_name, 
    start_time, 
    end_time, 
    interval, 
    iterations, 
    duration_per_zone, 
    zones, 
    days 
  } = isCurrentRunningSchedule ? currentRunningSchedule : selectedSchedule;

  let scheduleToEdit = {
    id: id || null,
    schedule_name: schedule_name || '',
    start_time: start_time || '06:00',
    end_time: end_time || '06:30',
    interval: interval || 0,
    iterations: iterations || 1,
    duration_per_zone: duration_per_zone || 5,
    zones: zones || [0,1,2,3,4,5],
    days: days || [0,1,2,3,4,5,6]
  }

  const [ schedule, dispatch ] = useReducer(reducer, scheduleToEdit);

  const handleRunSchedule = async (event) => {
    let newRunning = await runSchedule(schedule.id);
    selectedSchedule = newRunning;
    currentRunningSchedule = newRunning;
    dispatch({name: 'schedule', value: newRunning });
  }

  const handleChange = (event) => {
    let { name, value } = event.target;

    if (name !== 'schedule_name') {
      value = parseInt(value);
      setEndTime({ [name]: value });
    }

    dispatch({name, value});
    saveSchedule(schedule);
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
    let days = schedule.days.filter(day => day !== dayToToggle);

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
          isReadOnly={isCurrentRunningSchedule}
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
          <Button variant="contained" color="secondary" className="stop-button  control-button">Stop</Button>
          {
            !isCurrentRunningSchedule && 
              <Button 
                variant="contained" 
                color="secondary" 
                className="run-button control-button"
                onClick={handleRunSchedule}
              >
              Run </Button>
          }
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
            InputProps={{
              readOnly: isCurrentRunningSchedule,
            }}
            onChange={handleChange}
          />
          <Zones zones={schedule.zones} toggleZone={toggleZone} isReadOnly={isCurrentRunningSchedule}/>
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
                readOnly: isCurrentRunningSchedule
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
              InputProps={{
                inputProps: { min: 1, max: 6 },
                readOnly: isCurrentRunningSchedule 
              }}
              value={schedule.iterations} 
              onChange={handleChange}
            />
            <TextField
              label="interval"
              id="interval-input"
              className="w-full"
              name="interval" 
              type="number" 
              InputProps={{
                inputProps: { min: 0, max: (60 * 5) },
                readOnly: isCurrentRunningSchedule
              }}
              value={schedule.interval} 
              onChange={handleChange}
            />
            <TextField
              label="dur. per zone"
              id="duration-input"
              className="w-full"
              name="duration_per_zone" 
              type="number" 
              InputProps={{
                inputProps: { min: 1, max: 60 },
                readOnly: isCurrentRunningSchedule
              }}
              value={schedule.duration_per_zone} 
              onChange={handleChange}
            />
          </div>
          { 
            !isCurrentRunningSchedule &&
              <div className="flex space-evenly">
                <Button variant="contained" color="primary" onClick={updateSchedule}>Save Schedule</Button>
                <Button variant="contained" color="secondary" onClick={removeSchedule}>Delete</Button>
              </div>
          }
        </form>
      </section>
    </main>
  );
}
export default ScheduleSingle;