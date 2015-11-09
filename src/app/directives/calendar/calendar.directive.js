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
      rangeEnd: '&',
      minClickableDay: '&',
      weekDaysName: '&'
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
    this.defaultWeekDaysNames = this.weekDaysName() || ['Sun', 'Mon', 'Tus', 'Wen', 'The', 'Fri', 'Sat'];
    this.firstDayOfWeek = this.weekStart() || 'su';
    this.daysOfWeek = this.buildWeek(this.firstDayOfWeek);
    this.calendar = this.buildCalendar(this.month);
    this.interceptors = this.interceptors ? this.interceptors() : {};
    this.setPosition();
    this.setListeners();
    this.daysName = this.setWeekDaysNames(this.daysOfWeek);
  }

  setWeekDaysNames(weekDays, daysName = this.defaultWeekDaysNames) {
    let weekDayNames = [];
    let defPosMap = {
      'su': 0,
      'mo': 1,
      'tu': 2,
      'we': 3,
      'th': 4,
      'fr': 5,
      'sa': 6
    };

    weekDays.forEach((day, index) => {
      let defPos = defPosMap[day];
      weekDayNames[index] = daysName[defPos];
    });

    return weekDayNames;
  }

  setListeners() {
    this.Scope.$watch(() => {
      return this.month;
    }, (newMonth) => {
      this.calendar = this.buildCalendar(newMonth);
    });

    this.Scope.$watchGroup([() => {
      return this.rangeStart();
    }, () => {
      return this.rangeEnd();
    }], () => {
      this.updateDaysProperties(this.calendar.monthWeeks);
    });
  }

  updateDaysProperties(monthWeeks) {
    monthWeeks.forEach((week) => {
      week.forEach((day) => {
        day.inRange = this.isInRange(day.mo);
        day.rangeStart = day.mo.isSame(this.rangeStart(), 'day');
        day.rangeEnd = day.mo.isSame(this.rangeEnd(), 'day');
        let minClickableDay = this.minClickableDay();
        if(minClickableDay) {
          day.disabled = day.mo.diff(minClickableDay) <= 0;
        }
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

    this.updateDaysProperties(monthWeeks);

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
    let inRange = day.isBetween(this.rangeStart(), this.rangeEnd());
    inRange = inRange || day.isSame(this.rangeStart(), 'day');
    inRange = inRange || day.isSame(this.rangeEnd(), 'day');
    return inRange;
  }

  daySelected(day) {
    if(!day.disabled) {
      if (this.interceptors.daySelected) {
        this.interceptors.daySelected.call(this.interceptors.context, day.mo);
      } else {
        this.selectedDay = day;
      }
    }
  }
}
