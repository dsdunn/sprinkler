import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';
import './App.css';

import { ThemeProvider } from '@material-ui/styles';

import { sprinklerTheme, useStyles } from './AppStyles';

import * as api from './api';

import ScheduleArchive from './components/ScheduleArchive';
import ScheduleSingle from './components/ScheduleSingle';


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
      ws.send('socket party')
    }
  }

  const handleMessage = (payload) => {
    let { data } = payload;

    data = JSON.parse(data);
    
    let { zone, schedule } = data;
    console.log(zone, schedule);
    let id = schedule && schedule.id;
    let currentSchedule = getCurrentRunningSchedule();
    let currentId = currentSchedule && currentSchedule.id;

    if (currentlyOnZone !== zone) {
      setCurrentlyOnZone(zone);
    }

    if (currentId !== id) {
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

  const editSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    props.history.push('/program')
  }

  const runScheduleNow = async (id) => {
    let result = await api.putRunSchedule(id);
    let { schedule } = result;

    if (schedule) {
      schedule.id = 0;
      setCurrentRunningSchedule(schedule);
      setSelectedSchedule(schedule);
      schedule.zones && schedule.zones.length && setCurrentlyOnZone(schedule.zones[0])
      
      return schedule;
    }

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
                editSchedule={editSchedule}
                runSchedule={runScheduleNow}
                setSelectedSchedule={setSelectedSchedule}
                currentRunningSchedule={currentRunningSchedule}
              />
            )}
          />
          <Route 
            exact path='/program' 
            render={(props) => (
              <ScheduleSingle 
                {...props} 
                selectedSchedule={selectedSchedule} 
                saveSchedule={saveSchedule} 
                deleteSchedule={deleteSchedule}
                currentRunningSchedule={currentRunningSchedule}
                currentlyOnZone={currentlyOnZone}
                editSchedule={editSchedule}
                setSelectedSchedule={setSelectedSchedule}
                runSchedule={runScheduleNow}
              />
            )}
          />
        </Switch>
      </div>
    </ThemeProvider>
    );
}

export default withRouter(App);
