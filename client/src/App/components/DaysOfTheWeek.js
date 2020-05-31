import React from 'react';

import { Button, ButtonGroup, Typography } from '@material-ui/core';

export const DaysOfTheWeek = ({ days = [], toggleDay, setFilter = null }) => {
    let dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let dayButtons = () => {
      return dayNames.map((day, index) => {
        return (
          <Button 
            name={`day-button-${index}`} 
            className="header-day" 
            color={days.includes(index) ? 'primary' : 'secondary'}
            variant="contained" 
            key={index} 
            onClick={() => toggleDay(index)}
          >
            <Typography color={'textPrimary'} >{ day } </Typography>
          </Button>
          )
      })
    }

    console.log(days);

    return (
      <ButtonGroup className="days-of-the-week">
      { dayButtons() }
      </ButtonGroup>
      )
}