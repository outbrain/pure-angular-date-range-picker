describe('directive ob-day-picker', function() {
  let element, moment, defaultOptions, $compile, $scope, $rootScope, picker, format, $timeout; // elem, $document;

  beforeEach(angular.mock.module('obDateRangePicker'));

  beforeEach(inject((_$compile_, _$rootScope_, _moment_ , _$timeout_/*, _$document_*/) => {
    format = 'DD-MM-YYYY';
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    moment = _moment_;
    $timeout = _$timeout_;
    $scope = $rootScope.$new();
    defaultOptions = {
      selectedDay: moment()
    };
    // $document = _$document_;
  }));

  function prepare(options) {
    $scope.picker = options;
    element = angular.element(`
      <ob-daypicker
        ng-class="{'up': main.dropsUp, 'disabled': main.disabled}"
        class="{{picker.opens}}"
        selected-day="picker.selectedDay"
        min-day="picker.minDay"
        max-day="picker.maxDay"
        on-apply="picker.daySelected(day)"
        format="picker.format"
        week-start="picker.weekStart"
        disabled="picker.disabled">
      </ob-daypicker>
    `);

    $compile(element)($scope);
    $rootScope.$digest();
    picker = element.isolateScope().dayPicker;
    // elem = element[0];
  }

  it('should show and hide picker', () => {
    prepare(defaultOptions);
    let inputElement = element.find('input');
    inputElement.triggerHandler('click');
    $rootScope.$digest();
    expect(picker.isPickerVisible).toEqual(true);
    picker.hidePicker();
    $rootScope.$digest();
    expect(picker.isPickerVisible).toEqual(false);
  });

  it('should select the correct day when changed by input', () => {
    let options = {
      format: format,
      selectedDay: '18-01-2016'
    };
    prepare(options);
    picker.isPickerVisible = true;
    picker.value = '20-01-2016';
    picker.dateInputEntered({keyCode: 13}, picker.value);
    $timeout.flush();

    $rootScope.$digest();
    expect(picker.selectedDay).toEqual(picker.value);
    expect(picker.isPickerVisible).toEqual(false);
  });

  it('should not change the selected day if the day is before min-day', () => {
    let options = {
      format: format,
      selectedDay: '18-01-2016',
      minDay: '18-01-2016'
    };
    prepare(options);
    picker.isPickerVisible = true;
    picker.value = '15-01-2016';
    picker.dateInputEntered({keyCode: 13, preventDefault: function(){}}, picker.value);
    $timeout.flush();

    expect(picker.selectedDay).toEqual('18-01-2016');
    expect(picker.isPickerVisible).toEqual(false);
  });

  it('should not change the selected day if the day is after max-day', () => {
    let options = {
      format: format,
      selectedDay: '18-01-2016',
      maxDay: '20-01-2016'
    };
    prepare(options);
    picker.isPickerVisible = true;
    picker.value = '21-01-2016';
    picker.dateInputEntered({keyCode: 13, preventDefault: function(){}}, picker.value);
    $timeout.flush();

    expect(picker.selectedDay).toEqual('18-01-2016');
    expect(picker.isPickerVisible).toEqual(false);
  });
});
