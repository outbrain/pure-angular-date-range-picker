/* global moment:false */

import { config } from './index.config';
import { MainController } from './main/main.controller';
import { DateRangePicker } from './directives/date-range-picker/date-range-picker.directive';
import { Calendar } from './directives/calendar/calendar.directive';

angular.module('ngDateRangePicker', [])
  .constant('moment', moment)
  .config(config)

  .controller('MainController', MainController)
  .directive('dateRangePicker', DateRangePicker)
  .directive('calendar', Calendar);

