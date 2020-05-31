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
    await api.deleteSchedule(id);
    let newList = schedules.filter(schedule => {
        return schedule.id !== id;
      });

    setSchedules(newList);
  }

  const editSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    props.history.push('/program')
  }

  const runScheduleNow = async (schedule) => {
    let nowSchedule = { ...schedule, id: 0 };

    let response = await api.putRunSchedule(nowSchedule);
    let scheduleToRun = response.schedule;

    if (scheduleToRun) {
      setCurrentRunningSchedule(scheduleToRun);
      setSelectedSchedule(scheduleToRun);
      scheduleToRun.zones && scheduleToRun.zones.length && setCurrentlyOnZone(scheduleToRun.zones[0])

      props.history.push('/program');
      
      return scheduleToRun;
    }

  }

  const getCurrentRunningSchedule = () => {
    return currentRunningSchedule;
  }

  const stopCurrentRunningSchedule = async () => {
    let response = await api.stopCurrentRunningSchedule();
    
    if (response.status === 200) {
      setCurrentRunningSchedule(null);
      setCurrentlyOnZone(null);
    }
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
                stopRunning={stopCurrentRunningSchedule}
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
                stopRunning={stopCurrentRunningSchedule}
              />
            )}
          />
        </Switch>
      </div>
    </ThemeProvider>
    );
}

export default withRouter(App);
