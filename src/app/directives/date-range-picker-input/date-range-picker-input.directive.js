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

  constructor($document, $element, $scope, moment) {
    'ngInject';

    this.Element = $element;
    this.Document = $document;
    this.Scope = $scope;
    this.Moment = moment;
    this.range = this.range || {};
    this.pickerApi = {};
    this.isCustomVisable = false;

    this.preRanges = this.ranges() || [];
    this.preRanges.push({
      name: 'Custom',
      isCustom: true
    });
    if (this.format()) {
      this.toFormat = true;
      this._range = {
        start: this.Moment(this.range.start, this.getFormat()),
        end: this.Moment(this.range.end, this.getFormat())
      };
    } else {
      this._range = Object.assign({}, this.range);
    }

    this.value = 'Select a Range';
    this.setOpenCloseLogic();
    this.setWatchers();
    this.setRange();
    this.markPredefined(this._range.start, this._range.end);
  }

  setWatchers() {
    this.Scope.$watchGroup([() => {
      return this._range.start;
    }, () => {
      return this._range.end;
    }], ([start, end]) => {
      if (!this.selfChange) {
        if (start && end) {
          let format = this.getFormat();
          this.value = `${start.format(format)} - ${end.format(format)}`;
          this._range.start = start;
          this._range.end = end;
          this.preRanges[this.preRanges.length - 1].start = start;
          this.preRanges[this.preRanges.length - 1].end = end;
          this.markPredefined(start, end);
        }
      }

      this.selfChange = false;
    });
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
        this.discardChanges();
        this.Scope.$apply();
      }
    });
    this.pickerPopup.bind('click', () => {
      this.elemClickFlag = true;
    });
    this.Document.bind('keydown', (e) => {
      if (e.keyCode == 27) {
        this.discardChanges();
        this.Scope.$apply();
      }
    });
  }

  togglePicker() {
    if (!this.isPickerVisible) {
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

  setRange(range = this._range) {
    if (this.toFormat) {
      this.range.start = range.start.format(this.getFormat());
      this.range.end = range.end.format(this.getFormat());
    } else {
      this.range.start = range.start;
      this.range.end = range.end;
    }
  }

  predefinedRangeSelected(range, index) {
    if(!range.isCustom) {
      this.selfChange = true;
      this.selectedRengeIndex = index;
      this.value = range.name;
      this._range.start = range.start;
      this._range.end = range.end;
      this.isCustomVisable = false;
    } else {
      this.isCustomVisable = true;
    }
  }

  getFormat() {
    return this.format() || 'MM-DD-YYYY';
  }

  discardChanges() {
    let format = this.getFormat();
    let start = this.Moment(this.range.start, format);
    let end = this.Moment(this.range.end, format);
    this.value = `${start.format(format)} - ${end.format(format)}`;
    this._range.start = start;
    this._range.end = end;
    this.pickerApi.setCalendarPosition(start);
    this.hidePicker();
  }

  markPredefined(start, end) {
    this.selectedRengeIndex = this.preRanges.findIndex((range) => {
      return (start.isSame(range.start, 'day') && end.isSame(range.end, 'day'));
    });
  }

  applyChanges() {
    this.setRange();
    this.hidePicker();
  }
}
