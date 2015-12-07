describe('directive date-range-picker', function() {
  var element, moment, defaultOptions, $compile, $scope, $rootScope, format = 'DD-MM-YYYY', picker, elem;

  beforeEach(angular.mock.module('obDateRangePicker'));

  beforeEach(inject((_$compile_, _$rootScope_, _moment_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    moment = _moment_;
    $scope = $rootScope.$new();
    defaultOptions = {
      range: {
        start: moment('10-11-2015', format),
        end: moment('14-11-2015', format)
      }
    };
  }));

  function prepare(options) {
    $scope.picker = options;
    element = angular.element(`
      <date-range-picker
        api="picker.pickerApi"
        linked-calendars="picker.linkedCalendars()"
        week-start="picker.weekStart"
        range="picker.range"
        week-days-name="picker.weekDaysName"
        min-day="picker.getMinDay()"
        max-day="picker.getMaxDay()"
        month-format="picker.monthFormat"
        input-format="picker.inputFormat()">
      </date-range-picker>
    `);

    $compile(element)($scope);
    $rootScope.$digest();
    picker = element.isolateScope().picker;
    elem = element[0];
  }

  /* range (linked) tests */
  it('should show correct initial range', () => {
    prepare(defaultOptions);
    let inRange = elem.querySelectorAll('.in-range');

    expect(inRange.length).toEqual(5);
  });

  it('should show correct range with calendar clicks day click (start == end)', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.daySelected(moment('10-11-2015', format));
    picker.startCalendarInterceptors.daySelected(moment('10-11-2015', format));
    $rootScope.$digest();
    let inRange = elem.querySelectorAll('.in-range');

    expect(inRange.length).toEqual(1);
    expect(inRange[0].innerText.trim()).toEqual('10');
  });

  it('should change start day if before current start was selected', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.daySelected(moment('09-11-2015', format));
    $rootScope.$digest();
    let startRange = elem.querySelector('.in-range.range-start');
    let rangeEnd = elem.querySelector('.range-end');

    expect(startRange.innerText.trim()).toEqual('9');
    expect(rangeEnd).toEqual(null);
  });

  it('should change start day if same as current start was selected', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.daySelected(moment('10-11-2015', format));
    $rootScope.$digest();
    let startRange = elem.querySelector('.in-range.range-start');
    let rangeEnd = elem.querySelector('.range-end');

    expect(startRange.innerText.trim()).toEqual('10');
    expect(rangeEnd).toEqual(null);
  });

  it('should change start day if after current start was selected', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.daySelected(moment('11-11-2015', format));
    $rootScope.$digest();
    let startRange = elem.querySelector('.in-range.range-start');
    let rangeEnd = elem.querySelector('.range-end');

    expect(startRange.innerText.trim()).toEqual('11');
    expect(rangeEnd).toEqual(null);
  });

  it('should change calendars when prev month\'s day clicked', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.daySelected(moment('29-10-2015', format));
    $rootScope.$digest();

    expect(picker.startCalendar.month()).toEqual(9);
    expect(picker.endCalendar.month()).toEqual(10);
  });

  it('should change calendars when next month\'s day clicked', () => {
    prepare(defaultOptions);
    picker.endCalendarInterceptors.daySelected(moment('01-11-2015', format));
    $rootScope.$digest();

    expect(picker.startCalendar.month()).toEqual(10);
    expect(picker.endCalendar.month()).toEqual(11);
  });

  it('should change both calendars position when input in start changed', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.inputSelected(moment('05-05-2015', format));
    $rootScope.$digest();

    expect(picker.startCalendar.month()).toEqual(4);
    expect(picker.endCalendar.month()).toEqual(5);
  });

  it('should change both calendars position when input in end changed', () => {
    prepare(defaultOptions);
    picker.endCalendarInterceptors.inputSelected(moment('05-05-2015', format));
    $rootScope.$digest();

    expect(picker.startCalendar.month()).toEqual(4);
    expect(picker.endCalendar.month()).toEqual(5);
  });

  it('should change only the start date when start input is changed', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.inputSelected(moment('05-05-2015', format));
    $rootScope.$digest();

    expect(picker.range.start.format(format)).toEqual('05-05-2015');
    expect(picker.range.end.format(format)).toEqual('14-11-2015');
  });

  it('should change range start and end if the date in input is after the current range end', () => {
    prepare(defaultOptions);
    picker.startCalendarInterceptors.inputSelected(moment('17-11-2015', format));
    $rootScope.$digest();

    expect(picker.range.start.format(format)).toEqual('17-11-2015');
    expect(picker.range.end.format(format)).toEqual('17-11-2015');
  });
});
