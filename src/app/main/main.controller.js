export class MainController {
  constructor ($scope) {
    'ngInject';

    this.range = {
      start: '15-11-2015',
      end: '15-11-2015'
    };

    $scope.$watch(() => {
      return this.range;
    }, () => {
      this.value = `${this.range.start || ''} : ${this.range.end || ''}`;
    }, true);
  }
}
