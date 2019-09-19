import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { calculateEndTime, createDays, create } from '../utils.js';

class ScheduleEditor extends Component {
  constructor(props){
    super(props);
    let { id, schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones, days } = this.props.selectedSchedule;

    this.state = {
      id,
      schedule_name: schedule_name,
      start_time: start_time || '06:00',
      end_time: end_time || '06:00',
      interval: interval || 1,
      iterations: iterations || 1,
      duration_per_zone: duration_per_zone || 5,
      zones: zones || [],
      days: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.saveSchedule = this.saveSchedule.bind(this);
    this.validateTime = this.validateTime.bind(this);
  }

  createDays() {
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days.map((day, index) => {
      return (
          <label htmlFor={day} key={index}>
            <input name={ `day_${index}` } type="checkbox" onChange={this.handleChange}/>
            <div>{day}</div>
          </label>
        )
    })
  }

  createZones() {
    let zones = [];

    for (let i = 0; i < 6; i++) {
      zones.push(
          <label htmlFor={`zone_${i + 1}`} key={i}>
            <input type="checkbox" name={`zone_${i + 1}`} checked={this.state.zones.includes(i)} onChange={this.handleChange} />
            { `Zone ${i + 1}` }
          </label>
        )
    }
    return zones;
  }


  saveSchedule(event) {
    event.preventDefault();
    if (!this.validateTime(this.state.end_time)) {
      alert('you suck. invalid end time' + this.state.end_time)
      return;
    }
    this.props.saveSchedule(this.state);
    this.props.history.goBack();
  }

  deleteSchedule(event) {
    event.preventDefault();
    this.props.deleteSchedule(this.state.id);
    this.props.history.goBack();
  }

  handleChange(event) {
    let { name, value } = event.target;

    if (name.includes('day_')) {
      this.toggleDay(name);
    } 
    else if (name.includes('zone_')) {
      this.toggleZone(name);
    } 
    this.setState({
      [name]: value
    });
    this.setEndTime({ [name]: value });
  }

  setEndTime(change) {
    this.setState({
      end_time: calculateEndTime({ ...this.state, ...change }),
      })
  }

  toggleDay(day) {
    let days = this.state.days;
    let dayIndex = parseInt(day.slice(4));

    if (days.includes(dayIndex)) {
      days = days.filter(day => day !== dayIndex);
    } else {
      days.push(dayIndex)
    }
    this.setState({
      days
    })
  }

  toggleZone(zone) {
    let zones = this.state.zones;
    let zoneIndex = parseInt(zone.slice(5)) - 1;

    if (zones.includes(zoneIndex)) {
      zones = zones.filter(zone => zone !== zoneIndex);
    } else {
      zones.push(zoneIndex)
    }
    this.setState({
      zones
    })
  }

  validateTime(endtime) {
    return (this.state.end_time && !this.state.end_time.includes('NaN'));
  }

  render() {

    return (
      <div className="schedule-editor">
        <h2>Schedule Editor - { this.state.schedule_name || 'New Schedule'}</h2>
        <Link to="/">
          <button>back to schedules</button>
        </Link>
        <section className="schedule-editor-main">
          <form className="schedule-form-main">
            <label htmlFor="schedule_name">
              Schedule Name:
              <input name="schedule_name" value={this.state.schedule_name || '' } onChange={this.handleChange}/>
            </label>
            <label htmlFor="start_time">
              Start Time:
              <input name="start_time" type="time" value={this.state.start_time} onChange={this.handleChange}/>
            </label>
            <div>
              <p>
                end time: { this.state.end_time }
              </p>
            </div>
            <label htmlFor="interval">
              Interval:
              <input name="interval" type="number" min="0" max="300" value={this.state.interval} onChange={this.handleChange}/>
            </label>
            <label htmlFor="iterations">
              Iterations:
              <input name="iterations" type="number" min="1" max="20" value={this.state.iterations} onChange={this.handleChange}/>
            </label>
          </form>
          <form className="schedule-form-days-of-week">
            {this.createDays()}
          </form>
          <form className="schedule-form-program">
            <h4>Pattern</h4>
            <label htmlFor="duration_per_zone">
              <input type="number" min="1" max="30" name="duration_per_zone" value={this.state.duration_per_zone} onChange={this.handleChange}/>
              minutes per zone
            </label>
            <fieldset>
            { this.createZones() }
            </fieldset>
            <button onClick={this.saveSchedule}>Save Schedule</button>
            <button onClick={this.deleteSchedule}>Delete</button>
          </form>
        </section>
      </div>
    );
  }
}
export default ScheduleEditor;