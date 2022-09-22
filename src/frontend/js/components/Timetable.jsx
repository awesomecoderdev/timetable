import React, { Fragment, useState } from 'react';
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
    endOfWeek,
    isToday,
    parse,
    parseISO,
    startOfToday,
    startOfWeek,
    eachHourOfInterval,
    startOfDay,
    endOfDay,
    getHours,
    getDate,
  } from 'date-fns';

const Timetable = () => {
    const today = startOfToday();
    const hours = eachHourOfInterval({
        start: startOfDay(today),
        end: endOfDay(today),
    })
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] =  useState(format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    const days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(firstDayCurrentMonth),
    })

    console.log("days",days);
    console.log("currentMonth",currentMonth);

    return (
        <>
            <div className="font-poppins relative flex border-y border-slate-600 max-w-xl">
              <div className="w-12 overflow-hidden">
                {/* <button className={`relative flex justify-center items-center bg-white border border-slate-600 w-full py-0.5 px-1`}>
                    <ChevronLeftIcon className="h-6" />
                </button> */}
                {hours.map((hour, index) =>{
                        const hr = getHours(hour) <10 ? "0"+getHours(hour) : getHours(hour);
                        return(
                            <button key={hour} className={` ${index % 2 ? "bg-white" : "bg-gray-200"} border border-slate-600 w-full py-0.5 px-1`}>
                                <time className='text-xs font-medium'>{`${hr}:00`}</time>
                            </button>
                        )
                    }
                )}
              </div>
              <div className="w-full relative h-auto">
                <div className="relative h-full grid grid-cols-7">
                    {days.map((day, index) =>{
                            return(
                                <div key={day} className={` ${index % 2 ? "bg-white" : "bg-gray-200"} h-full `}>
                                    <div className="relative">
                                        <button className={` ${index % 2 ? "bg-white" : "bg-gray-200"} border border-slate-600 w-full py-0.5 px-1`}>
                                            <time className=''>{ format(day, 'd') }{  format(day, '.MM')}</time>
                                        </button>
                                        <div className="relative grid grid-cols-3 h-7">
                                            <time className=''>A</time>
                                            <time className=''>B</time>
                                            <time className=''>H</time>
                                        </div>
                                    </div>
                                    <div className="relative grid grid-cols-3">
                                            <div className="relative">
                                                {hours.map((hour, index) =>{
                                                        const hr = getHours(hour) <10 ? "0"+getHours(hour) : getHours(hour);
                                                        return(
                                                            <button key={`a${hour}`} className={` bg-red-500 border border-slate-600 w-full py-0.5 px-1`}>
                                                                <time className='text-red-500 text-xs'>{hr}</time>
                                                            </button>
                                                        )
                                                    }
                                                )}
                                            </div>
                                            <div className="relative">
                                                {hours.map((hour, index) =>{
                                                        const hr = getHours(hour) <10 ? "0"+getHours(hour) : getHours(hour);
                                                        return(
                                                            <button key={`b${hour}`} className={` bg-red-500 border border-slate-600 w-full py-0.5 px-1`}>
                                                                <time className='text-red-500 text-xs'>{hr}</time>
                                                            </button>
                                                        )
                                                    }
                                                )}
                                            </div>
                                            <div className="relative">
                                                {hours.map((hour, index) =>{
                                                        const hr = getHours(hour) <10 ? "0"+getHours(hour) : getHours(hour);
                                                        return(
                                                            <button key={`h${hour}`} className={` bg-red-500 border border-slate-600 w-full py-0.5 px-1`}>
                                                                <time className='text-red-500 text-xs'>{hr}</time>
                                                            </button>
                                                        )
                                                    }
                                                )}
                                            </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
              </div>
              <div className="w-12 overflow-hidden">
                {/* <button className={`relative flex justify-center items-center bg-white border border-slate-600 w-full py-0.5 px-1`}>
                    <ChevronRightIcon className="h-6" />
                </button> */}
                {hours.map((hour, index) =>{
                        const hr = getHours(hour) <10 ? "0"+getHours(hour) : getHours(hour);
                        return(
                            <button key={hour} className={` ${index % 2 ? "bg-white" : "bg-gray-200"} border border-slate-600 w-full py-0.5 px-1`}>
                                <time className='text-xs font-medium'>{`${hr}:00`}</time>
                            </button>
                        )
                    }
                )}
              </div>
            </div>
        </>
    );
}

export default Timetable;
