import React, { useState, } from "react";
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
    isThisHour,
    isSameHour,
    isThisMinute,
  } from 'date-fns';
import axios from "axios";

const today = startOfToday();
export const scheduleJson = [];
// scheduleJson["a"] = eachHourOfInterval({
//   start: add(today, { days:0, hours: 20 }),
//   end: add(today, { days:0, hours: 21 }),
// });
// scheduleJson["b"] = eachHourOfInterval({
//   start: add(today, { days:0, hours: 21 }),
//   end: add(today, { days:0, hours: 22 }),
// });
// scheduleJson["h"] = eachHourOfInterval({
//   start: add(today, { days:0, hours: 23 }),
//   end: add(today, { days:0, hours: 24 }),
// });

export default {
  scheduleJson,
}