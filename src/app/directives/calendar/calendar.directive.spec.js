describe('directive date-range-picker', function () {
  var element, moment, defaultOptions, $compile, $scope, $rootScope, format = 'DD-MM-YYYY', elem;

  beforeEach(angular.mock.module('obDateRangePicker'));

  beforeEach(inject((_$compile_, _$rootScope_, _moment_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    moment = _moment_;
    $scope = $rootScope.$new();
    defaultOptions = {
      rangeStart: moment('10-11-2015', format),
      rangeEnd: moment('14-11-2015', format)
    };
  }));

  function prepare(options) {
    $scope.calendar = options;
    element = angular.element(`
      <calendar class="calendar"
          api="calendar.endCalendarApi"
          min-day="calendar.minDay"
          max-day="calendar.maxDay"
          week-start="calendar.weekStart"
          month="calendar.rangeStart"
          interceptors="calendar.endCalendarInterceptors"
          range-start="calendar.rangeStart"
          range-end="calendar.rangeEnd"
          selected-day="calendar.rangeStart"
          max-month="calendar.minMonth"
          min-month="calendar.maxMonth"
          week-days-name="calendar.weekDaysName"
          month-format="calendar.monthFormat"
          input-format="calendar.inputFormat"
          label="End Date">
      </calendar>
    `);

    $compile(element)($scope);
    $rootScope.$digest();
    elem = element[0];
  }

  it('should show correct initial calendar', () => {
    prepare(defaultOptions);
    let monthHeader = elem.querySelector('.date');

    expect(monthHeader.innerText.trim().toLocaleLowerCase()).toEqual('november 2015');
  });

  /* week days configuration test */
  it('should show weeks from sunday', () => {
    let options = Object.assign(defaultOptions, {
      weekStart: 'su'
    });
    prepare(options);

    let daysOfWeek = elem.querySelectorAll('.day-name');
    expect(daysOfWeek[0].innerText.toLocaleLowerCase().trim()).toEqual('sun');
  });

  it('should show given week days names', () => {
    let options = Object.assign(defaultOptions, {
      weekStart: 'su',
      weekDaysName: [1, 2, 3, 4, 5, 6, 7]
    });
    prepare(options);

    let daysOfWeek = elem.querySelectorAll('.day-name');
    expect(daysOfWeek[0].innerText.toLocaleLowerCase().trim()).toEqual('1');
  });

  /* format test */
  it('should show correct month format', () => {
    let options = Object.assign(defaultOptions, {
      monthFormat: 'MM YYYY'
    });
    prepare(options);

    let monthHeader = elem.querySelector('.date');
    expect(monthHeader.innerText.trim()).toEqual('11 2015');
  });
});
