export class MainController {
  constructor ($scope, moment, $log) {
    'ngInject';

    this.Log = $log;
    this.dateRangeApi = {};

    this.range = {
      start: moment(),
      end: moment()
    };

    this.format = 'DD-MM-YYYY';

    this.ranges = [
      {
        name: 'Today',
        start: moment(),
        end: moment()
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
    ];


    $scope.$watch(() => {
      return this.range;
    }, () => {
      this.value = `${this.range.start || ''} : ${this.range.end || ''}`;
    }, true);
  }

  rangeApplied(start, end) {
    this.Log.info(start, end);
  }

  setDateRange() {
    this.dateRangeApi.setDateRange({
      start: moment(),
      end: moment().add(2, 'd')
    });
  }
}
