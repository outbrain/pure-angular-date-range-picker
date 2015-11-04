/* global moment:false */

import { config } from './index.config';
import { MainController } from './main/main.controller';
import { DateRangePicker } from './directives/date-range-picker/date-range-picker.directive';
import { Calendar } from './directives/calendar/calendar.directive';
import { DateRangePickerPopup } from './directives/date-range-picker-popup/date-range-picker-popup.directive';

angular.module('ngDateRangePicker', [])
  .constant('moment', moment)
  .config(config)

  .controller('MainController', MainController)

  .directive('dateRangePicker', DateRangePicker)
  .directive('dateRangePickerPopup', DateRangePickerPopup)
  .directive('calendar', Calendar);

