/* global moment:false */

import { config } from './index.config';
import { DateRangePicker } from './directives/date-range-picker/date-range-picker.directive';
import { Calendar } from './directives/calendar/calendar.directive';
import { ObDateRangePicker } from './directives/ob-date-range-picker/ob-date-range-picker.directive.js';
import { ObDayPicker } from './directives/ob-day-picker/ob-day-picker.directive';

angular.module('obDateRangePicker', [])
  .constant('moment', moment)
  .config(config)
  .directive('dateRangePicker', DateRangePicker)
  .directive('obDaterangepicker', ObDateRangePicker)
  .directive('calendar', Calendar)
  .directive('obDaypicker', ObDayPicker);
