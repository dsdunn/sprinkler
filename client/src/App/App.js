import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';

import ScheduleArchive from './pages/ScheduleArchive';
import ScheduleEditor from './pages/ScheduleEditor';

import * as api from './api';

const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
  console.log('sockets bitch!')
  ws.send('socket party')
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentRunningSchedule: null,
      schedules: [],
      selectedSchedule: {}
    }
  }

  componentDidMount = async () => {
    let schedules = await api.getSchedules();

    this.setState({ schedules });
  }

  createSchedule = async (schedule) => {
    let response = await api.createSchedule(schedule);
    
    this.setState({
      schedules: [...this.state.schedules, response.schedule],
      selectedSchedule: response.schedule
    })

  }

  putSchedule = async (schedule) => {
    let response = await api.putSchedule(schedule);

    this.setState({
      schedules: [
      ...this.state.schedules.filter(oldSchedule => {
        return schedule.id !== oldSchedule.id;
      }), 
      response.schedule
      ]
    })
  }

  saveSchedule = (schedule = {}) => {
    if (schedule.id) {
      this.putSchedule(schedule);
    } else {
      this.createSchedule(schedule);
    }

  }

  deleteSchedule = async (id) => {
    if (!id) {
      return;
    }
    let response = await api.deleteSchedule(id);
    console.log(response)

    let schedules = this.state.schedules.filter(schedule => {
        return schedule.id !== id;
      });

    this.setState({
      schedules
    })
  }

  updateSelectedSchedule = (schedule) => {
    this.setState({
      selectedSchedule: schedule
    })
    this.props.history.push('/edit_schedule')
  }

  daysOfTheWeek() {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return days.map((day, index) => {

      return (
        <div className="header-day" key={index}>
          { day }
        </div>
        )
    })
  }


  render() {

    return (
      <div className="App">
        <header className="days-of-the-week">
          { this.daysOfTheWeek() }
        </header>

        <Switch>
          <Route 
            exact path='/' 
            render={(props) => (
              <ScheduleArchive 
                {...props} 
                state={this.state} 
                updateSelectedSchedule={this.updateSelectedSchedule}
              />
            )}
          />
          <Route 
            exact path='/edit_schedule' 
            render={(props) => (
              <ScheduleEditor 
                {...props} 
                schedules={this.state.schedules} 
                selectedSchedule={this.state.selectedSchedule} 
                saveSchedule={this.saveSchedule} 
                deleteSchedule={this.deleteSchedule}
              />
            )}
          />
        </Switch>

        <div className="test">
          Testing
          <div onClick={this.createSchedule}>Create Schedule</div>
          <div onClick={this.deleteSchedule}>Delete Schedule</div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
