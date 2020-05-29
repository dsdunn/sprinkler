import React from 'react';

import { Button, ButtonGroup, Typography } from '@material-ui/core';

export const DaysOfTheWeek = ({ schedule = null, updateSchedule = null, setFilter = null }) => {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const clickHandler = (event) => {
      console.log(event.target);
    }

    return (
      <ButtonGroup className="days-of-the-week">
      {
        days.map((day, index) => {

          return (
            <Button name={`day-button-${index}`} className="header-day" variant="contained" color={'secondary'} key={index} onClick={clickHandler}>
              <Typography color={'textPrimary'} >{ day } </Typography>
            </Button>
            )
        })
      }
      </ButtonGroup>
      )
}