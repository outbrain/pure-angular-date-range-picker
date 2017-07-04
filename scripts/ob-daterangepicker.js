/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(8);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* global moment:false */

	'use strict';

	var _providersDateRangePickerProviderJs = __webpack_require__(2);

	var _providersDatePickerProviderJs = __webpack_require__(3);

	var _directivesDateRangePickerDateRangePickerDirective = __webpack_require__(4);

	var _directivesCalendarCalendarDirective = __webpack_require__(5);

	var _directivesObDateRangePickerObDateRangePickerDirectiveJs = __webpack_require__(6);

	var _directivesObDayPickerObDayPickerDirective = __webpack_require__(7);

	angular.module('obDateRangePicker', []).constant('moment', moment).provider('dateRangePickerConf', _providersDateRangePickerProviderJs.DateRangePickerProvider).provider('datePickerConf', _providersDatePickerProviderJs.DatePickerProvider).directive('dateRangePicker', _directivesDateRangePickerDateRangePickerDirective.DateRangePicker).directive('obDaterangepicker', _directivesObDateRangePickerObDateRangePickerDirectiveJs.ObDateRangePicker).directive('calendar', _directivesCalendarCalendarDirective.Calendar).directive('obDaypicker', _directivesObDayPickerObDayPickerDirective.ObDayPicker);

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DateRangePickerProvider = DateRangePickerProvider;

	function DateRangePickerProvider() {
	  var config = {};

	  return {
	    setConfig: function setConfig(userConfig) {
	      config = userConfig;
	    },
	    $get: function $get() {
	      return config;
	    }
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DatePickerProvider = DatePickerProvider;

	function DatePickerProvider() {
	  var config = {};

	  return {
	    setConfig: function setConfig(userConfig) {
	      config = userConfig;
	    },
	    $get: function $get() {
	      return config;
	    }
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.DateRangePicker = DateRangePicker;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function DateRangePicker() {
	  'ngInject';

	  var directive = {
	    restrict: 'E',
	    scope: {
	      weekStart: '&',
	      range: '=?',
	      minDay: '&',
	      maxDay: '&',
	      api: '&',
	      monthFormat: '&',
	      inputFormat: '&',
	      weekDaysName: '&',
	      linkedCalendars: '&',
	      interceptors: '&',
	      rangeWindow: '&'
	    },
	    templateUrl: 'app/directives/date-range-picker/date-range-picker.html',
	    controller: DateRangePickerController,
	    controllerAs: 'picker',
	    bindToController: true,
	    link: function link(scope, elem, attrs, ctrl) {
	      ctrl.init();
	    }
	  };

	  return directive;
	}

	var DateRangePickerController = (function () {
	  DateRangePickerController.$inject = ["moment", "$scope"];
	  function DateRangePickerController(moment, $scope) {
	    'ngInject';

	    _classCallCheck(this, DateRangePickerController);

	    this.Moment = moment;
	    this.Scope = $scope;
	    this.endCalendarApi = {};
	    this.startCalendarApi = {};
	    this.setInterceptors();
	  }

	  _createClass(DateRangePickerController, [{
	    key: 'init',
	    value: function init() {
	      this.range = this.range || {};
	      this.setConfigurations();
	      this.setListeners();
	      this.setApi();
	      this.watchRangeChange();
	      this.interceptors = this.interceptors() || {};
	    }
	  }, {
	    key: 'setApi',
	    value: function setApi() {
	      var _this = this;

	      var api = this.api() || {};
	      _extends(api, {
	        setCalendarPosition: function setCalendarPosition(start, end) {
	          _this.startCalendar = start;
	          if (_this.linkedCalendars() || start.isSame(end, 'M')) {
	            _this.endCalendar = _this.startCalendar.clone().add(1, 'M');
	          } else {
	            _this.endCalendar = end;
	          }
	        },
	        render: function render() {
	          _this.startCalendarApi.render();
	          _this.endCalendarApi.render();
	        }
	      });
	    }
	  }, {
	    key: 'setListeners',
	    value: function setListeners() {
	      var _this2 = this;

	      this.Scope.$watchGroup([function () {
	        return _this2.range.start;
	      }, function () {
	        return _this2.range.end;
	      }], function (newRange) {
	        if (newRange[0] && newRange[1]) {
	          _this2.setConfigurations();
	        }
	      });
	    }
	  }, {
	    key: 'setConfigurations',
	    value: function setConfigurations() {
	      var start = undefined,
	          end = undefined;
	      if (this.isMomentRange(this.range)) {
	        start = this.range.start;
	        end = this.range.end;
	      } else {
	        start = this.Moment(this.range.start, this.getFormat());
	        end = this.Moment(this.range.end, this.getFormat());
	      }

	      end = end.diff(start) >= 0 ? end : start.clone();
	      this.rangeStart = start;
	      this.rangeEnd = end;
	      this.daysSelected = 2;
	      this.updateRange();
	    }
	  }, {
	    key: 'updateRange',
	    value: function updateRange() {
	      if (this.isMomentRange(this.range)) {
	        this.range.start = this.rangeStart;
	        this.range.end = this.rangeEnd;
	      } else {
	        this.range.start = this.rangeStart ? this.rangeStart.format(this.getFormat()) : null;
	        this.range.end = this.rangeEnd ? this.rangeEnd.format(this.getFormat()) : null;
	      }
	    }
	  }, {
	    key: 'setInterceptors',
	    value: function setInterceptors() {
	      var _this3 = this;

	      this.startCalendarInterceptors = {
	        moveToPrevClicked: function moveToPrevClicked() {
	          _this3.moveCalenders(-1, 'start');
	        },
	        moveToNextClicked: function moveToNextClicked() {
	          _this3.moveCalenders(1, 'start');
	        },
	        daySelected: function daySelected(day) {
	          _this3.dayInStartSelected(day);
	          _this3.daySelected(day);
	          if (_this3.daysSelected == 2) {
	            _this3.interceptors.rangeSelectedByClick && _this3.interceptors.rangeSelectedByClick();
	          }
	        },
	        inputSelected: function inputSelected(day) {
	          _this3.inputInStartSelected(day);
	        }
	      };

	      this.endCalendarInterceptors = {
	        moveToPrevClicked: function moveToPrevClicked() {
	          _this3.moveCalenders(-1, 'end');
	        },
	        moveToNextClicked: function moveToNextClicked() {
	          _this3.moveCalenders(1, 'end');
	        },
	        daySelected: function daySelected(day) {
	          _this3.dayInEndSelected(day);
	          _this3.daySelected(day);
	          if (_this3.daysSelected == 2) {
	            _this3.interceptors.rangeSelectedByClick && _this3.interceptors.rangeSelectedByClick();
	          }
	        },
	        inputSelected: function inputSelected(day) {
	          _this3.inputInEndSelected(day);
	        }
	      };
	    }
	  }, {
	    key: 'inputInStartSelected',
	    value: function inputInStartSelected(day) {
	      switch (this.daysSelected) {
	        case 0:
	        case 1:
	          this.rangeStart = day;
	          this.daysSelected = 1;

	          if (this.rangeWindow()) {
	            this._maxDate = day.clone().add(this.rangeWindow(), 'days');
	          }
	          break;
	        case 2:
	          if (this.rangeWindow() && this.rangeEnd.diff(day, 'days') > this.rangeWindow()) {
	            this._maxDate = day.clone().add(this.rangeWindow(), 'days');
	            this.rangeStart = day;
	            this.rangeEnd = null;
	            this.daysSelected = 1;
	            break;
	          }

	          if (day.diff(this.rangeStart, 'days') < 0) {
	            this.rangeStart = day;
	          } else if (day.isBetween(this.rangeStart, this.rangeEnd)) {
	            this.rangeStart = day;
	          } else if (day.diff(this.rangeEnd, 'days') >= 0) {
	            this.rangeStart = day;
	            this.rangeEnd = day;
	          }

	          this.daysSelected = 2;
	          this._maxDate = null;
	          this.updateRange();
	          break;
	      }
	    }
	  }, {
	    key: 'inputInEndSelected',
	    value: function inputInEndSelected(day) {
	      switch (this.daysSelected) {
	        case 0:
	          this.rangeStart = day;
	          this.daysSelected = 1;
	          if (this.rangeWindow()) {
	            this._maxDate = day.clone().add(this.rangeWindow(), 'days');
	          }
	          break;
	        case 1:
	        case 2:
	          if (this.rangeWindow() && day.diff(this.rangeStart, 'days') > this.rangeWindow()) {
	            this._maxDate = day.clone().add(this.rangeWindow(), 'days');
	            this.rangeStart = day;
	            this.rangeEnd = null;
	            this.daysSelected = 1;
	            break;
	          }

	          if (day.diff(this.rangeStart, 'days') <= 0) {
	            this.rangeStart = day;
	            this.rangeEnd = day;
	          } else if (day.isSame(this.startCalendar, 'months') || day.isSame(this.endCalendar, 'months')) {
	            this.rangeEnd = day;
	          } else if (!day.isSame(this.endCalendar, 'months')) {
	            this.rangeEnd = day;
	          }

	          this.daysSelected = 2;
	          this._maxDate = null;
	          this.updateRange();
	          this._maxDate = null;

	          break;
	      }
	    }
	  }, {
	    key: 'dayInStartSelected',
	    value: function dayInStartSelected(day) {
	      var nextMonth = this.startCalendar.clone().add(1, 'M');

	      if (day.isSame(nextMonth, 'month')) {
	        this.dayInEndSelected(day);
	      }
	    }
	  }, {
	    key: 'dayInEndSelected',
	    value: function dayInEndSelected(day) {
	      var prevMonth = this.endCalendar.clone().subtract(1, 'M');

	      if (day.isSame(prevMonth, 'month')) {
	        this.dayInStartSelected(day);
	      }
	    }
	  }, {
	    key: 'daySelected',
	    value: function daySelected(day) {
	      switch (this.daysSelected) {
	        case 0:
	          this.rangeStart = day;
	          this.daysSelected = 1;
	          break;
	        case 1:
	          if (day.diff(this.rangeStart, 'days') < 0) {
	            this.rangeStart = day;
	            if (this.rangeWindow()) {
	              this._maxDate = day.clone().add(this.rangeWindow(), 'days');
	            }
	          } else {
	            this.rangeEnd = day;
	            this.daysSelected = 2;
	            this.updateRange();
	            this._maxDate = null;
	          }
	          break;
	        case 2:
	          this.daysSelected = 1;
	          this.rangeStart = day;
	          this.rangeEnd = null;

	          // here
	          if (this.rangeWindow()) {
	            this._maxDate = day.clone().add(this.rangeWindow(), 'days');
	          }
	          break;
	      }
	    }
	  }, {
	    key: 'moveCalenders',
	    value: function moveCalenders(month, calendar) {
	      if (this.areCalendarsLinked()) {
	        this.startCalendar = this.startCalendar.clone().add(month, 'M');
	        this.endCalendar = this.endCalendar.clone().add(month, 'M');
	      } else {
	        if (calendar === 'start') {
	          this.startCalendar = this.startCalendar.clone().add(month, 'M');
	        } else {
	          this.endCalendar = this.endCalendar.clone().add(month, 'M');
	        }
	      }
	    }
	  }, {
	    key: 'isMomentRange',
	    value: function isMomentRange(range) {
	      var isRange = false;
	      if (range && range.start && range.end) {
	        isRange = this.Moment.isMoment(this.range.start) && this.Moment.isMoment(this.range.end);
	      }

	      return isRange;
	    }
	  }, {
	    key: 'watchRangeChange',
	    value: function watchRangeChange() {
	      var _this4 = this;

	      this.Scope.$watchGroup([function () {
	        return _this4.rangeStart;
	      }, function () {
	        return _this4.rangeEnd;
	      }], function (newRange, oldRange) {
	        var newStart = newRange[0];
	        var newEnd = newRange[1];
	        var oldStart = oldRange[0];
	        var oldEnd = oldRange[1];

	        if (_this4.maxDay() && newStart.isSame(_this4.maxDay(), 'M')) {
	          newStart = newStart.clone().subtract(1, 'M');
	        }

	        if (!_this4.startCalendar && !_this4.endCalendar) {
	          _this4.startCalendar = newStart;
	          _this4.endCalendar = newStart.clone().add(1, 'M');
	        }

	        if (_this4.areCalendarsLinked()) {
	          if (!(newStart.isSame(_this4.startCalendar, 'M') || newStart.isSame(_this4.endCalendar, 'M'))) {
	            if (newStart.isSame(oldStart, 'M') && newEnd && !newEnd.isSame(oldEnd, 'M')) {
	              _this4.startCalendar = newEnd.clone().subtract(1, 'M');
	              _this4.endCalendar = newEnd;
	            } else {
	              _this4.startCalendar = newStart;
	              _this4.endCalendar = newStart.clone().add(1, 'M');
	            }
	          } else if (newEnd && newEnd.isAfter(_this4.endCalendar, 'M')) {
	            _this4.startCalendar = newEnd;
	            _this4.endCalendar = newEnd.clone().add(1, 'M');
	          } else if (!newStart.isSame(_this4.endCalendar, 'M')) {
	            _this4.startCalendar = newStart;
	            _this4.endCalendar = newStart.clone().add(1, 'M');
	          }
	        } else {
	          if (!(newStart.isSame(_this4.startCalendar, 'M') || newStart.isSame(_this4.endCalendar, 'M'))) {
	            if (newStart.isBefore(_this4.startCalendar, 'M')) {
	              _this4.startCalendar = newStart;

	              if (newEnd && !newEnd.isSame(_this4.endCalendar, 'M')) {
	                if (newStart.isSame(newEnd, 'M')) {
	                  _this4.endCalendar = newStart.clone().add(1, "M");
	                } else {
	                  _this4.endCalendar = newEnd;
	                }
	              }
	            } else if (newStart.isAfter(_this4.endCalendar)) {
	              _this4.startCalendar = newStart;
	              _this4.endCalendar = newStart.clone().add(1, 'M');
	            }
	          } else if (newEnd && newEnd.isAfter(_this4.endCalendar, 'M')) {
	            _this4.endCalendar = newEnd;
	          }
	        }
	      });
	    }
	  }, {
	    key: 'areCalendarsLinked',
	    value: function areCalendarsLinked() {
	      return angular.isDefined(this.linkedCalendars()) ? this.linkedCalendars() : true;
	    }
	  }, {
	    key: 'getMinDate',
	    value: function getMinDate() {
	      if (this._minDate && this.minDay()) {
	        return this.Moment.max(this._minDate, this.minDay());
	      }

	      return this._minDate || this.minDay();
	    }
	  }, {
	    key: 'getMaxDate',
	    value: function getMaxDate() {
	      if (this._maxDate && this.maxDay()) {
	        return this.Moment.min(this._maxDate, this.maxDay());
	      }

	      return this._maxDate || this.maxDay();
	    }
	  }]);

	  return DateRangePickerController;
	})();

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Calendar = Calendar;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function Calendar() {
	  'ngInject';

	  var directive = {
	    restrict: 'E',
	    scope: {
	      minDay: '&',
	      maxDay: '&',
	      weekStart: '&',
	      getMonth: '&month',
	      getInterceptors: '&interceptors',
	      rangeStart: '&',
	      rangeEnd: '&',
	      selectedDay: '&',
	      minMonth: '&',
	      maxMonth: '&',
	      weekDaysName: '&',
	      monthFormat: '&',
	      inputFormat: '&',
	      showInput: '&',
	      api: '=?'
	    },
	    templateUrl: 'app/directives/calendar/calendar.html',
	    controller: CalendarController,
	    controllerAs: 'month',
	    bindToController: true,
	    link: function link(scope, elem, attrs, ctrl) {
	      ctrl.init();
	    }
	  };

	  return directive;
	}

	var CalendarController = (function () {
	  CalendarController.$inject = ["moment", "$scope", "$attrs"];
	  function CalendarController(moment, $scope, $attrs) {
	    'ngInject';

	    _classCallCheck(this, CalendarController);

	    this.Moment = moment;
	    this.Scope = $scope;
	    this.Attrs = $attrs;
	  }

	  _createClass(CalendarController, [{
	    key: 'init',
	    value: function init() {
	      this.api && this.setApi();
	      this.render();
	    }
	  }, {
	    key: 'setApi',
	    value: function setApi() {
	      _extends(this.api, {
	        render: this.render.bind(this),
	        moveToNext: this.moveToNext.bind(this),
	        showLeftArrow: this.showLeftArrow.bind(this)
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.defaultWeekDaysNames = this.weekDaysName() || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	      this.firstDayOfWeek = this.weekStart() || 'su';
	      this.daysOfWeek = this.buildWeek(this.firstDayOfWeek);
	      this.calendar = this.buildCalendar(this.getMonth());
	      this.interceptors = this.getInterceptors() || {};
	      this.setListeners();
	      this.daysName = this.setWeekDaysNames(this.daysOfWeek);
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue() {
	      if (this.selectedDay()) {
	        this.value = this.selectedDay().format(this.getInputFormat());
	      }
	    }
	  }, {
	    key: 'setWeekDaysNames',
	    value: function setWeekDaysNames(weekDays) {
	      var daysName = arguments.length <= 1 || arguments[1] === undefined ? this.defaultWeekDaysNames : arguments[1];

	      var weekDayNames = [];
	      var defPosMap = this.Moment.weekdaysMin().reduce(function (obj, day, index) {
	        obj[day.toLowerCase()] = index;
	        return obj;
	      }, {});

	      weekDays.forEach(function (day, index) {
	        var defPos = defPosMap[day];
	        weekDayNames[index] = daysName[defPos];
	      });

	      return weekDayNames;
	    }
	  }, {
	    key: 'setListeners',
	    value: function setListeners() {
	      var _this = this;

	      this.Scope.$watch(function () {
	        return _this.getMonth();
	      }, function (newMonth) {
	        _this.calendar = _this.buildCalendar(newMonth);
	      });

	      this.Scope.$watchGroup([function () {
	        return _this.rangeStart();
	      }, function () {
	        return _this.rangeEnd();
	      }], function () {
	        _this.setValue();
	        _this.updateDaysProperties(_this.calendar.monthWeeks);
	      });
	    }
	  }, {
	    key: 'updateDaysProperties',
	    value: function updateDaysProperties(monthWeeks) {
	      var _this2 = this;

	      var minDay = this.minDay();
	      var maxDay = this.maxDay();
	      var selectedDay = this.selectedDay();
	      var rangeStart = this.rangeStart();
	      var rangeEnd = this.rangeEnd();
	      monthWeeks.forEach(function (week) {
	        week.forEach(function (day) {
	          day.selected = day.mo.isSame(selectedDay || null, 'day');
	          day.inRange = _this2.isInRange(day.mo);
	          day.rangeStart = day.mo.isSame(rangeStart || null, 'day');
	          day.rangeEnd = day.mo.isSame(rangeEnd || null, 'day');
	          day.disabled = false;
	          if (minDay) {
	            day.disabled = day.mo.isBefore(minDay, 'day');
	          }
	          if (maxDay && !day.disabled) {
	            day.disabled = day.mo.isAfter(maxDay, 'day');
	          }
	        });
	      });
	    }
	  }, {
	    key: 'buildWeek',
	    value: function buildWeek(firstDay) {
	      var daysOfWeek = this.Moment.weekdaysMin().map(function (day) {
	        return day.toLowerCase();
	      });
	      var pivot = daysOfWeek.indexOf(firstDay.toLowerCase());
	      var firstHalf = daysOfWeek.slice(0, pivot);
	      var secondHalf = daysOfWeek.slice(pivot, daysOfWeek.length);
	      var week = secondHalf.concat(firstHalf);

	      return week;
	    }
	  }, {
	    key: 'buildCalendar',
	    value: function buildCalendar() {
	      var date = arguments.length <= 0 || arguments[0] === undefined ? this.Moment() : arguments[0];

	      var monthWeeks = [[], [], [], [], [], []];
	      var monthRange = this.getMonthDateRange(date.year(), date.month() + 1);
	      var firstDayOfMonth = monthRange.start;

	      var pivot = this.daysOfWeek.indexOf(firstDayOfMonth.format('dd').toLowerCase());
	      var tmpDate = firstDayOfMonth.clone().subtract(pivot, 'd');

	      for (var i = 0; i < 6; i++) {
	        for (var j = 0; j < 7; j++) {
	          monthWeeks[i][j] = {
	            mo: tmpDate,
	            currentDay: tmpDate.isSame(this.Moment(), 'day'),
	            currentMonth: tmpDate.isSame(date, 'month')
	          };
	          tmpDate = tmpDate.clone().add(1, 'd');
	        }
	      }

	      this.updateDaysProperties(monthWeeks);

	      return {
	        currentCalendar: date,
	        selectedDate: date,
	        firstDayOfMonth: monthRange.start.format('D'),
	        lastDayOfMonth: monthRange.end.format('D'),
	        monthWeeks: monthWeeks
	      };
	    }
	  }, {
	    key: 'moveCalenderByMonth',
	    value: function moveCalenderByMonth(months) {
	      var mo = this.calendar.currentCalendar;
	      this.month = mo.clone().add(months, 'M');
	      this.calendar = this.buildCalendar(this.month.clone());
	    }
	  }, {
	    key: 'moveToNext',
	    value: function moveToNext() {
	      if (this.interceptors.moveToNextClicked) {
	        this.interceptors.moveToNextClicked.call(this.interceptors.context);
	      } else {
	        this.moveCalenderByMonth(1);
	      }
	    }
	  }, {
	    key: 'moveToPrev',
	    value: function moveToPrev() {
	      if (this.interceptors.moveToPrevClicked) {
	        this.interceptors.moveToPrevClicked.call(this.interceptors.context);
	      } else {
	        this.moveCalenderByMonth(-1);
	      }
	    }
	  }, {
	    key: 'getMonthDateRange',
	    value: function getMonthDateRange(year, month) {
	      var startDate = this.Moment([year, month - 1]);
	      var endDate = this.Moment(startDate).endOf('month');
	      return { start: startDate, end: endDate };
	    }
	  }, {
	    key: 'isInRange',
	    value: function isInRange(day) {
	      var inRange = false;
	      var rangeStart = this.rangeStart() || null;
	      var rangeEnd = this.rangeEnd() || null;
	      inRange = day.isBetween(rangeStart, rangeEnd) || day.isSame(rangeStart, 'day') || inRange || day.isSame(rangeEnd, 'day');

	      return inRange;
	    }
	  }, {
	    key: 'daySelected',
	    value: function daySelected(day) {
	      if (!day.disabled) {
	        if (this.interceptors.daySelected) {
	          this.interceptors.daySelected.call(this.interceptors.context, day.mo);
	        }
	      }
	    }
	  }, {
	    key: 'dateInputEntered',
	    value: function dateInputEntered(ev, value) {
	      if (ev.keyCode == 13) {
	        this.dateInputSelected(ev, value);

	        // should prevent form submit if placed inside a form
	        ev.preventDefault();
	      }
	    }
	  }, {
	    key: 'dateInputSelected',
	    value: function dateInputSelected(ev, value) {
	      var day = this.Moment(value, this.getInputFormat(), true);

	      if (day.isValid()) {
	        var minDay = this.minDay();
	        var maxDay = this.maxDay();
	        day = minDay && day.isBefore(minDay, 'day') ? minDay : day;
	        day = maxDay && day.isAfter(maxDay, 'day') ? maxDay : day;

	        if (!this.selectedDay() || !this.selectedDay().isSame(day, 'day')) {
	          if (this.interceptors.inputSelected) {
	            this.interceptors.inputSelected(day);
	          } else {
	            this.daySelected({ mo: day });
	          }
	        }
	      }
	    }
	  }, {
	    key: 'getFormattedMonth',
	    value: function getFormattedMonth(day) {
	      return this.Moment(day).format(this.getMonthFormat());
	    }
	  }, {
	    key: 'getMonthFormat',
	    value: function getMonthFormat() {
	      return this.monthFormat() || 'MMMM YYYY';
	    }
	  }, {
	    key: 'getInputFormat',
	    value: function getInputFormat() {
	      return this.inputFormat() || 'MMM DD, YYYY';
	    }
	  }, {
	    key: 'showLeftArrow',
	    value: function showLeftArrow() {
	      if (this.minMonth()) {
	        return !this.minMonth().isSame(this.calendar.currentCalendar.clone().subtract(1, 'M'), 'M');
	      } else if (this.minDay()) {
	        return !this.minDay().isSame(this.calendar.currentCalendar, 'M');
	      } else {
	        return true;
	      }
	    }
	  }, {
	    key: 'showRightArrow',
	    value: function showRightArrow() {
	      if (this.maxMonth()) {
	        return !this.maxMonth().isSame(this.getMonth().clone().add(1, 'M'), 'M');
	      } else if (this.maxDay()) {
	        return !this.maxDay().isSame(this.getMonth(), 'M');
	      } else {
	        return true;
	      }
	    }
	  }, {
	    key: '_showInput',
	    value: function _showInput() {
	      return angular.isDefined(this.showInput()) ? this.showInput() : true;
	    }
	  }]);

	  return CalendarController;
	})();

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.ObDateRangePicker = ObDateRangePicker;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function ObDateRangePicker() {
	  'ngInject';

	  var directive = {
	    restrict: 'E',
	    scope: {
	      weekStart: '&',
	      range: '=?',
	      weekDaysName: '&',
	      format: '&',
	      ranges: '&',
	      minDay: '&',
	      maxDay: '&',
	      monthFormat: '&',
	      inputFormat: '&',
	      onApply: '&',
	      linkedCalendars: '&',
	      autoApply: '&',
	      disabled: '&',
	      calendarsAlwaysOn: '&',
	      rangeWindow: '&',
	      valuePostfix: '&',
	      api: '=?'
	    },
	    controller: ObDateRangePickerController,
	    templateUrl: 'app/directives/ob-date-range-picker/ob-date-range-picker.html',
	    controllerAs: 'obDateRangePicker',
	    bindToController: true,
	    link: function link(scope, elem, attrs, ctrl) {
	      ctrl.init();
	    }
	  };

	  return directive;
	}

	var ObDateRangePickerController = (function () {
	  ObDateRangePickerController.$inject = ["$document", "$element", "$scope", "moment", "dateRangePickerConf"];
	  function ObDateRangePickerController($document, $element, $scope, moment, dateRangePickerConf) {
	    'ngInject';

	    var _this = this;

	    _classCallCheck(this, ObDateRangePickerController);

	    this.Element = $element;
	    this.Document = $document;
	    this.Scope = $scope;
	    this.Moment = moment;
	    this.dateRangePickerConf = dateRangePickerConf;
	    this.pickerApi = {};

	    this.events = {
	      documentClick: function documentClick() {
	        if (_this.elemClickFlag) {
	          _this.elemClickFlag = false;
	        } else if (_this.isPickerVisible) {
	          _this.discardChanges();
	          _this.Scope.$apply();
	        }
	      },
	      documentEsc: function documentEsc(e) {
	        if (e.keyCode == 27 && _this.isPickerVisible) {
	          _this.discardChanges();
	          _this.hidePicker();
	          _this.Scope.$apply();
	        }
	      },
	      pickerClick: function pickerClick() {
	        _this.elemClickFlag = true;
	        _this.Scope.$apply();
	      }
	    };
	  }

	  _createClass(ObDateRangePickerController, [{
	    key: 'init',
	    value: function init() {
	      var _this2 = this;

	      this.range = this.range || this.dateRangePickerConf.range || {};

	      //config setup
	      this.weekStart = this.weekStart() ? this.weekStart : function () {
	        return _this2.dateRangePickerConf.weekStart;
	      };
	      this.weekDaysName = this.weekDaysName() ? this.weekDaysName : function () {
	        return _this2.dateRangePickerConf.weekDaysName;
	      };
	      this.format = this.format() ? this.format : function () {
	        return _this2.dateRangePickerConf.format;
	      };
	      this.ranges = this.ranges() ? this.ranges : function () {
	        return _this2.dateRangePickerConf.ranges;
	      };
	      this.minDay = this.minDay() ? this.minDay : function () {
	        return _this2.dateRangePickerConf.minDay;
	      };
	      this.maxDay = this.maxDay() ? this.maxDay : function () {
	        return _this2.dateRangePickerConf.maxDay;
	      };
	      this.monthFormat = this.monthFormat() ? this.monthFormat : function () {
	        return _this2.dateRangePickerConf.monthFormat;
	      };
	      this.inputFormat = this.inputFormat() ? this.inputFormat : function () {
	        return _this2.dateRangePickerConf.inputFormat;
	      };
	      this.linkedCalendars = angular.isDefined(this.linkedCalendars()) ? this.linkedCalendars : function () {
	        return _this2.dateRangePickerConf.linkedCalendars;
	      };
	      this.autoApply = angular.isDefined(this.autoApply()) ? this.autoApply : function () {
	        return _this2.dateRangePickerConf.autoApply;
	      };
	      this.disabled = angular.isDefined(this.disabled()) ? this.disabled : function () {
	        return _this2.dateRangePickerConf.disabled;
	      };
	      this.calendarsAlwaysOn = angular.isDefined(this.calendarsAlwaysOn()) ? this.calendarsAlwaysOn : function () {
	        return _this2.dateRangePickerConf.calendarsAlwaysOn;
	      };

	      this.rangeWindow = angular.isDefined(this.rangeWindow()) ? this.rangeWindow : function () {
	        return _this2.dateRangePickerConf.rangeWindow;
	      };

	      this.isCustomVisible = this.calendarsAlwaysOn();

	      this.setOpenCloseLogic();
	      this.setWatchers();
	      this.value = 'Select a Range';

	      this.api && _extends(this.api, {
	        setDateRange: this.setDateRange.bind(this),
	        togglePicker: this.togglePicker.bind(this),
	        render: function render() {
	          _this2.render();
	          _this2.pickerApi.render();
	        }
	      });
	      this.preRanges = this.ranges() || [];
	      if (this.preRanges.length) {
	        this.preRanges.push({
	          name: 'Custom',
	          isCustom: true
	        });
	      } else {
	        this.isCustomVisible = true;
	      }

	      this.render();
	      this.setListeners();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this._range = {
	        start: this.Moment(),
	        end: this.Moment()
	      };
	      this.setPredefinedStatus();

	      if (this.range.start && this.range.end && !this.Moment.isMoment(this.range.start) && !this.Moment.isMoment(this.range.end) && this.format()) {
	        this._range = {
	          start: this.Moment(this.range.start, this.getFormat()),
	          end: this.Moment(this.range.end, this.getFormat())
	        };
	      } else if (this.Moment.isMoment(this.range.start) && this.Moment.isMoment(this.range.end)) {
	        this._range = {
	          start: this.range.start,
	          end: this.range.end
	        };
	      } else if (this.preRanges.length > 1) {
	        var firstPreRange = this.preRanges[0];
	        this._range.start = firstPreRange.start;
	        this._range.end = firstPreRange.end;
	      }

	      if (this._range.start.isAfter(this._range.end)) {
	        this._range.start = this._range.end.clone();
	      } else if (this._range.end.isBefore(this._range.start)) {
	        this._range.end = this._range.start.clone();
	      }

	      this.applyMinMaxDaysToRange();
	      this.setRange();
	      this.markPredefined(this._range.start, this._range.end);
	      this.setPickerInterceptors();
	      this.isCustomVisible = this.calendarsAlwaysOn();
	    }
	  }, {
	    key: 'applyMinMaxDaysToRange',
	    value: function applyMinMaxDaysToRange() {
	      if (this.minDay()) {
	        var minDay = this._getMinDay();
	        this._range.start = this._range.start.isBefore(minDay, 'd') ? minDay : this._range.start;
	        this._range.end = this._range.end.isBefore(minDay, 'd') ? minDay : this._range.end;
	      }

	      if (this.maxDay()) {
	        var maxDay = this._getMaxDay();
	        this._range.start = this._range.start.isAfter(maxDay) ? maxDay : this._range.start;
	        this._range.end = this._range.end.isAfter(maxDay) ? maxDay : this._range.end;
	      }
	    }
	  }, {
	    key: 'setPickerInterceptors',
	    value: function setPickerInterceptors() {
	      var _this3 = this;

	      this.pickerInterceptors = {
	        rangeSelectedByClick: function rangeSelectedByClick() {
	          if (_this3.autoApply()) {
	            _this3.applyChanges();
	          }
	        }
	      };
	    }
	  }, {
	    key: 'setPredefinedStatus',
	    value: function setPredefinedStatus() {
	      var _this4 = this;

	      this.preRanges.forEach(function (range) {
	        if (!range.isCustom) {
	          range.disabled = false;

	          if (_this4.minDay()) {
	            var minDay = _this4._getMinDay();
	            range.disabled = range.start.isBefore(minDay, 'd');
	          }

	          if (!range.disabled && _this4.maxDay()) {
	            var maxDay = _this4._getMaxDay();
	            range.disabled = range.end.isAfter(maxDay, 'd');
	          }
	        }
	      });
	    }
	  }, {
	    key: 'setWatchers',
	    value: function setWatchers() {
	      var _this5 = this;

	      this.Scope.$watchGroup([function () {
	        return _this5._range.start;
	      }, function () {
	        return _this5._range.end;
	      }], function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);

	        var start = _ref2[0];
	        var end = _ref2[1];

	        if (!_this5.selfChange) {
	          if (start && end) {
	            if (_this5.preRanges.length) {
	              _this5.preRanges[_this5.preRanges.length - 1].start = start;
	              _this5.preRanges[_this5.preRanges.length - 1].end = end;
	              _this5.markPredefined(start, end);
	            }
	            _this5.value = _this5.getRangeValue();
	          }
	        }

	        _this5.selfChange = false;
	      });
	    }
	  }, {
	    key: 'setOpenCloseLogic',
	    value: function setOpenCloseLogic() {
	      this.isPickerVisible = false;
	      this.pickerPopup = angular.element(this.Element[0].querySelector('.picker'));
	      this.elemClickFlag = false;
	    }
	  }, {
	    key: 'setListeners',
	    value: function setListeners() {
	      var _this6 = this;

	      this.pickerPopup.on('click', this.events.pickerClick.bind(this));

	      this.Scope.$on('$destroy', function () {
	        _this6.pickerPopup.off('click', _this6.events.pickerClick);
	      });
	    }
	  }, {
	    key: 'togglePicker',
	    value: function togglePicker() {
	      var disabled = angular.isDefined(this.disabled()) ? this.disabled() : false;
	      if (!disabled && !this.isPickerVisible) {
	        this.isPickerVisible = true;
	        this.elemClickFlag = true;
	        this.Document.on('click', this.events.documentClick);
	        this.Document.on('keydown', this.events.documentEsc);
	      } else {
	        this.hidePicker();
	      }
	    }
	  }, {
	    key: 'hidePicker',
	    value: function hidePicker() {
	      this.isPickerVisible = false;
	      this.Document.off('click', this.events.documentClick);
	      this.Document.off('keydown', this.events.documentClick);
	    }
	  }, {
	    key: 'setRange',
	    value: function setRange() {
	      var range = arguments.length <= 0 || arguments[0] === undefined ? this._range : arguments[0];

	      if (this.format()) {
	        this.range.start = range.start.format(this.getFormat());
	        this.range.end = range.end.format(this.getFormat());
	      } else {
	        this.range.start = range.start;
	        this.range.end = range.end;
	      }
	    }
	  }, {
	    key: 'predefinedRangeSelected',
	    value: function predefinedRangeSelected(range, index) {
	      if (!range.disabled) {
	        if (!range.isCustom) {
	          this.selfChange = true;
	          this.selectedRengeIndex = index;
	          this.value = range.name;
	          this._range.start = range.start;
	          this._range.end = range.end;
	          this.isCustomVisible = this.calendarsAlwaysOn() || false;
	          this.applyChanges();
	        } else {
	          this.isCustomVisible = true;
	        }
	      }
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat() {
	      return this.format() || 'MM-DD-YYYY';
	    }
	  }, {
	    key: 'discardChanges',
	    value: function discardChanges() {
	      var format = this.getFormat();
	      var start = this.Moment(this.range.start, format);
	      var end = this.Moment(this.range.end, format);
	      this._range.start = start;
	      this._range.end = end;
	      this.value = this.getRangeValue();
	      this.pickerApi.setCalendarPosition(start, end);
	      this.hidePicker();
	    }
	  }, {
	    key: 'markPredefined',
	    value: function markPredefined(start, end) {
	      this.selectedRengeIndex = this.preRanges.findIndex(function (range) {
	        return start.isSame(range.start, 'day') && end.isSame(range.end, 'day');
	      });
	    }
	  }, {
	    key: 'getRangeValue',
	    value: function getRangeValue() {
	      var _this7 = this;

	      var value = undefined;
	      var format = this.getInputFormat();
	      if (this.preRanges.length) {
	        var index = this.preRanges.findIndex(function (range) {
	          return _this7._range.start.isSame(range.start, 'day') && _this7._range.end.isSame(range.end, 'day');
	        });

	        if (index !== -1) {
	          if (this.preRanges[index].isCustom) {
	            value = this.preRanges[index].start.format(format) + ' - ' + this.preRanges[index].end.format(format);
	          } else {
	            value = this.preRanges[index].name;
	          }
	        }
	      } else {
	        value = this._range.start.format(format) + ' - ' + this._range.end.format(format);
	      }

	      return value;
	    }
	  }, {
	    key: 'applyChanges',
	    value: function applyChanges() {
	      var callApply = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	      this.setRange();
	      this.hidePicker();
	      this.pickerApi.setCalendarPosition && this.pickerApi.setCalendarPosition(this._range.start, this._range.end);
	      if (callApply && this.onApply) {
	        this.onApply({ start: this._range.start, end: this._range.end });
	      }
	    }
	  }, {
	    key: 'getInputFormat',
	    value: function getInputFormat() {
	      return this.inputFormat() || 'MMM DD, YYYY';
	    }
	  }, {
	    key: 'setDateRange',
	    value: function setDateRange(range) {
	      this._range.start = range.start;
	      this._range.end = range.end;
	      this.applyChanges(false);'';
	    }
	  }, {
	    key: '_getMinDay',
	    value: function _getMinDay() {
	      return this.minDay() ? this.Moment(this.minDay(), this.getFormat()) : undefined;
	    }
	  }, {
	    key: '_getMaxDay',
	    value: function _getMaxDay() {
	      return this.maxDay() ? this.Moment(this.maxDay(), this.getFormat()) : undefined;
	    }
	  }]);

	  return ObDateRangePickerController;
	})();

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.ObDayPicker = ObDayPicker;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function ObDayPicker() {
	  'ngInject';

	  var directive = {
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
	    bindToController: true,
	    link: function link(scope, elem, attrs, ctrl) {
	      ctrl.init();
	    }
	  };

	  return directive;
	}

	var ObDayPickerController = (function () {
	  ObDayPickerController.$inject = ["$document", "$element", "$scope", "$timeout", "moment", "datePickerConf"];
	  function ObDayPickerController($document, $element, $scope, $timeout, moment, datePickerConf) {
	    'ngInject';

	    var _this = this;

	    _classCallCheck(this, ObDayPickerController);

	    this.Element = $element;
	    this.Document = $document;
	    this.Scope = $scope;
	    this.$timeout = $timeout;
	    this.Moment = moment;
	    this.datePickerConf = datePickerConf;

	    this.events = {
	      documentClick: function documentClick() {
	        if (_this.elemClickFlag) {
	          _this.elemClickFlag = false;
	        } else {
	          _this.onBlur();
	          _this.Scope.$digest();
	        }
	      },
	      pickerClick: function pickerClick() {
	        _this.elemClickFlag = true;
	        _this.Scope.$digest();
	      }
	    };
	  }

	  _createClass(ObDayPickerController, [{
	    key: 'init',
	    value: function init() {
	      var _this2 = this;

	      //config setup
	      this.weekStart = this.weekStart() ? this.weekStart : function () {
	        return _this2.datePickerConf.weekStart;
	      };
	      this.weekDaysName = this.weekDaysName() ? this.weekDaysName : function () {
	        return _this2.datePickerConf.weekDaysName;
	      };
	      this.format = this.format() ? this.format : function () {
	        return _this2.datePickerConf.format;
	      };
	      this.minDay = this.minDay() ? this.minDay : function () {
	        return _this2.datePickerConf.minDay;
	      };
	      this.maxDay = this.maxDay() ? this.maxDay : function () {
	        return _this2.datePickerConf.maxDay;
	      };
	      this.monthFormat = this.monthFormat() ? this.monthFormat : function () {
	        return _this2.datePickerConf.monthFormat;
	      };
	      this.inputFormat = this.inputFormat() ? this.inputFormat : function () {
	        return _this2.datePickerConf.inputFormat;
	      };
	      this.autoApply = angular.isDefined(this.autoApply()) ? this.autoApply : function () {
	        return _this2.datePickerConf.autoApply;
	      };
	      this.disabled = angular.isDefined(this.disabled()) ? this.disabled : function () {
	        return _this2.datePickerConf.disabled;
	      };
	      this.isValidDateEnabled = angular.isDefined(this.isValidDateEnabled()) ? this.isValidDateEnabled : function () {
	        return _this2.datePickerConf.isValidDateEnabled;
	      };

	      this.formName = this.formName || 'dayPickerInput';

	      this.setOpenCloseLogic();
	      this._selectedDay = this.getSelectedDay();
	      this.value = this.Moment(this._selectedDay).format(this.getFormat());
	      this.setCalendarInterceptors();
	      this.calendarApi = {};

	      this.api && _extends(this.api, {
	        render: function render() {
	          _this2.render();
	        }
	      });

	      this.setListeners();
	      this.dayValidity = this.checkIfDayIsValid(this._selectedDay);
	      this.$timeout(function () {
	        _this2.applyValidity(_this2.dayValidity);
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.dayValidity = this.checkIfDayIsValid(this._selectedDay);
	      this.applyValidity(this.dayValidity);
	      this.calendarApi.render && this.calendarApi.render();
	    }
	  }, {
	    key: 'setOpenCloseLogic',
	    value: function setOpenCloseLogic() {
	      this.isPickerVisible = false;
	      this.pickerPopup = angular.element(this.Element[0].querySelector('.picker'));
	      this.elemClickFlag = false;
	    }
	  }, {
	    key: 'setCalendarInterceptors',
	    value: function setCalendarInterceptors() {
	      this.calendarInterceptors = {
	        daySelected: this.daySelected.bind(this)
	      };
	    }
	  }, {
	    key: 'setListeners',
	    value: function setListeners() {
	      var _this3 = this;

	      this.pickerPopup.on('click', this.events.pickerClick.bind(this));
	      this.Scope.$on('$destroy', function () {
	        _this3.pickerPopup.off('click', _this3.events.pickerClick);
	        _this3.Document.off('click', _this3.events.documentClick);
	      });

	      this.Scope.$watchGroup([function () {
	        return _this3.Moment(_this3.minDay(), _this3.getFormat()).format();
	      }, function () {
	        return _this3.Moment(_this3.maxDay(), _this3.getFormat()).format();
	      }], function (min, max) {
	        if (min && min[0] || max && max[0]) {
	          _this3.render();
	        }
	      });

	      this.Scope.$watch(function () {
	        return _this3.selectedDay;
	      }, function () {
	        _this3.value = _this3.Moment(_this3.getSelectedDay()).format(_this3.getFormat());
	      });
	    }
	  }, {
	    key: 'showPicker',
	    value: function showPicker() {
	      var disabled = angular.isDefined(this.disabled()) ? this.disabled() : false;
	      if (!disabled && !this.isPickerVisible) {
	        this.isPickerVisible = true;
	        this.Document.on('click', this.events.documentClick);
	      }
	      this.elemClickFlag = true;
	    }
	  }, {
	    key: 'hidePicker',
	    value: function hidePicker() {
	      this.isPickerVisible = false;
	      this.Document.off('click', this.events.documentClick);
	    }
	  }, {
	    key: 'daySelected',
	    value: function daySelected(day) {
	      var _this4 = this;

	      var timeout = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

	      this.applyValidity(this.checkIfDayIsValid(day));
	      if (!day.isSame(this._selectedDay, 'day')) {
	        this.calendarApi.render();
	        this.value = this.Moment(day).format(this.getFormat());
	        this._selectedDay = day;

	        this.$timeout(function () {
	          _this4.hidePicker();
	          _this4.updateSelectedDate(day);
	        }, timeout);
	      } else {
	        this.hidePicker();
	      }
	    }
	  }, {
	    key: 'dateInputEntered',
	    value: function dateInputEntered(e, value) {
	      var isDaySelectable = this.checkIfDayIsValid(value);
	      switch (e.keyCode) {
	        case 9:
	        case 13:
	          var day = this.getInputValue();
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
	  }, {
	    key: 'getInputValue',
	    value: function getInputValue() {
	      return this.Moment(this.value, this.getFormat(), true);
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur() {
	      var currentValue = this.getInputValue();
	      var isValid = this.checkIfDayIsValid(currentValue);
	      if (isValid) {
	        this.daySelected(currentValue);
	      } else {
	        this.hidePicker();
	      }
	    }
	  }, {
	    key: 'updateValidity',
	    value: function updateValidity() {
	      var day = this.getInputValue();
	      var isValid = this.checkIfDayIsValid(day);
	      this.applyValidity(isValid);

	      if (isValid && this.autoApply() && !day.isSame(this._selectedDay, 'day')) {
	        this._selectedDay = day;
	        this.updateSelectedDate(day);
	      }
	    }
	  }, {
	    key: 'checkIfDayIsValid',
	    value: function checkIfDayIsValid(value) {
	      var day = this.Moment(value, this.getFormat(), true);
	      var minDay = this._getMinDay();
	      var maxDay = this._getMaxDay();
	      var isValid = day.isValid();

	      if (isValid && minDay) {
	        isValid = day.isAfter(minDay, 'day') || day.isSame(minDay, 'day');
	      }

	      if (isValid && maxDay) {
	        isValid = day.isBefore(maxDay, 'day') || day.isSame(maxDay, 'day');
	      }

	      return isValid;
	    }
	  }, {
	    key: 'applyValidity',
	    value: function applyValidity(isDateValid) {
	      if (this.Scope[this.formName]) {
	        if (this.disabled && this.disabled()) {
	          this.Scope[this.formName].$setValidity('validDay', true);
	          this.dayValidity = true;
	        } else if (this.isValidDateEnabled() && this.Scope[this.formName]) {
	          this.Scope[this.formName].$setValidity('validDay', isDateValid);
	          this.dayValidity = isDateValid;
	        }
	      }
	    }
	  }, {
	    key: 'updateSelectedDate',
	    value: function updateSelectedDate() {
	      var day = arguments.length <= 0 || arguments[0] === undefined ? this._selectedDay : arguments[0];

	      if (this.format()) {
	        this.selectedDay = day.format(this.getFormat());
	      } else {
	        this.selectedDay = day;
	      }

	      this.onApply({ day: this.selectedDay });
	    }
	  }, {
	    key: 'getSelectedDay',
	    value: function getSelectedDay() {
	      return this.Moment(this.selectedDay || this.Moment(), this.getFormat());
	    }
	  }, {
	    key: 'getFormat',
	    value: function getFormat() {
	      return this.format() || 'MMM DD, YYYY';
	    }
	  }, {
	    key: '_getMinDay',
	    value: function _getMinDay() {
	      return this.minDay() ? this.Moment(this.minDay(), this.getFormat()) : undefined;
	    }
	  }, {
	    key: '_getMaxDay',
	    value: function _getMaxDay() {
	      return this.maxDay() ? this.Moment(this.maxDay(), this.getFormat()) : undefined;
	    }
	  }]);

	  return ObDayPickerController;
	})();

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*eslint-disable */
	'use strict';

	if (!Array.prototype.findIndex) {
	  Array.prototype.findIndex = function (predicate) {
	    if (this === null) {
	      throw new TypeError('Array.prototype.findIndex called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return i;
	      }
	    }
	    return -1;
	  };
	}
	/*eslint-enable */

/***/ }
/******/ ]);
angular.module("obDateRangePicker").run(["$templateCache", function($templateCache) {$templateCache.put("app/directives/calendar/calendar.html","<div class=\"input-container\" ng-if=\"month._showInput()\"><label>{{month.Attrs.label}}</label> <input type=\"text\" ng-model=\"month.value\" ng-keypress=\"month.dateInputEntered($event, month.value)\" ng-blur=\"month.dateInputSelected($event, month.value)\"></div><div class=\"header\"><span class=\"arrow-btn left\" ng-if=\"month.showLeftArrow()\" ng-click=\"month.moveToPrev()\"></span> <span class=\"date\">{{month.getFormattedMonth(month.calendar.currentCalendar)}}</span> <span class=\"arrow-btn right\" ng-if=\"month.showRightArrow()\" ng-click=\"month.moveToNext(1)\"></span></div><div class=\"board\"><div class=\"days-of-week\"><span class=\"day-name\" ng-repeat=\"day in month.daysName track by $index\">{{day}}</span></div><div class=\"weeks\"><div ng-repeat=\"week in month.calendar.monthWeeks track by $index\"><span class=\"day\" ng-repeat=\"day in week track by $index\" ng-class=\"{ \'selected\': day.selected, \'current\': day.currentDay, \'other-month\': !day.currentMonth, \'in-range\': day.inRange, \'range-start\': day.rangeStart, \'range-end\': day.rangeEnd, \'disabled\': day.disabled }\" ng-click=\"month.daySelected(day)\">{{day.mo.format(\'D\')}}</span></div></div></div>");
$templateCache.put("app/directives/date-range-picker/date-range-picker.html","<calendar class=\"calendar\" api=\"picker.startCalendarApi\" min-day=\"picker.getMinDate()\" max-day=\"picker.getMaxDate()\" week-start=\"picker.weekStart()\" month=\"picker.startCalendar\" interceptors=\"picker.startCalendarInterceptors\" range-start=\"picker.rangeStart\" range-end=\"picker.rangeEnd\" selected-day=\"picker.rangeStart\" max-month=\"picker.endCalendar\" week-days-name=\"picker.weekDaysName()\" month-format=\"picker.monthFormat()\" input-format=\"picker.inputFormat()\" label=\"Start Date\"></calendar><calendar class=\"calendar\" api=\"picker.endCalendarApi\" min-day=\"picker.getMinDate()\" max-day=\"picker.getMaxDate()\" week-start=\"picker.weekStart()\" month=\"picker.endCalendar\" interceptors=\"picker.endCalendarInterceptors\" range-start=\"picker.rangeStart\" range-end=\"picker.rangeEnd\" selected-day=\"picker.rangeEnd\" min-month=\"picker.startCalendar\" week-days-name=\"picker.weekDaysName()\" month-format=\"picker.monthFormat()\" input-format=\"picker.inputFormat()\" label=\"End Date\"></calendar>");
$templateCache.put("app/directives/ob-date-range-picker/ob-date-range-picker.html","<div class=\"picker-dropdown-container\" ng-class=\"{\'disabled\': obDateRangePicker.disabled()}\"><div class=\"picker-dropdown\" ng-class=\"{\'open\': obDateRangePicker.isPickerVisible}\" ng-click=\"obDateRangePicker.togglePicker()\"><div><span class=\"drp_value\">{{obDateRangePicker.value}}<span><span class=\"drp_prefix\">{{obDateRangePicker.valuePostfix()}}</span></span></span></div></div><div class=\"picker\" ng-class=\"{\'open\': obDateRangePicker.isPickerVisible}\" ng-show=\"obDateRangePicker.isPickerVisible\"><div class=\"date-range\" ng-show=\"obDateRangePicker.isCustomVisible\"><date-range-picker ng-if=\"obDateRangePicker.isPickerVisible\" api=\"obDateRangePicker.pickerApi\" interceptors=\"obDateRangePicker.pickerInterceptors\" linked-calendars=\"obDateRangePicker.linkedCalendars()\" week-start=\"obDateRangePicker.weekStart()\" range=\"obDateRangePicker._range\" week-days-name=\"obDateRangePicker.weekDaysName()\" min-day=\"obDateRangePicker._getMinDay()\" max-day=\"obDateRangePicker._getMaxDay()\" month-format=\"obDateRangePicker.monthFormat()\" input-format=\"obDateRangePicker.inputFormat()\" range-window=\"obDateRangePicker.rangeWindow()\"></date-range-picker></div><div class=\"ranges-actions\" ng-class=\"{\'custom-open\': obDateRangePicker.isCustomVisible}\"><div class=\"ranges\"><div class=\"range\" ng-repeat=\"range in obDateRangePicker.preRanges track by $index\" ng-class=\"{\'selected\': obDateRangePicker.selectedRengeIndex === $index, \'disabled\': range.disabled}\" ng-click=\"obDateRangePicker.predefinedRangeSelected(range, $index)\" ng-if=\"!$last || ($last && !obDateRangePicker.calendarsAlwaysOn())\">{{range.name}}</div></div><div class=\"actions\" ng-if=\"!obDateRangePicker.autoApply()\"><div class=\"drp_btn cancel\" ng-click=\"obDateRangePicker.discardChanges()\">Cancel</div><div class=\"drp_btn apply\" ng-click=\"obDateRangePicker.applyChanges()\">APPLY</div></div></div></div></div>");
$templateCache.put("app/directives/ob-day-picker/ob-day-picker.html","<div ng-form=\"{{::dayPicker.formName}}\" class=\"picker-dropdown-container\" ng-class=\"{\'open\': dayPicker.isPickerVisible, \'disabled\': dayPicker.disabled(), \'invalid\': !dayPicker.dayValidity}\"><input class=\"picker-input\" ng-model=\"dayPicker.value\" ng-change=\"dayPicker.updateValidity()\" ng-keydown=\"dayPicker.dateInputEntered($event, dayPicker.value)\" ng-click=\"dayPicker.showPicker()\" ng-disabled=\"dayPicker.disabled()\"><div class=\"picker\" ng-show=\"dayPicker.isPickerVisible\"><calendar class=\"calendar\" api=\"dayPicker.calendarApi\" min-day=\"dayPicker._getMinDay()\" max-day=\"dayPicker._getMaxDay()\" week-start=\"dayPicker.weekStart()\" month=\"dayPicker._selectedDay\" interceptors=\"dayPicker.calendarInterceptors\" selected-day=\"dayPicker._selectedDay\" min-month=\"dayPicker.startCalendar\" week-days-name=\"dayPicker.weekDaysName()\" month-format=\"dayPicker.monthFormat()\" show-input=\"false\"></calendar></div></div>");}]);
//# sourceMappingURL=../maps/scripts/ob-daterangepicker.js.map
