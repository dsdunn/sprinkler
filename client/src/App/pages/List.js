import React, { Component } from 'react';
import * as api from '../api';

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      week: [],
      programs: []
    }
  }

  // Fetch the list on first mount
  async componentDidMount() {
    let week = await api.getWeek()
    let programs = await api.getPrograms();

    this.setState({ week, programs });
  }

  render() {

    return (
      <div className="App">
        <div onClick={api.createProgram}>Create Program</div>
        <div onClick={api.deleteProgram}>Delete Program</div>
        <div onClick={api.createSession}>Create Session</div>
        <div onClick={api.deleteSession}>Delete Session</div>
      </div>
    );
  }
}

export default List;