export function DateRangePicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      range: '=',
      format: '&',
      minClickableDay: '&'
    },
    templateUrl: 'app/directives/date-range-picker/date-range-picker.html',
    controller: DateRangePickerController,
    controllerAs: 'picker',
    bindToController: true
  };

  return directive;
}

class DateRangePickerController {

  constructor(moment, $scope) {
    'ngInject';

    this.Moment = moment;
    this.Scope = $scope;

    this.range = this.range || {};
    this.setConfigurations();
    this.startCalendar = this.Moment();
    this.endCalendar = this.Moment().add(1, 'M');
    this.minDay = this.minClickableDay();
    this.setInterceptors();
    this.setListeners();
  }

  setListeners() {
    this.Scope.$watchGroup([() => {
      return this.range.start;
    }, () => {
      return this.range.end;
    }], (newRange) => {
      if (newRange[0] && newRange[1]) {
        this.setConfigurations();
      }
    });
  }

  setConfigurations() {
    let start, end;
    if (this.isMomentRange(this.range)) {
      start = this.range.start;
      end = this.range.end;
    } else {
      start = this.Moment(this.range.start, this.getFormat());
      end = this.Moment(this.range.end, this.getFormat());
    }

    end = end.diff(start) >= 0 ? end : start.clone();
    this.rangeStart = start;
    this.rangeEnd = end;
    this.daysSelected = 2;
    this.updateRange();
  }

  updateRange() {
    if (this.isMomentRange(this.range)) {
      this.range.start = this.rangeStart;
      this.range.end = this.rangeEnd;
    } else {
      this.range.start = this.rangeStart ? this.rangeStart.format(this.getFormat()) : null;
      this.range.end = this.rangeEnd ? this.rangeEnd.format(this.getFormat()) : null;
    }
  }

  setInterceptors() {
    this.startCalendarInterceptors = {
      moveToPrevClicked: () => {
        this.moveCalenders(-1);
      },
      daySelected: (day) => {
        this.dayInStartSelected(day);
        this.daySelected(day);
      }
    };

    this.endCalendarInterceptors = {
      moveToNextClicked: () => {
        this.moveCalenders(1)
      },
      daySelected: (day) => {
        this.dayInEndSelected(day);
        this.daySelected(day);
      }
    }
  }

  dayInStartSelected(day) {
    let prevMonth = this.startCalendar.clone().subtract(1, 'M');
    let nextMonth = this.endCalendar;

    if (day.isSame(prevMonth, 'month')) {
      this.moveCalenders(-1);
    } else if (day.isSame(nextMonth, 'month')) {
      this.dayInEndSelected(day);
    } else if (day.diff(nextMonth, 'month') > 0) {
      this.moveCalenders(day.diff(nextMonth, 'month'));
      this.dayInEndSelected(day);
    } else if (day.diff(prevMonth, 'month') < 0) {
      this.moveCalenders(day.diff(prevMonth, 'month') - 1) ;
    }
  }

  dayInEndSelected(day) {
    let prevMonth = this.startCalendar;
    let nextMonth = this.endCalendar.clone().add(1, 'M');

    if (day.isSame(prevMonth, 'month')) {
      this.dayInStartSelected(day);
    } else if (day.isSame(nextMonth, 'month')) {
      this.moveCalenders(1);
    } else if (day.diff(nextMonth, 'month') > 0) {
      this.moveCalenders(day.diff(nextMonth, 'month') + 1);
    } else if (day.diff(prevMonth, 'month') < 0) {
      this.moveCalenders(day.diff(prevMonth, 'month'));
      this.dayInStartSelected(day);
    }
  }

  daySelected(day) {
    switch (this.daysSelected) {
      case 0:
        this.rangeStart = day;
        this.daysSelected = 1;
        break;
      case 1:
        if (day.diff(this.rangeStart, 'days') < 0) {
          this.rangeStart = day;
        } else {
          this.rangeEnd = day;
          this.daysSelected = 2;
          this.updateRange();
        }
        break;
      case 2:
        this.daysSelected = 1;
        this.rangeStart = day;
        this.rangeEnd = null;
        break;
    }
  }

  moveCalenders(month) {
    this.startCalendar = this.startCalendar.clone().add(month, 'M');
    this.endCalendar = this.endCalendar.clone().add(month, 'M');
  }

  isMomentRange(range) {
    let isRange = false;
    if (range && range.start && range.end) {
      isRange = this.Moment.isMoment(this.range.start) & this.Moment.isMoment(this.range.end)
    }

    return isRange;
  }

  getFormat() {
    return this.format() || 'MM-DD-YYYY';
  }
}
