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

  constructor($document, $element, $scope, $timeout, moment) {
    'ngInject';

    this.Element = $element;
    this.Document = $document;
    this.Scope = $scope;
    this.$timeout = $timeout;
    this.Moment = moment;

    this.setOpenCloseLogic();
    this._selectedDay = this.getSelectedDay();
    this.value = this.Moment(this._selectedDay).format(this.getFormat());
    this.setCalendarInterceptors();
    this.calendarApi = {};

    this.api && Object.assign(this.api, {
      render: () => {
        this.calendarApi.render();
      }
    });

    this.setListeners();
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
          this.hidePicker();
          this.Scope.$apply();
        }
      },
      pickerClick: () => {
        this.elemClickFlag = true;
        this.Scope.$apply();
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
    this.calendarApi.render();
    this.value = this.Moment(day).format(this.getFormat());
    this._selectedDay = day;

    this.$timeout(() => {

      this.hidePicker();
      this.updateSelectedDate(day);
    }, timeout);
  }

  dateInputEntered(e, value) {
    switch (e.keyCode) {
      case 13:
        let day = this.Moment(value, this.getFormat(), true);
        let minDay = this._getMinDay();
        let maxDay = this._getMaxDay();
        let isDaySelectable = day.isValid();

        if (isDaySelectable && minDay) {
          isDaySelectable = day.isAfter(minDay, 'day') || day.isSame(minDay, 'day');
        }

        if (isDaySelectable && maxDay) {
          isDaySelectable = day.isBefore(maxDay, 'day') || day.isSame(maxDay, 'day');
        }

        if(isDaySelectable) {
          this.daySelected(day, 0);
        } else {

          // should prevent form submit if placed inside a form
          e.preventDefault();
        }

        break;
      case 40:
        this.isPickerVisible = true;
        break;
      case 27:
        this.isPickerVisible = false;
        break;
      default:
        break;
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
    return this.format() || 'MMM D, YYYY';
  }

  _getMinDay() {
    return this.minDay() ? this.Moment(this.minDay(), this.getFormat()) : undefined;
  }

  _getMaxDay() {
    return this.maxDay() ? this.Moment(this.maxDay(), this.getFormat()) : undefined;
  }
}
