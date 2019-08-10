import React, { Component } from 'react';

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
    this.getDays();
    this.getPrograms();
    this.createProgram();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch('/api/v1/getList')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }

  getDays = async () => {
    let response = await fetch('/api/v1/get_days');
    let result = await response.json();
    console.log(result)
  }  

  getPrograms = async () => {
    let response = await fetch('/api/v1/get_programs');
    let result = await response.json();
    console.log(result)
  }

  createProgram = async () => {
    let response = await fetch('/api/v1/create_program', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        program_name: 'weeknight',
        start_time: '220000',
        end_time: '224500',
        zones: [1,4,5],
        duration_per_zone: 15
      })
    })
  }


  render() {
    const { list } = this.state;

    return (
      <div className="App">
        <h1>List of Items</h1>
        {/* Check to see if any items are found*/}
        {list.length ? (
          <div>
            {/* Render the list of items */}
            {list.map((item, index) => {
              return(
                <div key={ index.toString() }>
                  {item}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>No List Items Found</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default List;