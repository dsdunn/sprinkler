import React, { Component } from 'react';


class Day extends Component {
  constructor(props){
    super(props);
    this.state = {
      week: [],
      programs: []
    }
  }

  async componentDidMount() {
   
  }

  render() {

    return (
      <div className="Day">
        Monday
      </div>
    );
  }
}
export default Day;