import React, { Component, Fragment, useState, useEffect } from "react";
import { Menu, Transition, Tab, Popover } from "@headlessui/react";
// import { DotsVerticalIcon, PlusCircleIcon } from "@heroicons/react/outline";
// import {
//   ChevronDownIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   DocumentDuplicateIcon,
// } from "@heroicons/react/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

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
  const today = startFromNow > startOfToday() ? startFromNow : startOfToday();
  const [selectedHour, setSelectedHour] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(today);
  const [startCalendar, setStartCalendar] = useState(today);
  const firstCurrentHour = parse(currentHour, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(startCalendar)),
    end: endOfWeek(endOfMonth(startCalendar)),
  })

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
    console.log("====================================");
    console.log("selectedSchedule", selectedSchedule);
    console.log("====================================");
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
    const firstDayNextMonth = add(startCalendar, { months: -1 })
    setStartCalendar(firstDayNextMonth)
  }
  function nextMonth() {
    const firstDayNextMonth = add(startCalendar, { months: 1 })
    setStartCalendar(firstDayNextMonth);
  }

  return (
    <Fragment>
      {/* <div className="hours_container">
          <div className="hours_header_wraper">
            <button
              type="button"
              onClick={previousDay}
              className="go_next_prev_hr"
            >
              <ChevronLeftIcon className="go_next_prev_hr_icon " aria-hidden="true" />
            </button>
            <span className="current_hr_text">
              {format(currentDay, 'd MMMM yyyy')}
            </span>
            <button
              onClick={nextDay}
              type="button"
              className="go_next_prev_hr"
            >
              <ChevronRightIcon className="go_next_prev_hr_icon" aria-hidden="true" />
            </button>
          </div>
        </div> */}

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" color="currentColor">
                      <path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path>
                    </svg>
                </Popover.Button>
                <Popover.Panel className="popup_calendar">
                    <div className="calendar_popup_item">
                      <div className="popup_calendar_card" >
                        <div className="calendar_inner">
                            <div className="calendar_relative">
                                <div className="calendar_header">
                                  <button type="button"  onClick={previousMonth}  className="calendar_next_prev_btn" >
                                    <ChevronLeftIcon className="next_prev_icon" aria-hidden="true" />
                                  </button>

                                  <span className="calendar_h2">
                                    {format(startCalendar, 'MMMM yyyy')}
                                  </span>
                                  <button onClick={nextMonth} type="button" className="calendar_next_prev_btn">
                                    <ChevronRightIcon className="next_prev_icon" aria-hidden="true" />
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
                                        'padding_y'
                                      )}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          console.log('====================================');
                                          console.log(day);
                                          console.log('====================================');
                                          // const dy = format(day, 'd-MM-yyyy');
                                          // const redirect = `${window.location.origin}${window.location.pathname}?start=${dy}`;
                                          // window.location = redirect;
                                        }}
                                        className={classNames(
                                          "calender_default_btn", // default class
                                          isEqual(day,startOfToday()) && isToday(day) && 'current_date_btn', // set current date color
                                          (startOfToday() > day) && 'previous_next_month_btn', // disable previous date to select
                                          !isSameMonth(day, startOfToday()) && !(startOfToday() > day) && 'not_same_month', // set different month date color
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
                {format(day, "d MMMM yyyy")}
              </div>
              <div className="hr_container">
                {timeTables.map((table, tableIndex) => {
                  const doctorSchedule = scheduleJson[table.group];
                  return (
                    <div key={table.group} className="hr_card_item">
                      <div className={"hr_card_content"}>
                        <div className="hr_card_body">
                          <div className="relative_card">
                            <div className="hr_card_header">
                              <div className="hr_card_title">{table.title}</div>
                              {/* <div className="hr_card_save ">
                              <Popover className="relative_card">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      onClick={processSubmit}
                                      className={`${
                                        open ? "" : "inactive"
                                      } hr_card_save_btn `}
                                    >
                                      <DocumentDuplicateIcon className="icon_4 " />
                                    </Popover.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="hr_popup_enter"
                                      enterFrom="hr_popup_enterFrom"
                                      enterTo="hr_popup_enterTo"
                                      leave="hr_popup_leave"
                                      leaveFrom="hr_popup_leaveFrom"
                                      leaveTo="hr_popup_leaveTo"
                                    >
                                      <Popover.Panel className="hr_submit_popup">
                                        <div className="hr_popup_container">
                                          <div className="hr_popup_card">
                                            <div className="hr_popup_content">
                                              <div className="hr_popup_text">
                                                <span>
                                                  Tag :{" "}
                                                  {format(today, "yyyy-MM-dd")}
                                                </span>
                                                <br />
                                                <span>
                                                  Tag :{" "}
                                                  {format(today, "yyyy-MM-dd")}
                                                </span>
                                                <br />
                                                <span>
                                                  Tag :{" "}
                                                  {format(today, "yyyy-MM-dd")}
                                                </span>
                                                <br />
                                              </div>
                                              <select
                                                name=""
                                                id=""
                                                className="hr_popup_select"
                                              >
                                                <option value="">Demo 1</option>
                                                <option value="">Demo 2</option>
                                              </select>
                                            </div>
                                            <div className="hr_popup_footer_container">
                                              <div className="hr_footer_btns">
                                                <button
                                                  onClick={processNeinAction}
                                                  className="hr_popup_cancel_btn"
                                                >
                                                  Nein
                                                </button>
                                                <button
                                                  onClick={processJaAction}
                                                  className="hr_popup_ok_btn"
                                                >
                                                  Ja
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </div> */}
                            </div>
                            <div className="hr_btns_container">
                              {hours.map((hour, hrIndex) => {
                                var haveSchedule = false;
                                doctorSchedule.filter((hr) => {
                                  if (isSameHour(hr, hour)) {
                                    // console.log(hour);
                                    haveSchedule = true;
                                    return true;
                                  }
                                  return false;
                                });

                                return (
                                  <button
                                    key={hrIndex}
                                    type="button"
                                    onClick={(e) => {
                                      const scheduleKey = `${
                                        table.group
                                      }-${format(
                                        hour,
                                        "MM-dd-yyyy"
                                      )}-${getHours(hour)}`;
                                      setSelectedHour(scheduleKey);
                                      setSchedule(scheduleKey);
                                    }}
                                    className={classNames(
                                      "hr_time_btn", // default class
                                      selectedSchedule.includes(
                                        `${table.group}-${format(
                                          hour,
                                          "MM-dd-yyyy"
                                        )}-${getHours(hour)}`
                                      ) &&
                                        table.group == "a" &&
                                        "a_selected", // disable previous date to select
                                      selectedSchedule.includes(
                                        `${table.group}-${format(
                                          hour,
                                          "MM-dd-yyyy"
                                        )}-${getHours(hour)}`
                                      ) &&
                                        table.group == "b" &&
                                        "b_selected", // disable previous date to select
                                      selectedSchedule.includes(
                                        `${table.group}-${format(
                                          hour,
                                          "MM-dd-yyyy"
                                        )}-${getHours(hour)}`
                                      ) &&
                                        table.group == "h" &&
                                        "h_selected", // disable previous date to select
                                      haveSchedule && table.group == "a" && "a",
                                      haveSchedule && table.group == "b" && "b",
                                      haveSchedule && table.group == "h" && "h",
                                      // !(currentHour > hour) && !isSameHour(currentHour,hour) && 'hover:bg-gray-300', // hover to normal time item
                                      !isSameHour(currentHour, hour) &&
                                        currentHour > hour &&
                                        "disabled", // disable previous date to select
                                      (currentHour <= hour ||
                                        isSameHour(currentHour, hour)) &&
                                        !haveSchedule &&
                                        !selectedSchedule.includes(
                                          `${table.group}-${format(
                                            hour,
                                            "MM-dd-yyyy"
                                          )}-${getHours(hour)}`
                                        ) &&
                                        "normal" // hover to normal time item
                                    )}
                                  >
                                    <time dateTime={hour} className="hr_time">
                                      {getHours(hour) < 10
                                        ? "0" + getHours(hour) + ":00"
                                        : getHours(hour) + ":00"}
                                    </time>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* start the tab */}
        <div className="hour_group">
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
        </div>
      </div>
    </Fragment>
  );
};

export default Time;
