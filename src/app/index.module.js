/* global moment:false */

import { DateRangePickerProvider } from './providers/date-range-picker.provider.js';
import { DatePickerProvider } from './providers/date-picker.provider.js';
import { DateRangePicker } from './directives/date-range-picker/date-range-picker.directive';
import { Calendar } from './directives/calendar/calendar.directive';
import { ObDateRangePicker } from './directives/ob-date-range-picker/ob-date-range-picker.directive.js';
import { ObDayPicker } from './directives/ob-day-picker/ob-day-picker.directive';

angular.module('obDateRangePicker', [])
  .constant('moment', moment)
  .provider('dateRangePickerConf', DateRangePickerProvider)
  .provider('datePickerConf', DatePickerProvider)
  .directive('dateRangePicker', DateRangePicker)
  .directive('obDaterangepicker', ObDateRangePicker)
  .directive('calendar', Calendar)
  .directive('obDaypicker', ObDayPicker);
