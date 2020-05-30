import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

export const sprinklerTheme = createMuiTheme({
  palette: {
    type: 'dark',

    primary: {
      main: '#2978A0',
    },
    secondary: {
      main: '#315659',
    },
    info: {
      main: '#B4534D',
    },
    text: {
      primary: '#BCAB79',
    },
    warning: {
      main: '#BCAB79',
    }
  },
});

export const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    minHeight: '110vh',
    backgroundColor: '#253031',
    color: '#BCAB79',

    '& .days-of-the-week': {
      display: 'flex',
      height: '10vh',
      width: '100vw',

      '& .header-day': {
        flexGrow: 1,
        height: '100%',
      }
    },
    '& .schedule-archive': {
      overflow: 'scroll',
    },
    '& .schedule-container': {
      padding: '20vh 12px',
    },
    '& .top': {
      position: 'fixed',
      zIndex: '20',
      backgroundColor: '#253031'
    },
    '& a': {
      textDecoration: 'none'
    },
    '& .button-container': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    '& .control-button': {
      width: '90px',
      margin: '1em 0',
    },
  },
});