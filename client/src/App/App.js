import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import Day from './pages/Day';

import * as api from './api';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      week: [],
      programs: []
    }
  }

  async componentDidMount() {
    let week = await api.getWeek()
    let programs = await api.getPrograms();

    this.setState({ week, programs });
  }

  daysOfTheWeek() {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return days.map((day) => {

      return (
        <div className="header-day">
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
          <Route exact path='/' component={Day}/>
        </Switch>

        <div onClick={api.createProgram}>Create Program</div>
        <div onClick={api.deleteProgram}>Delete Program</div>
        {/*<div onClick={api.createSession}>Create Session</div>
        <div onClick={api.deleteSession}>Delete Session</div>*/}
      </div>
    );
  }
}

export default App;
