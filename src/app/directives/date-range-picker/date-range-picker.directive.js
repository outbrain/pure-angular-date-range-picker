export function DateRangePicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      range: '=',
      minDay: '&',
      maxDay: '&',
      api: '&',
      monthFormat: '&',
      inputFormat: '&',
      weekDaysName: '&',
      linkedCalendars: '&'
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
    //this.startCalendar = this.range.start || this.Moment();
    //this.endCalendar = this.startCalendar.clone().add(1, 'M');
    this.startCalendarApi = {};
    this.endCalendarApi = {};
    this.setInterceptors();
    this.setListeners();
    this.setApi();
    this.watchRangeChange();
  }

  setApi() {
    let api = this.api() || {};
    Object.assign(api, {
      setCalendarPosition: (start, end) => {
        this.startCalendar = start;
        if (this.linkedCalendars() && end) {
          this.endCalendar = end;
        } else {
          this.endCalendar = this.startCalendar.clone().add(1, 'M');
        }

      },
      render: () => {
        this.startCalendarApi.render();
        this.endCalendarApi.render();
      }
    });
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
        this.moveCalenders(-1, 'start');
      },
      daySelected: (day) => {
        this.dayInStartSelected(day);
        this.daySelected(day);
      },
      inputSelected: (day) => {
        this.inputInStartSelected(day);
      }
    };

    this.endCalendarInterceptors = {
      moveToNextClicked: () => {
        this.moveCalenders(1, 'end')
      },
      daySelected: (day) => {
        this.dayInEndSelected(day);
        this.daySelected(day);
      },
      inputSelected: (day) => {
        this.inputInEndSelected(day);
      }
    }
  }

  inputInStartSelected(day) {
    let calendar = 'start';
    switch (this.daysSelected) {
      case 0:
      case 1:
        this.rangeStart = day;
        this.daysSelected = 1;
        break;
      case 2:
        if (day.diff(this.rangeStart, 'days') < 0) {
          this.rangeStart = day;
        } else if (day.isBetween(this.rangeStart, this.rangeEnd)) {
          this.rangeStart = day;
        } else if (day.diff(this.rangeEnd, 'days') >= 0) {
          this.rangeStart = day;
          this.rangeEnd = day;
        }
        this.daysSelected = 2;
        this.updateRange();
        break;
    }
  }

  inputInEndSelected(day) {
    let calendar = 'end';
    switch (this.daysSelected) {
      case 0:
        this.rangeStart = day;
        this.daysSelected = 1;
        break;
      case 1:
      case 2:
        if (day.diff(this.rangeStart, 'days') <= 0) {
          this.rangeStart = day;
          this.rangeEnd = day;
        } else if (day.isSame(this.startCalendar, 'months') || day.isSame(this.endCalendar, 'months')) {
          this.rangeEnd = day;
        } else if (!day.isSame(this.endCalendar, 'months')) {
          this.rangeEnd = day;
        }

        this.daysSelected = 2;
        this.updateRange();
        break;
    }
  }

  dayInStartSelected(day) {
    let nextMonth = this.startCalendar.clone().add(1, 'M');

    if (day.isSame(nextMonth, 'month')) {
      this.dayInEndSelected(day);
    }
  }

  dayInEndSelected(day) {
    let prevMonth = this.endCalendar.clone().subtract(1, 'M');
    let nextMonth = this.endCalendar.clone().add(1, 'M');

    if (day.isSame(prevMonth, 'month')) {
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

  moveCalenders(month, calendar) {
    if (this.areCalendarsLinked()) {
      this.startCalendar = this.startCalendar.clone().add(month, 'M');
      this.endCalendar = this.endCalendar.clone().add(month, 'M');
    } else {
      if (calendar === 'start') {
        this.startCalendar = this.startCalendar.clone().add(month, 'M');
      } else {
        this.endCalendar = this.endCalendar.clone().add(month, 'M');
      }
    }
  }

  isMomentRange(range) {
    let isRange = false;
    if (range && range.start && range.end) {
      isRange = this.Moment.isMoment(this.range.start) && this.Moment.isMoment(this.range.end)
    }

    return isRange;
  }

  watchRangeChange() {
    this.Scope.$watchGroup([() => {
      return this.rangeStart;
    }, () => {
      return this.rangeEnd;
    }], (newRange, oldRange) => {
      let newStart = newRange[0];
      let newEnd = newRange[1];
      let oldStart = oldRange[0];
      let oldEnd = oldRange[1];

      if (!this.startCalendar && !this.endCalendar) {
        this.startCalendar = newStart;
        this.endCalendar = newStart.clone().add(1, 'M');
      }

      if (this.areCalendarsLinked()) {
        if (!(newStart.isSame(this.startCalendar, 'M') || newStart.isSame(this.endCalendar, 'M'))) {
          if (newStart.isSame(oldStart, 'M') && newEnd && !newEnd.isSame(oldEnd, 'M')) {
            this.endCalendar = newEnd;
            this.startCalendar = newEnd.clone().subtract(1, 'M');
          } else {
            this.startCalendar = newStart;
            this.endCalendar = newStart.clone().add(1, 'M');
          }
        } else if (newEnd && newEnd.isAfter(this.endCalendar, 'M')) {
          this.startCalendar = newEnd;
          this.endCalendar = newEnd.clone().add(1, 'M');
        }
      }
    })
  }

  areCalendarsLinked() {
    return this.linkedCalendars() !== undefined ? this.linkedCalendars() : true;
  }
}
