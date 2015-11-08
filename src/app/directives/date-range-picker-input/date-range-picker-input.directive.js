export function DateRangePickerInput() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      range: '=',
      format: '&',
      ranges: '&'
    },
    controller: DateRangePickerInputController,
    templateUrl: 'app/directives/date-range-picker-input/date-range-picker-input.html',
    controllerAs: 'input',
    bindToController: true
  };

  return directive;
}

class DateRangePickerInputController {

  constructor($document, $element, $scope) {
    'ngInject';

    this.Element = $element;
    this.Document = $document;
    this.Scope = $scope;
    this.setOpenCloseLogic();
  }

  setOpenCloseLogic() {
    this.isPickerVisible = false;

    this.pickerPopup = angular.element(this.Element[0].querySelector('.picker'));
    this.elemClickFlag = false;
  }

  setListeners() {
    this.Document.bind('click', () => {
      if(this.elemClickFlag) {
        this.elemClickFlag = false;
      } else {
        this.hidePicker();
      }
    });
    this.pickerPopup.bind('click', () => {
      this.elemClickFlag = true;
    });
  }

  togglePicker() {
    if(!this.isPickerVisible) {
      this.setListeners();
      this.isPickerVisible = true;
      this.elemClickFlag = true;
    } else {
      this.isPickerVisible = false;
    }
  }

  hidePicker() {
    this.isPickerVisible = false;
    this.pickerPopup.unbind('click');
    this.Document.unbind('click');
    this.Scope.$apply();
  }
}
