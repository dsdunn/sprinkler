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
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch('/api/v1/getList')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }

  getDays = async () => {
    let response = await fetch('api/v1/getDays');
    let result = await response.json();
    console.log(result)
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