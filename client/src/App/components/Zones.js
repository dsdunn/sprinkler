import React from 'react';

import { Button, ButtonGroup, Typography } from '@material-ui/core';

export const Zones = ({ zones = [], toggleZone }) => {
  const zoneButtons = () => {
    let layout = [];

    for (let i = 0; i < 6; i++) {
      layout.push(
        <Button 
          className="zone w-full"
          color={zones.includes(i) ? 'primary' : 'secondary'}
          variant="contained" 
          key={i} 
          onClick={() => toggleZone(i)}
        >
          <Typography color={'textPrimary'} >{ i + 1 } </Typography>
        </Button>
      )
    }
    return layout;
  }

  return (
    <div>
      <div className="zones-title">zones</div>
      <ButtonGroup className="zones flex-full">
        { zoneButtons() }
      </ButtonGroup>
    </div>
    )


}