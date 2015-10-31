export function DateRangePicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      'weekStart': '@'
    },
    templateUrl: 'app/directives/date-range-picker/date-range-picker.html',
    link: linkFunc,
    controller: DateRangePickerController,
    controllerAs: 'picker',
    bindToController: true
  };

  function linkFunc(scope, el, attr, ctrl) {
    ctrl.init();
  }

  return directive;
}

class DateRangePickerController {
  constructor(moment) {
    'ngInject';

    this.Moment = moment;
  }

  init() {
    this.firstDayOfWeek = this.weekStart ? this.weekStart : 'su';
    this.daysOfWeek = this.buildWeek(this.firstDayOfWeek);
    this.startCalender = this.buildCalendar();
    this.endCalender = this.buildCalendar(this.Moment().add(1, 'M'));
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

  moveStartCalendarByMonths(calendar, months) {
    this.startCalender = this.moveCalendarByMonth(calendar, months)
  }

  moveEndCalendarByMonths(calendar, months) {
    this.endCalender = this.moveCalendarByMonth(calendar, months)
  }

  moveCalendarByMonth(calendar, months) {
    let mo = calendar.currentCalendar;
    return this.buildCalendar(mo.clone().add(months, 'M'));
  }

  getMonthDateRange(year, month) {
    var moment = this.Moment;

    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');

    // make sure to call toDate() for plain JavaScript date type
    return {start: startDate, end: endDate};
  }
}
