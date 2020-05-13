import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { Button, ButtonGroup, Container, Grid, Typography } from '@material-ui/core';



let useStyles = makeStyles((theme) => ({
  zoneAndTime: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  programGrid: {
    marginBottom: '0.5em',

    '& .heading': {
      textAlign: 'center',
      marginBottom: '0.4em',
    },
    '& .cell': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '2.1em',
      height: '100%'
    },
    '& .cell > div:first-child': {
      alignItems: 'center',
      paddingRight: '5px',
      fontSize: '14px',
    }
  },
  noProgram: {
    textAlign: 'center'
  },
  time: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1,
    alignItems: 'center',
    fontSize: '28px',
    color: theme.palette.secondary
  },
  zoneDisplay: {
    textAlign: 'left',
    fontSize: '2em',
    flexGrow: 1,
  },
  create: {
    margin: '0.5em',
    color: 'secondary',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
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
          <Grid className="cell" item container xs={12}>
            <div>zones: </div>
            <div>{zones}</div>
          </Grid>
          <Grid className="cell" item container xs={4}>
            <div>per zone: </div>
            <div>{duration_per_zone}</div>
          </Grid>
          <Grid className="cell" item container xs={4}>
            <div>iterations: </div>
            <div>{iterations}</div>
          </Grid>
          <Grid className="cell" item container xs={4}>
            <div>interval: </div>
            <div>{interval}</div>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <div>start: </div>
            <div>{start_time}</div>
          </Grid>
          <Grid className="cell" item container xs={6}>
            <div>end: </div>
            <div>{end_time}</div>
          </Grid>
        </Grid> 
        );
    } else {
      return (
        <p className={classes.noProgram}>no current running program</p>
        );
    }
  }

  const daysOfTheWeek = () => {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <ButtonGroup className="daysOfTheWeek">
      {
        days.map((day, index) => {

          return (
            <Button className="header-day" variant="contained" color={'secondary'} key={index}>
              <Typography color={'textPrimary'} >{ day } </Typography>
            </Button>
            )
        })
      }
      </ButtonGroup>
      )
  }

  tick();

  return (
    <section className="dashboard top">
      <Container>
          <div className={classes.zoneAndTime}> 
            <span className={classes.zoneDisplay}>{ currentlyOnZone != null && `zone ${currentlyOnZone + 1} on`} </span>
            <span className={classes.time}>
              { time }
            </span>
          </div>
        { scheduleDisplay()  }
      </Container>
      <div className={classes.dashboardInfo}>
        <Link to="/edit_schedule" className={classes.buttonContainer}>
          <Button onClick={() => updateSelectedSchedule({})} variant="contained" className={classes.create} color="primary">New Program</Button>
        </Link>
        <div className="header">
          { daysOfTheWeek() }
        </div>
      </div>
    </section>
    )

}

export default Dashboard;