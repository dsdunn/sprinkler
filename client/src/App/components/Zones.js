import React from 'react';

import { Button, ButtonGroup, Typography } from '@material-ui/core';

export const Zones = ({ zones = [], dispatch = null }) => {
  const zoneButtons = () => {
    let layout = [];

    for (let i = 0; i < 6; i++) {
      layout.push(
        <Button className="header-day" variant="contained" color={'secondary'} key={i} selected={zones.includes(i) } >
          <Typography color={'textPrimary'} >{ i + 1 } </Typography>
        </Button>
      )
    }
    return layout;
  }

  return (
    <ButtonGroup className="daysOfTheWeek">
      { zoneButtons }
    </ButtonGroup>
    )


}