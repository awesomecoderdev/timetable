import React, { Component, Fragment, useState, useEffect } from "react";
import { Menu, Transition, Tab, Popover } from "@headlessui/react";
// import { DotsVerticalIcon, PlusCircleIcon } from "@heroicons/react/outline";
// import {
//   ChevronDownIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   DocumentDuplicateIcon,
// } from "@heroicons/react/solid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/20/solid";

import {
  add,
  startOfDay,
  endOfDay,
  getHours,
  isSameHour,
  eachDayOfInterval,
  eachHourOfInterval,
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
  startOfMonth,
} from "date-fns";
import axios from "axios";
import { scheduleJson } from "./Data";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const colStartClasses = [
  "",
  "start-2",
  "start-3",
  "start-4",
  "start-5",
  "start-6",
  "start-7",
];

const Time = () => {
  const startFromNow = startFrom
    ? parse(startFrom, "d-M-yyyy", new Date())
    : startOfToday();
  const [today, setToday] = useState(
    startFromNow > startOfToday() ? startFromNow : startOfToday()
  );
  const tday = startOfToday();
  const [selectedHour, setSelectedHour] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(today);
  const [startCalendar, setStartCalendar] = useState(today);
  const firstCurrentHour = parse(currentHour, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(startCalendar)),
    end: endOfWeek(endOfMonth(startCalendar)),
  });

  const currentWeek = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });

  // process got to prev day ->done
  const previousDay = () => {
    const goToPrivDay = add(currentDay, { days: -1 });
    setCurrentDay(goToPrivDay);
  };
  // process got to next day ->done
  const nextDay = () => {
    const goToNextDay = add(currentDay, { days: 1 });
    setCurrentDay(goToNextDay);
  };

  function setSchedule(schedule) {
    if (selectedSchedule.includes(schedule)) {
      selectedSchedule.splice(selectedSchedule.indexOf(schedule), 1); //deleting
      setSelectedSchedule(selectedSchedule);
    } else {
      selectedSchedule.push(schedule);
      setSelectedSchedule(selectedSchedule);
    }
  }

  useEffect(() => {
    // console.log("====================================");
    // console.log("selectedSchedule", selectedSchedule);
    // console.log("====================================");
  }, [selectedSchedule, setSchedule]);

  const processSubmit = () => {
    console.log("====================================");
    console.log(selectedSchedule);
    console.log("====================================");
  };

  const timeTables = [
    // {
    //   title: "Bereitschaftszeit A-Dienst",
    //   group: "a",
    // },
    // {
    //   title: "Bereitschaftszeit B-Dienst",
    //   group: "b",
    // },
    // {
    //   title: "Bereitschaftszeit H-Dienst",
    //   group: "h",
    // },
    {
      title: "A-Dienst",
      group: "a",
    },
    {
      title: "B-Dienst",
      group: "b",
    },
    {
      title: "H-Dienst",
      group: "h",
    },
  ];

  const tabs = [
    {
      id: "menu",
      title: "Menu",
      component: "Menu",
    },
    {
      id: "urlaub",
      title: "Urlaub/Auszeit",
      component: "Urlaub/Auszeit",
    },
    {
      id: "pinnwand",
      title: "Pinnwand",
      component: "Pinnwand",
    },
  ];

  const processNeinAction = () => {
    alert("cancled");
  };

  const processJaAction = () => {
    alert("Submited");
  };

  function previousMonth() {
    console.log("previousMonth");
    const firstDayNextMonth = add(startCalendar, { months: -1 });
    setStartCalendar(firstDayNextMonth);
  }
  function nextMonth() {
    const firstDayNextMonth = add(startCalendar, { months: 1 });
    setStartCalendar(firstDayNextMonth);
  }

  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [selectedH, setSelectedH] = useState(null);

  const [selectedAEnd, setSelectedAEnd] = useState(null);
  const [selectedBEnd, setSelectedBEnd] = useState(null);
  const [selectedHEnd, setSelectedHEnd] = useState(null);

  const [selectedAMultiSelect, setSelectedAMultiSelect] = useState([]);
  const [selectedBMultiSelect, setSelectedBMultiSelect] = useState([]);
  const [selectedHMultiSelect, setSelectedHMultiSelect] = useState([]);

  const setMultiSelect = (e, hr, group) => {
    const hourbtn = e.target;
    const scheduleKey = `${group}-${format(hr, "MM-dd-yyyy")}-${getHours(hr)}`;
    // console.log(scheduleKey);
    // setSelectedHour(scheduleKey);
    // setSchedule(scheduleKey);

    if (group == "a") {
      if (selectedA == null) {
        if (hourbtn.classList.contains("a_selected")) {
          setSelectedA(null);
          hourbtn.classList.remove("a_selected");
        } else {
          hourbtn.classList.add("a_selected");
          setSelectedA(hr);
        }
        console.log("selected selected A", selectedA);
      } else if (isSameHour(selectedA, hr)) {
        if (hourbtn.classList.contains("a_selected")) {
          setSelectedA(null);
          hourbtn.classList.remove("a_selected");
        } else {
          hourbtn.classList.add("a_selected");
          setSelectedA(hr);
        }
        document.querySelectorAll(".a_selected").forEach((e) => {
          if (e.classList.contains("a_selected")) {
            e.classList.remove("a_selected");
          }
        });
      } else {
        document.querySelectorAll(".a_selected").forEach((e) => {
          if (e.classList.contains("a_selected")) {
            e.classList.remove("a_selected");
          }
        });
        const hours =
          selectedA < hr
            ? eachHourOfInterval({ start: selectedA, end: hr })
            : eachHourOfInterval({ start: hr, end: selectedA });
        setSelectedAEnd(selectedA < hr ? hr : selectedA);
        console.log("hours", hours);

        const selected = [];
        hours.map((hour, hrIndex) => {
          const schedule_key = `${group}-${format(
            hour,
            "MM-dd-yyyy"
          )}-${getHours(hour)}`;
          const selectedScheduleKey = `${group}-${format(
            selectedA,
            "MM-dd-yyyy"
          )}-${getHours(selectedA)}`;
          selected.push(schedule_key);
          if (document.getElementById(schedule_key)) {
            document.getElementById(schedule_key).classList.add("a_selected");
          }
        });
        setSelectedAMultiSelect(selected);
      }
    } else if (group == "b") {
      if (selectedB == null) {
        if (hourbtn.classList.contains("b_selected")) {
          setSelectedB(null);
          hourbtn.classList.remove("b_selected");
        } else {
          hourbtn.classList.add("b_selected");
          setSelectedB(hr);
        }
        console.log("selected selected B", selectedB);
      } else if (isSameHour(selectedB, hr)) {
        if (hourbtn.classList.contains("b_selected")) {
          setSelectedB(null);
          hourbtn.classList.remove("b_selected");
        } else {
          hourbtn.classList.add("b_selected");
          setSelectedB(hr);
        }
        document.querySelectorAll(".b_selected").forEach((e) => {
          if (e.classList.contains("b_selected")) {
            e.classList.remove("b_selected");
          }
        });
      } else {
        document.querySelectorAll(".b_selected").forEach((e) => {
          if (e.classList.contains("b_selected")) {
            e.classList.remove("b_selected");
          }
        });
        const hours =
          selectedB < hr
            ? eachHourOfInterval({ start: selectedB, end: hr })
            : eachHourOfInterval({ start: hr, end: selectedB });
        setSelectedBEnd(selectedB < hr ? hr : selectedB);

        console.log("hours", hours);

        const selected = [];
        hours.map((hour, hrIndex) => {
          const schedule_key = `${group}-${format(
            hour,
            "MM-dd-yyyy"
          )}-${getHours(hour)}`;
          const selectedScheduleKey = `${group}-${format(
            selectedB,
            "MM-dd-yyyy"
          )}-${getHours(selectedB)}`;
          selected.push(schedule_key);
          if (document.getElementById(schedule_key)) {
            document.getElementById(schedule_key).classList.add("b_selected");
          }
        });
        setSelectedBMultiSelect(selected);
      }
    } else if (group == "h") {
      if (selectedH == null) {
        if (hourbtn.classList.contains("h_selected")) {
          setSelectedH(null);
          hourbtn.classList.remove("h_selected");
        } else {
          hourbtn.classList.add("h_selected");
          setSelectedH(hr);
        }
        console.log("selected selectedH", selectedH);
      } else if (isSameHour(selectedH, hr)) {
        if (hourbtn.classList.contains("h_selected")) {
          setSelectedH(null);
          hourbtn.classList.remove("h_selected");
        } else {
          hourbtn.classList.add("h_selected");
          setSelectedH(hr);
        }
        document.querySelectorAll(".h_selected").forEach((e) => {
          if (e.classList.contains("h_selected")) {
            e.classList.remove("h_selected");
          }
        });
      } else {
        document.querySelectorAll(".h_selected").forEach((e) => {
          if (e.classList.contains("h_selected")) {
            e.classList.remove("h_selected");
          }
        });
        const hours =
          selectedH < hr
            ? eachHourOfInterval({ start: selectedH, end: hr })
            : eachHourOfInterval({ start: hr, end: selectedH });
        setSelectedHEnd(selectedH < hr ? hr : selectedH);
        console.log("hours", hours);

        const selected = [];
        hours.map((hour, hrIndex) => {
          const schedule_key = `${group}-${format(
            hour,
            "MM-dd-yyyy"
          )}-${getHours(hour)}`;
          const selectedScheduleKey = `${group}-${format(
            selectedH,
            "MM-dd-yyyy"
          )}-${getHours(selectedH)}`;
          selected.push(schedule_key);
          if (document.getElementById(schedule_key)) {
            document.getElementById(schedule_key).classList.add("h_selected");
          }
        });
        setSelectedHMultiSelect(selected);
      }
    }

    // if(group =="a"){
    //   if(selectedA == null){
    //     setSelectedA(hr)
    //     console.log("selected selected A",selectedA);
    //   }else{
    //     const hours = eachHourOfInterval({
    //       start: selectedA,
    //       end: hr,
    //     });
    //     console.log("hours",hours);

    //     hours.map((hour, hrIndex) => {
    //       const schedule_key = `${group}-${format(hour,"MM-dd-yyyy")}-${getHours(hour)}`;
    //       const selectedScheduleKey = `${group}-${format(selectedA,"MM-dd-yyyy")}-${getHours(selectedA)}`;
    //       if(scheduleKey != selectedScheduleKey){
    //         setSelectedHour(schedule_key);
    //         setSchedule(schedule_key);
    //       }
    //     });

    //     setSchedule(scheduleKey);

    //     console.log("selected A",selectedA);
    //   }
    // }else if(group =="b"){
    //   setSelectedB(hr)
    //   console.log("setSelectedB ",selectedB);
    // }else if(group =="h"){
    //   setSelectedH(hr)
    //   console.log("setSelectedH ",selectedH);
    // }
    // console.log('====================================');
    // console.log(`${hour} ${group}`);
    // console.log('====================================');
  };

  return (
    <Fragment>
      <div className="container">
        <div className="week_container">
          <Popover className="pos_relative">
            {({ open }) => (
              <>
                <button className={`active week_item`} type="button">
                  Week {format(today, "I")}
                </button>
                <Popover.Button
                  // onClick={processSubmit}
                  className={`week_item`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    color="currentColor"
                  >
                    <path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path>
                  </svg>
                </Popover.Button>
                <Popover.Panel className="popup_calendar">
                  <div className="calendar_popup_item">
                    <div className="popup_calendar_card">
                      <div className="calendar_inner">
                        <div className="calendar_relative">
                          <div className="calendar_header">
                            <button
                              type="button"
                              onClick={previousMonth}
                              className="calendar_next_prev_btn"
                            >
                              <ChevronLeftIcon
                                className="next_prev_icon"
                                aria-hidden="true"
                              />
                            </button>

                            <span className="calendar_h2 tac">
                              {format(startCalendar, "MMMM yyyy")}
                            </span>
                            <button
                              onClick={nextMonth}
                              type="button"
                              className="calendar_next_prev_btn"
                            >
                              <ChevronRightIcon
                                className="next_prev_icon"
                                aria-hidden="true"
                              />
                            </button>
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
                                  "padding_y"
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    console.log(
                                      "===================================="
                                    );
                                    console.log(day);
                                    console.log(
                                      "===================================="
                                    );
                                    setToday(day);
                                  }}
                                  className={classNames(
                                    "calender_default_btn", // default class
                                    isEqual(day, today) && "current_date_btn", // set current date color
                                    tday > day && "previous_next_month_btn", // disable previous date to select
                                    !isSameMonth(day, today) &&
                                      !(tday > day) &&
                                      "not_same_month" // set different month date color
                                  )}
                                >
                                  <time dateTime={format(day, "yyyy-MM-dd")}>
                                    {format(day, "d")}
                                  </time>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>
        </div>
      </div>

      <div className="hours_wraper">
        {currentWeek.map((day, indexOfDay) => {
          const hours = eachHourOfInterval({
            start: startOfDay(day),
            end: endOfDay(day),
          });

          return (
            <div key={indexOfDay} className="hour_group">
              <div className="get_current_date">
                {format(day, "d.MM.yyyy")}
              </div>
              <div className="hr_container">
                {hours.map((hour,i) => {
                  console.log('====================================');
                  console.log(hour);
                  console.log('====================================');


                  return(
                    <>
                      {timeTables.map((table, tableIndex) => {
                        return(
                          <button
                            className="hr_time_btn"
                            onClick={(e) => {}}
                          >
                            <time dateTime={hour} className="hr_time">
                              {getHours(hour) < 10
                                ? "0" + getHours(hour) + ":00"
                                : getHours(hour) + ":00"}
                                {table.group}
                            </time>
                          </button>
                        )
                      })}
                    </>
                  )
                })}

{/*
                {timeTables.map((table, tableIndex) => {
                  const scheduleFromDatabase = scheduleJson[table.group];
                  console.log('====================================');
                  console.log(table);
                  console.log('====================================');

                  return(
                    <>
                      {hours.map((hour,i) => {
                        console.log('====================================');
                        console.log(hour);
                        console.log('====================================');
                        return(
                          <button
                            className="hr_time_btn"
                            onClick={(e) => {}}
                          >
                            <time dateTime={hour} className="hr_time">
                              {getHours(hour) < 10
                                ? "0" + getHours(hour) + ":00"
                                : getHours(hour) + ":00"}
                                {table.group}
                            </time>
                          </button>
                        )
                      })}
                    </>
                  )





                })} */}
              </div>
            </div>
          );
        })}

        {/* start the tab */}
        {/* <div className="hour_group">
          <div className="hr_tab_item">
            <div className={"hr_tabs"}>
              <Tab.Group>
                <Tab.List className="hr_tab_header">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      className={({ selected }) =>
                        classNames(
                          "hr_tab_btn",
                          selected ? "selected" : "normal"
                        )
                      }
                    >
                      {tab.title}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="hr_tab_body">
                  {tabs.map((tab, idx) => (
                    <Tab.Panel key={idx}>{tab.component}</Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div> */}
      </div>
    </Fragment>
  );
};
export default Time;
