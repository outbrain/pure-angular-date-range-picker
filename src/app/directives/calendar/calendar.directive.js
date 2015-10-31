export function Calendar() {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      'minMonth': '@',
      'maxMonth': '@'
    },
    templateUrl: 'app/directives/calendar/calendar.html',
    controller: CalendarController,
    controllerAs: 'calendar',
    bindToController: true
  };

  return directive;
}

class CalendarController {
  constructor(moment) {
    'ngInject';

    this.Moment = moment;
  }

}
