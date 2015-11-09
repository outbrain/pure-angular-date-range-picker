export class MainController {
  constructor ($scope, moment) {
    'ngInject';

    this.range = {
      start: '15-11-2015',
      end: '15-11-2015'
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
      }
    ];

    $scope.$watch(() => {
      return this.range;
    }, () => {
      this.value = `${this.range.start || ''} : ${this.range.end || ''}`;
    }, true);
  }
}
