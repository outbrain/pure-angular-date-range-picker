export function DateRangePicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      'weekStart': '@'
    },
    templateUrl: 'app/directives/date-range-picker/date-range-picker.html',
    controller: DateRangePickerController,
    controllerAs: 'picker',
    bindToController: true
  };

  return directive;
}

class DateRangePickerController {
  constructor(moment) {
    'ngInject';

    this.Moment = moment;
    this.startCalendar = this.Moment();
    this.endCalendar = this.Moment().add(1, 'M');
    this.setInterceptors();
  }

  setInterceptors() {
    this.startCalendarInterceptors = {
      moveToPrevClicked: () => {
        this.startCalendar = this.startCalendar.clone().add(-1, 'M');
        this.endCalendar = this.endCalendar.clone().add(-1, 'M');
      }
    };

    this.endCalendarInterceptors = {
      moveToNextClicked: () => {
        this.startCalendar = this.startCalendar.clone().add(1, 'M');
        this.endCalendar = this.endCalendar.clone().add(1, 'M');
      }
    }
  }
}
