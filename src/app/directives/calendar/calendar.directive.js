export function Calendar() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '@',
      minMonth: '&',
      maxMonth: '&',
      month: '='

    },
    templateUrl: 'app/directives/calendar/calendar.html',
    controller: CalendarController,
    controllerAs: 'month',
    bindToController: true
  };

  return directive;
}

class CalendarController {
  constructor(moment) {
    'ngInject';

    this.Moment = moment;

    this.firstDayOfWeek = this.weekStart ? this.weekStart : 'su';
    this.daysOfWeek = this.buildWeek(this.firstDayOfWeek);
    this.calendar = this.buildCalendar(this.month);
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
      for(let j = 0; j < 7; j++) {
        monthWeeks[i][j] = tmpDate;
        tmpDate = tmpDate.clone().add(1, 'd');
      }
    }

    return {
      currentCalendar: date,
      selectedDate: date,
      year: date.year(),
      month: date.format('MMMM'),
      firstDayOfMonth: monthRange.start.format('D'),
      lastDayOfMonth: monthRange.end.format('D'),
      monthWeeks: monthWeeks
    }
  }

  moveCalenderByMonth(months) {
    let mo = this.calendar.currentCalendar;
    this.calendar = this.buildCalendar(mo.clone().add(months, 'M'));
  }

  getMonthDateRange(year, month) {
    let startDate = this.Moment([year, month - 1]);
    let endDate = this.Moment(startDate).endOf('month');
    return {start: startDate, end: endDate};
  }

  showBackButton() {
    let toShow = true;
    if(this.minMonth && this.minMonth()) {
      let minMonth = this.minMonth();
      toShow = this.calendar.currentCalendar.diff(minMonth, 'month') > 1;
    }

    return toShow;
  }
}
