import React from 'react';
import { Card, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '1em auto',
    padding: '0.3em 1em',
    
    '& .card-title': {
      textAlign: 'center',
      // 'margin': '0.5em auto',
      fontSize: '16px'
    },
    // '& .card-body': {
    //   display: 'flex',
    //   justifyContent: 'space-between'
    // },
    '& .controls': {
      display: 'flex',
    },
    '& .card-button': {
      margin: '0.5em',
      flexGrow: '1'
    },

    '& .card-details': {
      fontSize: '16px',

      '& .label': {
        display: 'inline-block',
        fontSize: '12px',
        width: '70px',
        textAlign: 'right',
        marginRight: '5px'
      }
    }
  }
});

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ScheduleCard = ({ schedule, editSchedule, runSchedule }) => {

  let days = dayNames.filter((name, i) => {
    return schedule.days.includes(i);
  }).join(', ');

  let zones = schedule.zones.map(zone => zone + 1).join(', ');

  const classes = useStyles();

  return (
    <Card className={classes.root}>
        <div className="card-title w-full">
          { schedule.schedule_name }
        </div>
        <div className="card-body">
          <div className="card-details">
            <div><span className="label">days: </span><span>{days}</span></div>
            <div><span className="label">zones: </span><span>{ zones }</span></div>
            <div><span className="label">min/iter/int: </span><span>{ schedule.duration_per_zone + '/' + schedule.iterations + '/' + schedule.interval}</span></div>
          </div>
          <div className="controls">
            <Button variant="contained" className="card-button" onClick={() => editSchedule(schedule) }>Edit</Button>
            <Button variant="contained" className="card-button" onClick={() => runSchedule(schedule) }>Run</Button>
          </div>
        </div>
    </Card>
  );
}
