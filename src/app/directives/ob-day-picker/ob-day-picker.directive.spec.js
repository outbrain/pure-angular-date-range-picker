describe('directive ob-day-picker', function() {
  var element, moment, defaultOptions, $compile, $scope, $rootScope, picker; // elem, $document;

  beforeEach(angular.mock.module('obDateRangePicker'));

  beforeEach(inject((_$compile_, _$rootScope_, _moment_ /*, _$document_*/) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    moment = _moment_;
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
        min-day="picker.min"
        max-day="picker.max"
        api="picker.dateRangeApi"
        on-apply="picker.daySelected(start, end)"
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
});
