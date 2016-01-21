/* global moment:false */

import { DateRangePicker } from './directives/date-range-picker/date-range-picker.directive';
import { Calendar } from './directives/calendar/calendar.directive';
import { ObDateRangePicker } from './directives/ob-date-range-picker/ob-date-range-picker.directive.js';
import { ObDayPicker } from './directives/ob-day-picker/ob-day-picker.directive';
import { ObValidDay } from './directives/common/valid-date.directive';

angular.module('obDateRangePicker', [])
  .constant('moment', moment)
  .directive('dateRangePicker', DateRangePicker)
  .directive('obDaterangepicker', ObDateRangePicker)
  .directive('calendar', Calendar)
  .directive('obDaypicker', ObDayPicker)
  .directive('obValidDay', ObValidDay);
