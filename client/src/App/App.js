import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';

import { CssBaseline, Container } from '@material-ui/core';

import ScheduleArchive from './components/ScheduleArchive';
import ScheduleEditor from './components/ScheduleEditor';
import Dashboard from './components/Dashboard';

import * as api from './api';

import { Button, ButtonGroup } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const sprinklerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#AFBE8F',
    },
    secondary: {
      main: '#7D8570',
    },
    tertiary: {
      main: '#646F58'
    },
    highlight: {
      main: '#DDE392'
    },
    lowlight: {
      main: '#504B3A'
    }
  },
});

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    height: '100vh',

    '& .header': {
      display: 'flex',
      height: '15vh',
      width: '100vw',

      '& .header-day': {
        flexGrow: 1,
        height: '100%',
      }
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

  const daysOfTheWeek = () => {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <ButtonGroup className="header">
      {
        days.map((day, index) => {

          return (
            <Button className="header-day" variant="contained" key={index}>
              { day }
            </Button>
            )
        })
      }
      </ButtonGroup>
      )
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme={sprinklerTheme} >
      <div className={`App ${classes.root}`}>
        <section className="header">
          { daysOfTheWeek() }
        </section>
        <Container >
          <Dashboard 
            currentRunningSchedule={currentRunningSchedule}
            currentlyOnZone={currentlyOnZone}
          />
          <Switch>
            <Route 
              exact path='/' 
              render={(props) => (
                <Container maxWidth="md" backgroundColor="tertiary">
                  <ScheduleArchive 
                    {...props} 
                    currentRunningSchedule={currentRunningSchedule}
                    schedules={schedules}
                    updateSelectedSchedule={updateSelectedSchedule}
                    runSchedule={runSchedule}
                  />
                </Container>
              )}
            />
            <Route 
              exact path='/edit_schedule' 
              render={(props) => (
                <ScheduleEditor 
                  {...props} 
                  selectedSchedule={selectedSchedule} 
                  saveSchedule={saveSchedule} 
                  deleteSchedule={deleteSchedule}
                />
              )}
            />
          </Switch>
        </Container>
      </div>
    </ThemeProvider>
    );
}

export default withRouter(App);
