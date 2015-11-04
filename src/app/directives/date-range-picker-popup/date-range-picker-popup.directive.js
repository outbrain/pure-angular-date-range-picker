export function DateRangePickerPopup() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      range: '=',
      format: '&'
    },
    controller: DateRangePickerPopupController,
    templateUrl: 'app/directives/date-range-picker-popup/date-range-picker-popup.html',
    controllerAs: 'popup',
    bindToController: true
  };

  return directive;
}

class DateRangePickerPopupController {

  constructor($document, $element, $scope) {
    'ngInject';
    this.isPickerVisible = false;
    this.Doc = $document;
    this.Elem = $element;
    this.Scope = $scope;
    this.offDoc = null;
    this.offElem = null;
    this.elemClickFlag = false;
  }

  setListeners() {
    this.Doc.bind('click', () => {
      if(this.elemClickFlag) {
        this.elemClickFlag = false;
      } else {
        this.hidePicker();
      }
    });
    this.Elem.bind('click', () => {
      this.elemClickFlag = true;
    });
  }

  showPicker() {
    if(!this.isPickerVisible) {
      this.setListeners();
    }

    this.isPickerVisible = true;
  }

  hidePicker() {
    this.isPickerVisible = false;
    this.Elem.unbind('click');
    this.Doc.unbind('click');
    this.Scope.$apply();
  }
}
