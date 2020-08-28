export function DateRangePicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      range: '=?',
      minDay: '&',
      maxDay: '&',
      api: '&',
      monthFormat: '&',
      inputFormat: '&',
      weekDaysName: '&',
      linkedCalendars: '&',
      interceptors: '&',
      rangeWindow: '&'
    },
    templateUrl: 'app/directives/date-range-picker/date-range-picker.html',
    controller: DateRangePickerController,
    controllerAs: 'picker',
    bindToController: true,
    link: (scope, elem, attrs, ctrl) => {
      ctrl.init();
    }
  };

  return directive;
}

class DateRangePickerController {

  constructor(moment, $scope) {
    'ngInject';

    this.Moment = moment;
    this.Scope = $scope;
    this.endCalendarApi = {};
    this.startCalendarApi = {};
    this.setInterceptors();
  }

  init() {
    this.range = this.range || {};
    this.setConfigurations();
    this.setListeners();
    this.setApi();
    this.watchRangeChange();
    this.interceptors = this.interceptors() || {}
  }

  setApi() {
    let api = this.api() || {};
    Object.assign(api, {
      setCalendarPosition: (start, end) => {
        this.startCalendar = start || this.Moment();
        if (this.linkedCalendars() || !start || start.isSame(end, 'M')) {
          this.endCalendar = this.startCalendar.clone().add(1, 'M');
        } else {
          this.endCalendar = end || this.startCalendar.clone().add(1, 'M');
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
    if( !this.range || !this.range.start || !this.range.end ) return;

    if (this.isMomentRange(this.range)) {
      start = this.range.start;
      end = this.range.end;
    } else {
      // todo this.getFormat() is not defined!
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
    if (this.isMomentRange({start: this.rangeStart, end: this.rangeEnd})) {
      this.range.start = this.rangeStart;
      this.range.end = this.rangeEnd;
    } else {
      // todo this.getFormat() is not defined!
      this.range.start = this.rangeStart ? this.rangeStart.format(this.getFormat()) : null;
      this.range.end = this.rangeEnd ? this.rangeEnd.format(this.getFormat()) : null;
    }
  }

  setInterceptors() {
    this.startCalendarInterceptors = {
      moveToPrevClicked: () => {
        this.moveCalenders(-1, 'start');
      },
      moveToNextClicked: () => {
        this.moveCalenders(1, 'start')
      },
      daySelected: (day) => {
        this.dayInStartSelected(day);
        this.daySelected(day);
        if (this.daysSelected == 2) {
          this.interceptors.rangeSelectedByClick && this.interceptors.rangeSelectedByClick();
        }
      },
      inputSelected: (day) => {
        this.inputInStartSelected(day);
      }
    };

    this.endCalendarInterceptors = {
      moveToPrevClicked: () => {
        this.moveCalenders(-1, 'end');
      },
      moveToNextClicked: () => {
        this.moveCalenders(1, 'end')
      },
      daySelected: (day) => {
        this.dayInEndSelected(day);
        this.daySelected(day);
        if (this.daysSelected == 2) {
          this.interceptors.rangeSelectedByClick && this.interceptors.rangeSelectedByClick();
        }
      },
      inputSelected: (day) => {
        this.inputInEndSelected(day);
      }
    }
  }

  inputInStartSelected(day) {
    switch (this.daysSelected) {
      case undefined:
      case 0:
      case 1:
        this.rangeStart = day;
        this.daysSelected = 1;

        if (this.rangeWindow()) {
          this._maxDate = day.clone().add(this.rangeWindow(), 'days');
        }
        break;
      case 2:
        if (this.rangeWindow() && (this.rangeEnd.diff(day, 'days') > this.rangeWindow())) {
          this._maxDate = day.clone().add(this.rangeWindow(), 'days');
          this.rangeStart = day;
          this.rangeEnd = null;
          this.daysSelected = 1;
          break;
        }

        if (day.diff(this.rangeStart, 'days') < 0) {
          this.rangeStart = day;
        } else if (day.isBetween(this.rangeStart, this.rangeEnd)) {
          this.rangeStart = day;
        } else if (day.diff(this.rangeEnd, 'days') >= 0) {
          this.rangeStart = day;
          this.rangeEnd = day;
        }

        this.daysSelected = 2;
        this._maxDate = null;
        this.updateRange();
        break;
    }
  }

  inputInEndSelected(day) {
    switch (this.daysSelected) {
      case undefined:
      case 0:
        this.rangeStart = day;
        this.daysSelected = 1;
        if (this.rangeWindow()) {
          this._maxDate = day.clone().add(this.rangeWindow(), 'days');
        }
        break;
      case 1:
      case 2:
        if (this.rangeWindow() && (day.diff(this.rangeStart, 'days') > this.rangeWindow())) {
          this._maxDate = day.clone().add(this.rangeWindow(), 'days');
          this.rangeStart = day;
          this.rangeEnd = null;
          this.daysSelected = 1;
          break;
        }

        if (day.diff(this.rangeStart, 'days') <= 0) {
          this.rangeStart = day;
          this.rangeEnd = day;
        } else if (day.isSame(this.startCalendar, 'months') || day.isSame(this.endCalendar, 'months')) {
          this.rangeEnd = day;
        } else if (!day.isSame(this.endCalendar, 'months')) {
          this.rangeEnd = day;
        }

        this.daysSelected = 2;
        this._maxDate = null;
        this.updateRange();
        this._maxDate = null;

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

    if (day.isSame(prevMonth, 'month')) {
      this.dayInStartSelected(day);
    }
  }

  daySelected(day) {
    switch (this.daysSelected) {
      case undefined:
      case 0:
        this.rangeStart = day;
        this.daysSelected = 1;
        break;
      case 1:
        if (day.diff(this.rangeStart, 'days') < 0) {
          this.rangeStart = day;
          if (this.rangeWindow()) {
            this._maxDate = day.clone().add(this.rangeWindow(), 'days');
          }
        } else {
          this.rangeEnd = day;
          this.daysSelected = 2;
          this.updateRange();
          this._maxDate = null;
        }
        break;
      case 2:
        this.daysSelected = 1;
        this.rangeStart = day;
        this.rangeEnd = null;

        // here
        if (this.rangeWindow()) {
          this._maxDate = day.clone().add(this.rangeWindow(), 'days');
        }
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
      isRange = this.Moment.isMoment(range.start) && this.Moment.isMoment(range.end)
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

      if( !newStart || !newStart.isValid() ) {
        let s = this.Moment();
        this.startCalendar = s;
        this.endCalendar = s.clone().add(1, 'M');
        return;
      }

      if( !newEnd || !newEnd.isValid() ) {
        this.startCalendar = newStart;
        if( this.areCalendarsLinked() ) {
          this.endCalendar = newStart.clone().add(1, 'M');
        } else {
          // move the calendar 1M from newStart only if overlaps the newStart, otherwise ne pas toucher
          this.endCalendar = this.endCalendar && this.endCalendar.isSame( newStart, 'M') ? newStart.clone().add(1, 'M') : this.endCalendar;
        }
        return;
      }


      if (this.maxDay() && newStart.isSame(this.maxDay(), 'M')) {
        newStart = newStart.clone().subtract(1, 'M');
      }

      if (!this.startCalendar && !this.endCalendar) {
        this.startCalendar = newStart;
        this.endCalendar = newStart.clone().add(1, 'M');
      }

      if (this.areCalendarsLinked()) {
        if (!(newStart.isSame(this.startCalendar, 'M') || newStart.isSame(this.endCalendar, 'M'))) {
          if (newStart.isSame(oldStart, 'M') && newEnd && !newEnd.isSame(oldEnd, 'M')) {
            this.startCalendar = newEnd.clone().subtract(1, 'M');
            this.endCalendar = newEnd;
          } else {
            this.startCalendar = newStart;
            this.endCalendar = newStart.clone().add(1, 'M');
          }
        } else if (newEnd && newEnd.isAfter(this.endCalendar, 'M')) {
          this.startCalendar = newEnd;
          this.endCalendar = newEnd.clone().add(1, 'M');
        } else if (!newStart.isSame(this.endCalendar, 'M')) {
          this.startCalendar = newStart;
          this.endCalendar = newStart.clone().add(1, 'M');
        }

      } else {
        if (!(newStart.isSame(this.startCalendar, 'M') || newStart.isSame(this.endCalendar, 'M'))) {
          if (newStart.isBefore(this.startCalendar, 'M')) {
            this.startCalendar = newStart;

            if (newEnd && !newEnd.isSame(this.endCalendar, 'M')) {
              if (newStart.isSame(newEnd, 'M')) {
                this.endCalendar = newStart.clone().add(1, "M");
              } else {
                this.endCalendar = newEnd;
              }
            }
          } else if (newStart.isAfter(this.endCalendar)) {
            this.startCalendar = newStart;
            this.endCalendar = newStart.clone().add(1, 'M');
          }
        } else if (newEnd && newEnd.isAfter(this.endCalendar, 'M')) {
          this.endCalendar = newEnd;
        }
      }
    });
  }

  areCalendarsLinked() {
    return angular.isDefined(this.linkedCalendars()) ? this.linkedCalendars() : true;
  }

  getMinDate() {
    if (this._minDate && this.minDay()) {
      return this.Moment.max(this._minDate, this.minDay());
    }

    return this._minDate || this.minDay();
  }

  getMaxDate() {
    if (this._maxDate && this.maxDay()) {
      return this.Moment.min(this._maxDate, this.maxDay());
    }

    return this._maxDate || this.maxDay();
  }
}
