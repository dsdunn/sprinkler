import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '1em auto'
  }
});

export const ScheduleCard = ({ schedule, editSchedule, runSchedule }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
        <div className="schedule-card">
          { schedule.schedule_name }
          <div>id: { schedule.id }</div>
        </div>
        <div onClick={() => editSchedule(schedule) }>Edit</div>
        <div onClick={() => runSchedule(schedule) }>Run this now</div>
    </Card>
  );
}
