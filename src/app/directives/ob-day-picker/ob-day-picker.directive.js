export function ObDayPicker() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      weekStart: '&',
      selectedDay: '=?',
      weekDaysName: '&',
      format: '&',
      minDay: '&',
      maxDay: '&',
      monthFormat: '&',
      inputFormat: '&',
      onApply: '&',
      disabled: '&',
      formName: '@name',
      isValidDateEnabled: '&validDay',
      autoApply: '&',
      api: '=?'
    },
    controller: ObDayPickerController,
    templateUrl: 'app/directives/ob-day-picker/ob-day-picker.html',
    controllerAs: 'dayPicker',
    bindToController: true
  };

  return directive;
}

class ObDayPickerController {

  constructor($document, $element, $scope, $timeout, moment) {
    'ngInject';

    this.Element = $element;
    this.Document = $document;
    this.Scope = $scope;
    this.$timeout = $timeout;
    this.Moment = moment;
    this.formName = this.formName || 'dayPickerInput';

    this.setOpenCloseLogic();
    this._selectedDay = this.getSelectedDay();
    this.value = this.Moment(this._selectedDay).format(this.getFormat());
    this.setCalendarInterceptors();
    this.calendarApi = {};

    this.api && Object.assign(this.api, {
      render: () => {
        this.dayValidity = this.checkIfDayIsValid(this._selectedDay);
        this.applyValidity(this.dayValidity);
        this.calendarApi.render();
      }
    });

    this.setListeners();
    this.dayValidity = this.checkIfDayIsValid(this._selectedDay);
    this.$timeout(() => {
      this.applyValidity(this.dayValidity);
    });
  }

  setOpenCloseLogic() {
    this.isPickerVisible = false;
    this.pickerPopup = angular.element(this.Element[0].querySelector('.picker'));
    this.elemClickFlag = false;
  }

  setCalendarInterceptors() {
    this.calendarInterceptors = {
      daySelected: this.daySelected.bind(this)
    }
  }

  setListeners() {
    let events = {
      documentClick: () => {
        if (this.elemClickFlag) {
          this.elemClickFlag = false;
        } else {
          this.onBlur();
          this.Scope.$digest();
        }
      },
      pickerClick: () => {
        this.elemClickFlag = true;
        this.Scope.$digest();
      }
    };

    this.pickerPopup.on('click', events.pickerClick.bind(this));
    this.Document.on('click', events.documentClick.bind(this));

    this.Scope.$on('$destroy', () => {
      this.pickerPopup.off('click', events.pickerClick);
      this.Document.off('click', events.documentClick);
    });
  }

  showPicker() {
    let disabled = angular.isDefined(this.disabled()) ? this.disabled() : false;
    if (!disabled && !this.isPickerVisible) {
      this.isPickerVisible = true;
    }
    this.elemClickFlag = true;
  }

  hidePicker() {
    this.isPickerVisible = false;
  }

  daySelected(day, timeout = 100) {
    this.applyValidity(this.checkIfDayIsValid(day));
    if (!day.isSame(this._selectedDay, 'day')) {
      this.calendarApi.render();
      this.value = this.Moment(day).format(this.getFormat());
      this._selectedDay = day;

      this.$timeout(() => {
        this.hidePicker();
        this.updateSelectedDate(day);
      }, timeout);
    } else {
      this.hidePicker();
    }
  }

  dateInputEntered(e, value) {
    let isDaySelectable = this.checkIfDayIsValid(value);
    switch (e.keyCode) {
      case 9:
      case 13:
        let day = this.getInputValue();
        if (isDaySelectable) {
          this.daySelected(day, 0);
        } else {
          this.hidePicker();

          // should prevent form submit if placed inside a form
          e.keyCode === 13 && e.preventDefault();
        }
        break;
      case 40:
        this.isPickerVisible = true;
        break;
      case 27:
        this.isPickerVisible = false;
        this.value = this._selectedDay.format(this.getFormat());
        break;
      default:
        break;
    }
  }

  getInputValue() {
    return this.Moment(this.value, this.getFormat(), true);
  }

  onBlur() {
    let currentValue = this.getInputValue();
    let isValid = this.checkIfDayIsValid(currentValue);
    if (isValid) {
      this.daySelected(currentValue);
    } else {
      this.hidePicker();
    }
  }

  updateValidity() {
    let day = this.getInputValue();
    let isValid = this.checkIfDayIsValid(day);
    this.applyValidity(isValid);

    if (isValid && this.autoApply() && !day.isSame(this._selectedDay, 'day')) {
      this._selectedDay = day;
      this.updateSelectedDate(day);
    }
  }

  checkIfDayIsValid(value) {
    let day = this.Moment(value, this.getFormat(), true);
    let minDay = this._getMinDay();
    let maxDay = this._getMaxDay();
    let isValid = day.isValid();

    if (isValid && minDay) {
      isValid = day.isAfter(minDay, 'day') || day.isSame(minDay, 'day');
    }

    if (isValid && maxDay) {
      isValid = day.isBefore(maxDay, 'day') || day.isSame(maxDay, 'day');
    }

    return isValid;
  }

  applyValidity(isDateValid) {
    if(this.Scope[this.formName]) {
      if(this.disabled && this.disabled()) {
        this.Scope[this.formName].$setValidity('validDay', true);
        this.dayValidity = true;
      } else if (this.isValidDateEnabled() && this.Scope[this.formName]) {
        this.Scope[this.formName].$setValidity('validDay', isDateValid);
        this.dayValidity = isDateValid;
      }
    }
  }

  updateSelectedDate(day = this._selectedDay) {
    if (this.format()) {
      this.selectedDay = day.format(this.getFormat());
    } else {
      this.selectedDay = day;
    }

    this.onApply({day: this.selectedDay});
  }

  getSelectedDay() {
    return this.Moment(this.selectedDay || this.Moment(), this.getFormat());
  }

  getFormat() {
    return this.format() || 'MMM DD, YYYY';
  }

  _getMinDay() {
    return this.minDay() ? this.Moment(this.minDay(), this.getFormat()) : undefined;
  }

  _getMaxDay() {
    return this.maxDay() ? this.Moment(this.maxDay(), this.getFormat()) : undefined;
  }
}
