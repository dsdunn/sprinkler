#SprinklerTime

###Control your watering system with a raspberry pi and your local wifi network. 

###Schedule features: Start-time, days of the week, zones (up to 6 currently), duration per zone, interval (time elapsed between complete cycles), and iterations (number of cycles through the zones).

This app is built with node.js, features a react front-end, and uses a postgres database. While designed to run on a raspberry pi and control solenoid valves through its gpio pins, SprinklerTime can run in demo mode on your local machine for development and testing. If no gpio hardware is detected, the app will automatically run in demo mode. 

*note: This application is designed to run on a local wireless network and be accessed by web browsers on computers/phones on the same network, not over the internet.*

To get started: 

1. Install [node](https://nodejs.org/en/download/) and [postgres](https://www.postgresql.org/download/):

2. Clone this repo!

In the command line: 

3. Run `cd sprinkler` to get into the directory.

4. Run `bash setup_database.sh` which runs a simple script to set up a 'sprinkler' table in your database, creates a user ('pi') with a password ('raspberry'), and grants necessary permissions.

5. Run `npm install && cd client && npm install && npm run build` to install necessary dependencies and bundle the react front-end.

On raspberry pi:



6. [Setup configuration to run at a static ip address](https://www.ionos.com/digitalguide/server/configuration/provide-raspberry-pi-with-a-static-ip-address/) 

  Out of the box, SprinklerTime is configured to run at `192.168.1.10`. If this is unavailable on your network and you have to use a different static ip, you must update the target address for the websocket to match in `/client/src/App/App.js` on line 16. Don't forget to add the port (xxx.xxx.x.xx:8080)!

7. [Make sure your gpio pins are working](https://www.raspberrypi.org/documentation/usage/gpio/).

8. Wire up your hardware. You must connect the gpio output pins to a relay which is powered seperately and will handle switching your solenoid valves on and off. (details coming)

In demo mode:

9. In `/client/src/App/App.js`, update the socket address to run at localhost:8080 but uncommenting line 15 (`const ws = new WebSocket('ws://localhost:8080');`), and commenting out line 16.

To start the app:

10. Run `node index.js` in the sprinkler directory. 
The application will be served at localhost:5000  or (by default) at `192.168.1.10:5000`

11. Once the app is running, you can go to localhost:5000 or whatever static ip you have set up and start making, saving, and running watering schedules.


## This App is up and running in at least one location on a raspberry pi in the real world. It remains a work in progress, and I welcome any questions or comments! Thanks for checking out SprinklerTime!



