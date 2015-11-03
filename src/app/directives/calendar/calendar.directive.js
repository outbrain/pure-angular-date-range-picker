export function Calendar() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      position: '@',
      month: '=',
      interceptors: '&',
      rangeStart: '&',
      rangeEnd: '&'
    },
    templateUrl: 'app/directives/calendar/calendar.html',
    controller: CalendarController,
    controllerAs: 'month',
    bindToController: true
  };

  return directive;
}

class CalendarController {
  constructor(moment, $scope) {
    'ngInject';

    this.Moment = moment;
    this.Scope = $scope;

    this.firstDayOfWeek = this.weekStart() || 'su';
    this.daysOfWeek = this.buildWeek(this.firstDayOfWeek);
    this.calendar = this.buildCalendar(this.month);
    this.interceptors = this.interceptors ? this.interceptors() : {};
    this.setPosition();
    this.setListeners();
  }

  setListeners() {
    this.Scope.$watch(() => {
      return this.month;
    }, (newMonth) => {
      this.calendar = this.buildCalendar(newMonth);
    });

    this.Scope.$watch(() => {
      return this.rangeStart();
    }, () => {
      this.updateDaysInRange(this.calendar.monthWeeks);
    });

    this.Scope.$watch(() => {
      return this.rangeEnd();
    }, () => {
      this.updateDaysInRange(this.calendar.monthWeeks);
    });
  }

  updateDaysInRange(monthWeeks) {
    monthWeeks.forEach((week) => {
      week.forEach((day) => {
        day.inRange = this.isInRange(day.mo);
        day.rangeStart = day.mo.isSame(this.rangeStart(), 'day');
        day.rangeEnd = day.mo.isSame(this.rangeEnd(), 'day');
      });
    });
  }

  setPosition() {
    switch (this.position) {
      case 'left':
        this.left = true;
        break;
      case 'right':
        this.right = true;
        break;
      default:
        this.left = true;
        this.right = true;
    }
  }

  buildWeek(firstDay) {
    let daysOfWeek = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    let pivot = daysOfWeek.indexOf(firstDay.toLowerCase());
    let firstHalf = daysOfWeek.slice(0, pivot);
    let secondHalf = daysOfWeek.slice(pivot, daysOfWeek.length);
    let week = secondHalf.concat(firstHalf);

    return week;
  }

  buildCalendar(date = this.Moment()) {
    let monthWeeks = [[], [], [], [], [], []];
    let monthRange = this.getMonthDateRange(date.year(), date.month() + 1);
    let firstDayOfMonth = monthRange.start;

    let pivot = this.daysOfWeek.indexOf(firstDayOfMonth.format('dd').toLowerCase());
    let tmpDate = firstDayOfMonth.clone().subtract(pivot, 'd');

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        monthWeeks[i][j] = {
          mo: tmpDate,
          currentDay: tmpDate.isSame(this.Moment(), 'day'),
          currentMonth: tmpDate.isSame(this.month, 'month')
        };
        tmpDate = tmpDate.clone().add(1, 'd');
      }
    }

    this.updateDaysInRange(monthWeeks);

    return  {
      currentCalendar: date,
      selectedDate: date,
      year: date.year(),
      month: date.format('MMMM'),
      firstDayOfMonth: monthRange.start.format('D'),
      lastDayOfMonth: monthRange.end.format('D'),
      monthWeeks: monthWeeks
    };
  }

  moveCalenderByMonth(months) {
    let mo = this.calendar.currentCalendar;
    this.calendar = this.buildCalendar(mo.clone().add(months, 'M'));
  }

  moveToNext() {
    if (this.interceptors.moveToNextClicked) {
      this.interceptors.moveToNextClicked.call(this.interceptors.context);
    } else {
      this.moveCalenderByMonth(1);
    }
  }

  moveToPrev() {
    if (this.interceptors.moveToPrevClicked) {
      this.interceptors.moveToPrevClicked.call(this.interceptors.context);
    } else {
      this.moveCalenderByMonth(-1);
    }
  }

  getMonthDateRange(year, month) {
    let startDate = this.Moment([year, month - 1]);
    let endDate = this.Moment(startDate).endOf('month');
    return {start: startDate, end: endDate};
  }

  isInRange(day) {
    let start = this.rangeStart() ? this.rangeStart().clone().subtract(1, 'd') : null;
    let end = this.rangeEnd() ? this.rangeEnd().clone().add(1, 'd') : null;
    return day.isBetween(start, end);
  }

  daySelected(day) {
    if (this.interceptors.daySelected) {
      this.interceptors.daySelected.call(this.interceptors.context, day.mo);
    } else {
      this.selectedDay = day;
    }
  }
}
