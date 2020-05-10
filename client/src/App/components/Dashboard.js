import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { Button, ButtonGroup, Container, Grid } from '@material-ui/core';



let useStyles = makeStyles((theme) => ({
  zoneAndTime: {
    display: 'flex',
    alignItems: 'center',
  },
  programGrid: {
    marginBottom: '2em',

    '& .heading': {
      textAlign: 'center',
      marginBottom: '0.4em',
    },
    '& .cell': {
      border: '0.5px solid',
      padding: '0.5em'
    },
    '& .cell > div:first-child': {
      display: 'flex',
      alignItems: 'center',
      paddingRight: '5px',
      fontSize: '10px',
      alignItems: 'center'
    }
  },
  noProgram: {
    textAlign: 'center'
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    textAlign: 'right',
    color: theme.palette.secondary,
    margin: 'auto'
  },
  zoneDisplay: {
    fontSize: '2em'
  },
  create: {
    margin: '1em',
    color: 'secondary'
  }
}));


const Dashboard = ({currentRunningSchedule, currentlyOnZone, updateSelectedSchedule}) => {

  const [time, setTime] = useState(null);
  let classes = useStyles();

  const clock = () => {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    let timeVal = h + ":" + m + ":" + s + " " + session;

    setTime(timeVal);
  }

  const tick = () => {
    setTimeout(clock, 1000);
  }

  const scheduleDisplay = () => {
    const namedDays =['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (currentRunningSchedule) {
      let { schedule_name, id, start_time, end_time, duration_per_zone, iterations, interval, zones, days } = currentRunningSchedule;

      zones = zones.map((zone) => zone + 1).join(', ');
      days = days.map(day => {
        return namedDays[day];
      })

      return (
        <Grid container className={classes.programGrid}>
          <Grid className="heading" item xs={12}><span>{schedule_name}</span></Grid>
          <Grid className="cell" item container xs={6}>
            <Grid xs={6} item>start: </Grid>
            <Grid xs={6} item>{start_time}</Grid>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <Grid xs={6} item>end: </Grid>
            <Grid xs={6} item>{`${end_time}`}</Grid>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <Grid xs={6} item>zones: </Grid>
            <Grid xs={6} item>{`${zones}`}</Grid>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <Grid xs={6} item>per zone: </Grid>
            <Grid xs={6} item>{`${duration_per_zone} min`}</Grid>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <Grid xs={6} item>iterations: </Grid>
            <Grid xs={6} item>{`${iterations}`}</Grid>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <Grid xs={6} item>interval: </Grid>
            <Grid xs={6} item>{`${interval}`}</Grid>
          </Grid>
        </Grid> 
        );
    } else {
      return (
        <p className={classes.noProgram}>no current running program</p>
        );
    }
  }

  tick();

  return (
    <section className="dashboard">
      <Container>
          <div className={classes.zoneAndTime}>Zone On: &nbsp; 
            <span className={classes.zoneDisplay}>{ currentlyOnZone == null ? 'none' : `${currentlyOnZone + 1}` }</span>
            <span className={classes.time}>
              { time }
            </span>
          </div>
        { scheduleDisplay()  }
      </Container>
      <div className={classes.dashboardInfo}>
        <Link to="/edit_schedule">
          <Button onClick={() => updateSelectedSchedule({})} variant="contained" className={classes.create} color="primary">New Program</Button>
        </Link>
      </div>
    </section>
    )

}

export default Dashboard;