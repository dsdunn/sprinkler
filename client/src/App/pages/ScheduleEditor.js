import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ScheduleEditor extends Component {
  constructor(props){
    super(props);
    this.state = { ...this.props }
  }

  async componentDidMount() {
   
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
            <input type="checkbox" name={`zone_${i + 1}`} />
            { `Zone ${i + 1}` }
          </label>
        )
    }
    return zones;
  }

  render() {

    return (
      <div className="schedule-editor">
        <h2>Schedule Editor - ScheduleName</h2>
        <Link to="/">
          <button>back to schedules</button>
        </Link>
        <section className="schedule-editor-main">
          <form className="schedule-form-main">
            <label htmlFor="schedule_name">
              Schedule Name:
              <input name="schedule_name"/>
            </label>
            <label htmlFor="start_time">
              Start Time:
              <input name="start_time" type="time"/>
            </label>
            <div>
              <p>
                calculated_end_time
              </p>
            </div>
            <label htmlFor="interval">
              Interval:
              <input name="interval" type="number" min="1" max="300"/>
            </label>
            <label htmlFor="iterations">
              Iterations:
              <input name="iterations" type="number" min="1" max="50"/>
            </label>
          </form>
          <form className="schedule-form-days-of-week">
            {this.createDays()}
          </form>
          <form className="schedule-form-program">
            <h4>Pattern</h4>
            <label htmlFor="duration_per_zone">
              <input type="number" min="1" max="30" name="duration_per_zone"/>
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