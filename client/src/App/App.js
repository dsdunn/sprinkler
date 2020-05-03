import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';

import ScheduleArchive from './components/ScheduleArchive';
import ScheduleEditor from './components/ScheduleEditor';
import Dashboard from './components/Dashboard';

import * as api from './api';

const App = (props) => {

  const [ currentRunningSchedule, setCurrentRunningSchedule ] = useState(null);
  const [ schedules, setSchedules ] = useState([]);
  const [ selectedSchedule, setSelectedSchedule ] = useState({});

  useEffect(() => {
    initSocket();

    const getSchedules = async () => {
      let schedules = await api.getSchedules();

      setSchedules(schedules);
    }

    getSchedules();
  },[])

  const initSocket = () => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('sockets bitch!')
      ws.send('socket party')
    }

    ws.onmessage = (payload) => {
      let { data } = payload;
      data = JSON.parse(data);
      console.log(data);

      if (data.schedule) {
        setCurrentRunningSchedule(data.schedule)
      }
    }
  }

  const createSchedule = async (schedule) => {
    let response = await api.createSchedule(schedule);

    setSchedules([...schedules, response.schedule]);
    setSelectedSchedule(response.schedule);

  }

  const putSchedule = async (schedule) => {
    let response = await api.putSchedule(schedule);

    setSchedules([...schedules.filter(oldSchedule => {
        return schedule.id !== oldSchedule.id;
      }),
      response.schedule
    ])
  }

  const saveSchedule = (schedule = {}) => {
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
      <Dashboard props={currentRunningSchedule, schedules}/>
      <Switch>
        <Route 
          exact path='/' 
          render={(props) => (
            <ScheduleArchive 
              {...props} 
              currentRunningSchedule={currentRunningSchedule}
              schedules={schedules}
              updateSelectedSchedule={updateSelectedSchedule}
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

      <div className="test">
        Testing
        <div>{ currentRunningSchedule ? currentRunningSchedule.schedule_name : '' }</div>
        <div onClick={createSchedule}>Create Schedule</div>
        <div onClick={deleteSchedule}>Delete Schedule</div>
      </div>
    </div>
  );
  
}

export default withRouter(App);
