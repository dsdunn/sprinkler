import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';

import ScheduleArchive from './pages/ScheduleArchive';
import ScheduleEditor from './pages/ScheduleEditor';

import * as api from './api';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      week: [],
      schedules: [],
      selectedSchedule: {},
      selectedDays: []
    }
  }

  componentDidMount = async () => {
    let week = await api.getWeek()
    let schedules = await api.getSchedules();

    this.setState({ week, schedules });
  }

  createSchedule = async () => {
    let response = await api.createSchedule(
      'test schedule 2',
      "06:00:00",
      "06:45:00",
      14,
      30,
      1
      )
    
    this.setState({
      schedules: [...this.state.schedules, response.schedule]
    })
  }

  async deleteSchedule(id) {
    // let response = await api.deleteSchedule(8)
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

  updateSelectedSchedule = (schedule) => {
    this.setState({
      selectedSchedule: schedule
    })
    this.props.history.push('/edit_schedule')
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
            render={(props) => (<ScheduleEditor {...props} schedules={this.state.schedules} selectedSchedule={this.state.selectedSchedule}/>)}
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
