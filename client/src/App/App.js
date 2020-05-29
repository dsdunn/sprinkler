import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter, Link } from 'react-router-dom';
import './App.css';

import { CssBaseline, Container } from '@material-ui/core';

import ScheduleArchive from './components/ScheduleArchive';
import ScheduleEditor from './components/ScheduleEditor';
import Dashboard from './components/Dashboard';

import * as api from './api';

import { Button, ButtonGroup, Typography } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const sprinklerTheme = createMuiTheme({
  palette: {
    type: 'dark',

    primary: {
      main: '#2978A0',
    },
    secondary: {
      main: '#315659',
    },
    info: {
      main: '#B4534D',
    },
    text: {
      primary: '#BCAB79',
    },
    button: {
      warning: 'red'
    }
  },
});

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    minHeight: '110vh',
    backgroundColor: '#253031',
    color: '#BCAB79',

    '& .days-of-the-week': {
      display: 'flex',
      height: '10vh',
      width: '100vw',

      '& .header-day': {
        flexGrow: 1,
        height: '100%',
      }
    },
    '& .schedule-archive': {
      overflow: 'scroll',
    },
    '& .schedule-container': {
      paddingTop: '20vh'
    },
    '& .top': {
      position: 'fixed',
      zIndex: '20',
      backgroundColor: '#253031'
    },
    '& a': {
      textDecoration: 'none'
    },
    '& .button-container': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    '& .control-button': {
      width: '90px',
      margin: '1em 0',
      // padding: '0.5em 2em'
    }
  },
});

const ws = new WebSocket('ws://localhost:8080');

const App = (props) => {

  const [ currentRunningSchedule, setCurrentRunningSchedule ] = useState(null);
  const [ schedules, setSchedules ] = useState([]);
  const [ selectedSchedule, setSelectedSchedule ] = useState({});
  const [ currentlyOnZone, setCurrentlyOnZone ] = useState(null);

  useEffect(() => {
    initSocket();

    const getSchedules = async () => {
      let schedules = await api.getSchedules();

      setSchedules(schedules);
    }

    getSchedules();
  },[])

  useEffect(() => {
    ws.onmessage = handleMessage;
  })

  const initSocket = () => {
    ws.onopen = () => {
      console.log('sockets bitch!')
      ws.send('socket party')
    }
  }

  const handleMessage = (payload) => {
    let { data } = payload;

    data = JSON.parse(data);
    
    let { zone, schedule } = data;
    let id = schedule && schedule.id;
    let currentSchedule = getCurrentRunningSchedule();
    let currentId = currentSchedule && currentSchedule.id;

    if (currentlyOnZone !== zone) {
      setCurrentlyOnZone(zone);
    }

    if (currentId != id) {
      setCurrentRunningSchedule(schedule);
    }
  }

  const createSchedule = async (schedule) => {
    let response = await api.createSchedule(schedule);

    setSchedules([...schedules, response.schedule]);
    setSelectedSchedule(response.schedule);

    props.history.goBack();
  }

  const putSchedule = async (schedule) => {
    let response = await api.putSchedule(schedule);

    setSchedules([...schedules.filter(oldSchedule => {
        return schedule.id !== oldSchedule.id;
      }),
      response.schedule
    ])
  }

  const saveSchedule = (schedule) => {
    if (schedule.id) {
      putSchedule(schedule);
    } else {
      createSchedule(schedule);
    }
  }

  const deleteSchedule = async (id) => {
    if (!id) {
      return;
    }
    let response = await api.deleteSchedule(id);

    let newList = schedules.filter(schedule => {
        return schedule.id !== id;
      });

    setSchedules(newList);
  }

  const updateSelectedSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    props.history.push('/edit_schedule')
  }

  const runSchedule = async (id) => {
    let response = await api.putRunSchedule(id);
    // let result = await response.json();
    console.log(response);
  }

  const getCurrentRunningSchedule = () => {
    return currentRunningSchedule;
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme={sprinklerTheme} >
      <div className={`App ${classes.root}`}>
        <Switch>
          <Route 
            exact path='/' 
            render={(props) => (
              <ScheduleArchive 
                {...props} 
                schedules={schedules}
                updateSelectedSchedule={updateSelectedSchedule}
                runSchedule={runSchedule}
              />
            )}
          />
          <Route 
            exact path='/program' 
            render={(props) => (
              <ScheduleEditor 
                {...props} 
                selectedSchedule={selectedSchedule} 
                saveSchedule={saveSchedule} 
                deleteSchedule={deleteSchedule}
                currentRunningSchedule={currentRunningSchedule}
                currentlyOnZone={currentlyOnZone}
                updateSelectedSchedule={updateSelectedSchedule}
              />
            )}
          />
        </Switch>
      </div>
    </ThemeProvider>
    );
}

export default withRouter(App);
