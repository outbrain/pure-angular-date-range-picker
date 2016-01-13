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
    this.value = this.Moment(this._selectedDay).format(this.getInputFormat());

    //this.api && Object.assign(this.api, {
    //  setDay: this.setDateRange.bind(this),
    //  render: () => {
    //    this.render();
    //    this.pickerApi.render();
    //  }
    //});
    this.setCalendarInterceptors();
    this.calendarApi = {};
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
    this.Document.bind('click', () => {
      if (this.elemClickFlag) {
        this.elemClickFlag = false;
      } else {
        this.hidePicker();
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

  showPicker() {
    let disabled = angular.isDefined(this.disabled()) ? this.disabled() : false;
    if (!disabled && !this.isPickerVisible) {
      this.setListeners();
      this.isPickerVisible = true;
    }
    this.elemClickFlag = true;
  }

  hidePicker() {
    this.isPickerVisible = false;
    this.pickerPopup.unbind('click');
    this.Document.unbind('click');
  }

  daySelected(day, timeout = 100) {
    this.calendarApi.render();
    this.value = this.Moment(day).format(this.getInputFormat());
    this._selectedDay = day;

    this.$timeout(() => {
      this.hidePicker();
    }, timeout);
  }

  dateInputEntered(e, value) {
    switch (e.keyCode) {
      case 13:
        let day = this.Moment(value, this.getInputFormat(), true);
        let minDay = this.minDay();
        let maxDay = this.maxDay();
        let isDaySelectable = day.isValid();

        if(isDaySelectable && minDay) {
          isDaySelectable = day.isBefore(minDay, 'day');
        }

        if(isDaySelectable && maxDay) {
          isDaySelectable = day.isAfter(maxDay, 'day');
        }

        isDaySelectable && this.daySelected(day, 0);
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


  getSelectedDay() {
    return this.Moment(this.selectedDay || this.Moment(), this.getFormat());
  }

  getFormat() {
    return this.format() || 'MM-DD-YYYY';
  }

  getInputFormat() {
    return this.inputFormat() || 'MMM D, YYYY';
  }
}
