import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { calculateEndTime } from '../utils/utils.js';

class ScheduleEditor extends Component {
  constructor(props){
    super(props);
    let { schedule_name, start_time, end_time, interval, iterations, duration_per_zone, zones } = this.props.selectedSchedule;

    this.state = {
      schedule_name,
      start_time,
      end_time,
      interval,
      iterations,
      duration_per_zone,
      zones: zones || []
    }

    this.handleChange = this.handleChange.bind(this)
  }

  createDays() {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((day, index) => {
      return (
          <label htmlFor={day} key={index}>
            <input name={day} type="checkbox"/>
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
            <input type="checkbox" name={`zone_${i + 1}`} checked={this.state.zones.includes(i)} />
            { `Zone ${i + 1}` }
          </label>
        )
    }
    return zones;
  }

  handleChange(event) {
    let { name, value } = event.target;
    let { start_time, interval, iterations, zones, duration_per_zone } = this.state;

    this.setState({
      end_time: calculateEndTime(start_time, interval, iterations, zones, duration_per_zone),
      [name]: value
    });
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
              <input name="schedule_name" value={this.state.schedule_name || 'New Schedule' }/>
            </label>
            <label htmlFor="start_time">
              Start Time:
              <input name="start_time" type="time" value={this.state.start_time || '06:00'}/>
            </label>
            <div>
              <p>
                {this.state.end_time}
              </p>
            </div>
            <label htmlFor="interval">
              Interval:
              <input name="interval" type="number" min="1" max="300" value={this.state.interval || 1 }/>
            </label>
            <label htmlFor="iterations">
              Iterations:
              <input name="iterations" type="number" min="1" max="20" value={this.state.iterations || 1 }/>
            </label>
          </form>
          <form className="schedule-form-days-of-week">
            {this.createDays()}
          </form>
          <form className="schedule-form-program">
            <h4>Pattern</h4>
            <label htmlFor="duration_per_zone">
              <input type="number" min="1" max="30" name="duration_per_zone" value={this.state.duration_per_zone || 1 } onChange={this.handleChange}/>
              minutes per zone
            </label>
            <fieldset>
            { this.createZones() }
            </fieldset>
          </form>
        </section>
      </div>
    );
  }
}
export default ScheduleEditor;