import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';

import ScheduleArchive from './components/ScheduleArchive';
import ScheduleEditor from './components/ScheduleEditor';
import Dashboard from './components/Dashboard';

import * as api from './api';

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

    return days.map((day, index) => {

      return (
        <div className="header-day" key={index}>
          { day }
        </div>
        )
    })
  }

  return (
    <div className="App">
      <header className="days-of-the-week">
        { daysOfTheWeek() }
      </header>
      <Dashboard 
        currentRunningSchedule={currentRunningSchedule}
        currentlyOnZone={currentlyOnZone}
      />
      <Switch>
        <Route 
          exact path='/' 
          render={(props) => (
            <ScheduleArchive 
              {...props} 
              currentRunningSchedule={currentRunningSchedule}
              schedules={schedules}
              updateSelectedSchedule={updateSelectedSchedule}
              runSchedule={runSchedule}
            />
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
    </div>
  );
  
}

export default withRouter(App);
