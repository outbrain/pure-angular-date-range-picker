/* global moment:false */

import { config } from './index.config';
import { MainController } from './main/main.controller';
import { DateRangePicker } from './directives/date-range-picker/date-range-picker.directive';
import { Calendar } from './directives/calendar/calendar.directive';
import { ObDateRangePicker } from './directives/ob-date-range-picker/ob-date-range-picker.directive.js';

angular.module('obDateRangePicker', [])
  .constant('moment', moment)
  .config(config)

  .controller('MainController', MainController)

  .directive('dateRangePicker', DateRangePicker)
  .directive('obDaterangepicker', ObDateRangePicker)
  .directive('calendar', Calendar);

