import React, { useState } from 'react';
import {
    add,
    eachDayOfInterval,
    eachMonthOfInterval,
    endOfMonth,
    endOfYear,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
  } from 'date-fns';
import Calendar from './Calendar';

const Main = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentFewMonth, setCurrentFewMonth] = useState(format(today, 'MMM-yyyy'))
    // const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    const months = eachMonthOfInterval({
        start: parse(currentFewMonth, 'MMM-yyyy', new Date()),
        end: add(parse(currentFewMonth, 'MMM-yyyy', new Date()), { months: 4 }),
    })

    console.log('====================================');
    console.log(months);
    console.log('====================================');

    return (
        <>
            <Calendar />
            {/* <div className="calendar_container">
                {months.map((month, index) => (
                    <div key={index} className="calendar_list_item">
                        <Calendar
                            month={index}
                            setCurrentFewMonth = {setCurrentFewMonth}
                            currentFewMonth= {currentFewMonth}
                            startMonth={month}
                         />
                    </div>
                ))}
              <div className="calendar_list_item">
                <div className="p_relative">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempore, necessitatibus ab a illum, excepturi magni voluptatum ex alias, soluta voluptates libero minus natus dignissimos vitae! Odio asperiores dolorum maxime?</p>
                </div>
              </div>
            </div> */}
        </>
    );
}

export default Main;
