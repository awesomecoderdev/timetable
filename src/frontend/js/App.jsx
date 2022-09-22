import { Fragment, useState } from 'react';
import Timetable from './components/Timetable';
import Time from './components/Time';
import Calendar from './components/Calendar';

// console.log("showTimeTable",showTimeTable);

function App() {

  const [isShowing, setIsShowing] = useState(false)

  return (
    <Fragment>
      {showTimeTable ? <Time /> : <Calendar />}
    </Fragment>
  );
}

export default App;