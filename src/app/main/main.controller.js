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
    //this.min = '15/11/2015';
    //this.max = '16/11/2015';

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

  render(e) {
    if(e) {
      e.keyCode == 13 && this.dateRangeApi.render();
    } else {
      this.dateRangeApi.render()
    }
  }
}
