describe('directive ob-date-range-picker', function() {
  var element, moment, defaultOptions, $compile, $scope, $rootScope, format = 'DD-MM-YYYY', picker, elem, $document;

  beforeEach(angular.mock.module('obDateRangePicker'));

  beforeEach(inject((_$compile_, _$rootScope_, _moment_, _$document_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    moment = _moment_;
    $document = _$document_;
    $scope = $rootScope.$new();
    defaultOptions = {
      range: {
        start: moment('10-11-2015', format),
        end: moment('14-11-2015', format)
      },
      ranges: [
        {
          name: 'Today',
          start: moment(),
          end:moment()
        },
        {
          name: 'Yesterday',
          start: moment().subtract(1, 'd'),
          end: moment().subtract(1, 'd')
        },
        {
          name: 'Current Month',
          start: moment().startOf('month'),
          end: moment()
        }
      ]
    };
  }));

  function prepare(options) {
    $scope.picker = options;
    element = angular.element(`
      <ob-daterangepicker
        api="picker.pickerApi"
        linked-calendars="picker.linkedCalendars()"
        week-start="picker.weekStart"
        range="picker.range"
        ranges="picker.ranges"
        week-days-name="picker.weekDaysName"
        min-day="picker.getMinDay()"
        max-day="picker.getMaxDay()"
        month-format="picker.monthFormat"
        input-format="picker.inputFormat()">
      </ob-daterangepicker>
    `);

    $compile(element)($scope);
    $rootScope.$digest();
    picker = element.isolateScope().obDateRangePicker;
    elem = element[0];
  }

  it('should show picker after first toggle', () => {
    prepare(defaultOptions);
    picker.togglePicker();
    $rootScope.$digest();

    expect(picker.isPickerVisible).toEqual(true);
  });

  it('should show 4 predefined, when the last is custom', () => {
    prepare(defaultOptions);
    $rootScope.$digest();

    expect(picker.preRanges.length).toEqual(4);
    expect(picker.preRanges[picker.preRanges.length - 1].isCustom).toEqual(true);
  });

  it('should select yesterday from predefined', () => {
    prepare(defaultOptions);
    picker.predefinedRangeSelected(picker.preRanges[1]);
    $rootScope.$digest();

    expect(picker.value).toEqual('Yesterday');
  });
});
