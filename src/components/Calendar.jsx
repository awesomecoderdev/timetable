import React, { Component, Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
    startOfWeek,
    endOfWeek,
    eachMonthOfInterval,
  } from 'date-fns';
import axios from "axios";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const colStartClasses = [
    '',
    'start-2',
    'start-3',
    'start-4',
    'start-5',
    'start-6',
    'start-7',
];

const Calendar = () => {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] =  useState( format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    function previousMonth() {
      const firstDayNextMonth = add(firstDayCurrentMonth, { months: -5 })
      setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }
    function nextMonth() {
      const firstDayNextMonth = add(firstDayCurrentMonth, { months: 5 })
      setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const months = eachMonthOfInterval({
      start: parse(currentMonth, 'MMM-yyyy', new Date()),
      end: add(parse(currentMonth, 'MMM-yyyy', new Date()), { months: 4 }),
    })

    return (
      <>
        <div className="calendar_container">
        {months.map((month, monthIndex) => {
          const days = eachDayOfInterval({
            start: startOfWeek(month),
            end: endOfWeek(endOfMonth(month)),
          })
          return(
            <div key={monthIndex}  className="calendar_list_item">
              <div className="calendar_card" >
                <div className="calendar_inner">
                    <div className="calendar_relative">
                        <div className="calendar_header">
                          {
                            monthIndex == 0 && (
                              <button
                              type="button"
                              onClick={previousMonth}
                              className="calendar_next_prev_btn"
                            >
                              <ChevronLeftIcon className="next_prev_icon" aria-hidden="true" />
                            </button>
                            )
                          }

                          <span className="calendar_h2">
                            {format(month, 'MMMM yyyy')}
                          </span>

                          {
                            monthIndex == 4 && (
                              <button
                                onClick={nextMonth}
                                type="button"
                                className="calendar_next_prev_btn"
                              >
                                <ChevronRightIcon className="next_prev_icon" aria-hidden="true" />
                              </button>
                             )
                          }
                        </div>

                        <div className="calendar_week_names">
                          <div>S</div>
                          <div>M</div>
                          <div>T</div>
                          <div>W</div>
                          <div>T</div>
                          <div>F</div>
                          <div>S</div>
                        </div>
                        <div className="calendar_date_list">
                          {days.map((day, dayIdx) => (
                            <div
                              key={day.toString()}
                              className={classNames(
                                dayIdx === 0 && colStartClasses[getDay(day)],
                                'padding_y'
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const dy = format(day, 'd-MM-yyyy');
                                  const redirect = `${window.location.origin}${window.location.pathname}?start=${dy}`;
                                  window.location = redirect;
                                }}
                                className={classNames(
                                  "calender_default_btn", // default class
                                  isEqual(day, today) && isToday(day) && 'current_date_btn', // set current date color
                                  (today > day) && 'previous_next_month_btn', // disable previous date to select
                                  !isSameMonth(day, month) && !(today > day) && 'not_same_month', // set different month date color
                                 )}
                              >
                                <time dateTime={format(day, 'yyyy-MM-dd')}>
                                  {format(day, 'd')}
                                </time>
                              </button>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )

        })}
        <div className="calendar_list_item">
              <div className="p_relative">
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempore, necessitatibus ab a illum, excepturi magni voluptatum ex alias, soluta voluptates libero minus natus dignissimos vitae! Odio asperiores dolorum maxime?</p>
              </div>
            </div>
        </div>
      </>
    );
}

export default Calendar;