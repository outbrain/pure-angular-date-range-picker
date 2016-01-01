export function ObDayPicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      selectedDay: '=',
      weekDaysName: '&',
      format: '&',
      minDay: '&',
      maxDay: '&',
      monthFormat: '&',
      inputFormat: '&',
      onApply: '&',
      disabled: '&',
      api: '='
    },
    controller: ObDayPickerController,
    templateUrl: 'app/directives/ob-day-picker/ob-day-picker.html',
    controllerAs: 'dayPicker',
    bindToController: true
  };

  return directive;
}

class ObDayPickerController {

  constructor($document, $element, $scope, moment) {
    'ngInject';

    this.Element = $element;
    this.Document = $document;
    this.Scope = $scope;
    this.Moment = moment;

    this.setOpenCloseLogic();
    this.value = 'Select a Range';

    //this.api && Object.assign(this.api, {
    //  setDay: this.setDateRange.bind(this),
    //  render: () => {
    //    this.render();
    //    this.pickerApi.render();
    //  }
    //});
  }

  setOpenCloseLogic() {
    this.isPickerVisible = false;
    this.pickerPopup = angular.element(this.Element[0].querySelector('.picker'));
    this.elemClickFlag = false;
  }

  setListeners() {
    this.Document.bind('click', () => {
      if (this.elemClickFlag) {
        this.elemClickFlag = false;
      } else {
        this.Scope.$apply();
      }
    });
    this.pickerPopup.bind('click', () => {
      this.elemClickFlag = true;
    });
    this.Document.bind('keydown', (e) => {
      if (e.keyCode == 27) {
        this.Scope.$apply();
      }
    });
  }

  togglePicker() {
    let disabled = angular.isDefined(this.disabled()) ? this.disabled() : false;
    if (!disabled && !this.isPickerVisible) {
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
  }


  getFormat() {
    return this.format() || 'MM-DD-YYYY';
  }

  getInputFormat() {
    return this.inputFormat() || 'MMM D, YYYY';
  }

  _getMinDay() {
    return this.minDay() ? this.Moment(this.minDay(), this.getFormat()) : undefined;
  }

  _getMaxDay() {
    return this.maxDay() ? this.Moment(this.maxDay(), this.getFormat()) : undefined;
  }
}
