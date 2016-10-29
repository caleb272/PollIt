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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

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
/******/ 	return __webpack_require__(__webpack_require__.s = 68);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react-redux");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getPolls = getPolls;
	exports.getPoll = getPoll;
	exports.getUsersPolls = getUsersPolls;
	exports.getUser = getUser;
	exports.getClientIP = getClientIP;

	var _PollActions = __webpack_require__(6);

	var _voting_tools = __webpack_require__(7);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var initialState = [];

	function PollReducer() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	  var action = arguments[1];

	  switch (action.type) {
	    case _PollActions.CREATE_POLL:
	      return [].concat(_toConsumableArray(state), [action.poll]);

	    case _PollActions.UPDATE_POLL:
	      return state.map(function (currentPoll) {
	        return currentPoll.cuid === action.poll.cuid ? action.poll : currentPoll;
	      });

	    case _PollActions.DELETE_POLL:
	      return state.filter(function (poll) {
	        return poll.cuid !== action.pollID;
	      });

	    default:
	      return state;
	  }
	}

	function getPolls(state) {
	  var polls = state.polls.map(_voting_tools.sortPollEntries);
	  return sortPollsNewestToOldest(polls);
	}

	function getPoll(state, cuid) {
	  return (0, _voting_tools.sortPollEntries)(state.polls.filter(function (poll) {
	    return poll.cuid === cuid;
	  })[0]);
	}

	function getUsersPolls(state, userId) {
	  var usersPolls = state.polls.filter(function (poll) {
	    return poll.authorID === userId;
	  });
	  usersPolls = usersPolls.map(_voting_tools.sortPollEntries);
	  return sortPollsNewestToOldest(usersPolls);
	}

	function getUser(state) {
	  return state.user.userProfile;
	}

	function getClientIP(state) {
	  return state.user.clientIP;
	}

	function sortPollsNewestToOldest(polls) {
	  return polls.sort(function (poll1, poll2) {
	    return poll1.dateCreated < poll2.dateCreated;
	  });
	}

	exports.default = PollReducer;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DELETE_POLL = exports.CREATE_POLL = exports.UPDATE_POLL = undefined;
	exports.createPollRequest = createPollRequest;
	exports.updatePollRequest = updatePollRequest;
	exports.voteOnPollRequest = voteOnPollRequest;
	exports.deletePollRequest = deletePollRequest;
	exports.createPoll = createPoll;
	exports.updatePoll = updatePoll;
	exports.deletePoll = deletePoll;
	exports.noChange = noChange;

	var _apiCaller = __webpack_require__(23);

	var _apiCaller2 = _interopRequireDefault(_apiCaller);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var UPDATE_POLL = exports.UPDATE_POLL = 'UPDATE_POLL';
	var CREATE_POLL = exports.CREATE_POLL = 'CREATE_POLL';
	var DELETE_POLL = exports.DELETE_POLL = 'DELETE_POLL';

	function createPollRequest(poll) {
	  return function dispatchedRequest(dispatch) {
	    return (0, _apiCaller2.default)('polls', 'POST', poll).then(function (_ref) {
	      var createdPoll = _ref.createdPoll;

	      if (createdPoll) {
	        dispatch(createPoll(createdPoll));
	      } else {
	        dispatch(noChange());
	      }
	    }).catch(function (err) {
	      return console.error(err);
	    }); // eslint-disable-line
	  };
	}

	function updatePollRequest(poll) {
	  return function dispatchRequest(dispatch) {
	    return (0, _apiCaller2.default)('polls', 'PUT', poll).then(function (_ref2) {
	      var updatedPoll = _ref2.updatedPoll;

	      if (updatedPoll) {
	        dispatch(updatePoll(poll));
	      } else {
	        dispatch(noChange);
	      }
	    });
	  };
	}

	function voteOnPollRequest(cuid, entryTitle) {
	  return function dispatchedRequest(dispatch) {
	    return (0, _apiCaller2.default)('polls/vote', 'PATCH', { cuid: cuid, entryTitle: entryTitle }).then(function (_ref3) {
	      var votedOnPoll = _ref3.votedOnPoll;

	      if (votedOnPoll) {
	        dispatch(updatePoll(votedOnPoll));
	      } else {
	        dispatch(noChange());
	      }
	    }).catch(function (err) {
	      return console.error(err);
	    }); // eslint-disable-line
	  };
	}

	function deletePollRequest(pollID) {
	  return function dispatchedRequest(dispatch) {
	    dispatch(deletePoll(pollID));
	    (0, _apiCaller2.default)('polls', 'DELETE', { pollID: pollID }).catch(function (err) {
	      return console.error(err);
	    });
	  };
	}

	function createPoll(poll) {
	  return {
	    type: CREATE_POLL,
	    poll: poll
	  };
	}

	function updatePoll(poll) {
	  return {
	    type: UPDATE_POLL,
	    poll: poll
	  };
	}

	function deletePoll(pollID) {
	  return {
	    type: DELETE_POLL,
	    pollID: pollID
	  };
	}

	function noChange() {
	  return {
	    type: 'NO_CHANGE'
	  };
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sortPollEntries = sortPollEntries;

	exports.default = function votingTools() {
	  function voteOnPollEntries(voterID, entryTitle, entries) {
	    var lastVotedOnEntry = getVotedOnEntryByVoter(voterID, entries);
	    if (lastVotedOnEntry) {
	      var votedOnEntry = getEntryByTitle(entryTitle, entries);

	      lastVotedOnEntry.votes = lastVotedOnEntry.votes.filter(function (vote) {
	        return vote !== voterID;
	      });
	      if (votedOnEntry !== lastVotedOnEntry) {
	        votedOnEntry.votes.push(voterID);
	      }
	    } else {
	      getEntryByTitle(entryTitle, entries).votes.push(voterID);
	    }
	  }

	  function getVotedOnEntryByVoter(voterID, entries) {
	    for (var i = 0; i < entries.length; i++) {
	      var entry = entries[i];
	      if (entry.votes.includes(voterID)) {
	        return entry;
	      }
	    }

	    return null;
	  }

	  function getEntryByTitle(entryTitle, entries) {
	    for (var i = 0; i < entries.length; i++) {
	      var entry = entries[i];
	      if (entry.title === entryTitle) {
	        return entry;
	      }
	    }

	    return null;
	  }

	  return {
	    voteOnPollEntries: voteOnPollEntries
	  };
	}();

	var NONE = 'None';
	var LOW_TO_HIGH = 'Low to High';
	var HIGH_TO_LOW = 'High to Low';
	var ALPHABETICAL = 'Alphabetical';

	var sortOptions = exports.sortOptions = [NONE, LOW_TO_HIGH, HIGH_TO_LOW, ALPHABETICAL];

	function sortPollEntries(poll) {
	  if (!poll) {
	    return null;
	  }

	  var sortOrder = poll.sortOrder;
	  var entries = poll.entries;

	  var defaultToOriginalIndex = function defaultToOriginalIndex(first, second, sortCallback) {
	    if (first.votes.length + second.votes.length > 0) {
	      return sortCallback(first.votes.length, second.votes.length);
	    }
	    return first.originalEntryIndex > second.originalEntryIndex;
	  };

	  entries.sort(function (first, second) {
	    switch (sortOrder) {
	      case LOW_TO_HIGH:
	        return defaultToOriginalIndex(first, second, function (firstVotes, secondVotes) {
	          return firstVotes > secondVotes;
	        });

	      case HIGH_TO_LOW:
	        return defaultToOriginalIndex(first, second, function (firstVotes, secondVotes) {
	          return firstVotes < secondVotes;
	        });

	      case ALPHABETICAL:
	        return first.title.toLowerCase() > second.title.toLowerCase();

	      case NONE:
	      default:
	        return first.originalEntryIndex > second.originalEntryIndex;
	    }
	  });

	  return poll;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _Card = __webpack_require__(26);

	var _reactRouter = __webpack_require__(2);

	var _VoteableBarChart = __webpack_require__(54);

	var _VoteableBarChart2 = _interopRequireDefault(_VoteableBarChart);

	var _PollListItem = {
	  "page-padding": "_2IxcwnzvD-yL2sxeoX3NiE",
	  "poll-list-item": "_QhMbZzy9kEKF5HCe9hNN"
	};

	var _PollListItem2 = _interopRequireDefault(_PollListItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function PollListItem(props) {
	  var title = _jsx(_reactRouter.Link, {
	    href: '/polls/' + props.poll.cuid
	  }, void 0, props.poll.title);

	  var subtitle = _jsx('span', {}, void 0, 'Created by ', _jsx(_reactRouter.Link, {
	    href: '/polls/user/' + props.poll.authorID
	  }, void 0, props.poll.author));

	  return _jsx('div', {
	    className: _PollListItem2.default['poll-list-item'] + ' ' + _PollListItem2.default['page-padding']
	  }, void 0, _jsx(_Card.Card, {
	    expandable: null
	  }, void 0, _jsx(_Card.CardHeader, {
	    title: title,
	    subtitle: subtitle
	  }), _jsx(_Card.CardMedia, {}, void 0, _jsx('center', {}, void 0, _jsx(_VoteableBarChart2.default, {
	    poll: props.poll
	  }))), props.innerElements));
	}

	exports.default = PollListItem;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("material-ui");

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var config = {
	  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/pollit',
	  port: process.env.PORT || 8000
	};

	exports.default = config;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(5);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var pollSchema = new Schema({
	  title: String,
	  author: String,
	  authorID: String,
	  sortOrder: String,
	  entries: Array,
	  cuid: String,
	  dateCreated: Number
	});

	exports.default = _mongoose2.default.model('Poll', pollSchema);

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("react-helmet");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.localizationData = exports.enabledLanguages = undefined;

	var _reactIntl = __webpack_require__(94);

	var _intl = __webpack_require__(74);

	var _intl2 = _interopRequireDefault(_intl);

	var _intlLocalesSupported = __webpack_require__(75);

	var _intlLocalesSupported2 = _interopRequireDefault(_intlLocalesSupported);

	__webpack_require__(76);

	var _en = __webpack_require__(95);

	var _en2 = _interopRequireDefault(_en);

	var _en3 = __webpack_require__(43);

	var _en4 = _interopRequireDefault(_en3);

	__webpack_require__(77);

	var _fr = __webpack_require__(96);

	var _fr2 = _interopRequireDefault(_fr);

	var _fr3 = __webpack_require__(44);

	var _fr4 = _interopRequireDefault(_fr3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// list of available languages
	var enabledLanguages = exports.enabledLanguages = ['en', 'fr'];

	// this object will have language-specific data added to it which will be placed in the state when that language is active
	// if localization data get to big, stop importing in all languages and switch to using API requests to load upon switching languages
	var localizationData = exports.localizationData = {};

	// here you bring in 'intl' browser polyfill and language-specific polyfills
	// (needed as safari doesn't have native intl: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
	// as well as react-intl's language-specific data
	// be sure to use static imports for language or else every language will be included in your build (adds ~800 kb)


	// need Intl polyfill, Intl not supported in Safari


	if (global.Intl) {
	  // Determine if the built-in `Intl` has the locale data we need.
	  if (!(0, _intlLocalesSupported2.default)(enabledLanguages)) {
	    // `Intl` exists, but it doesn't have the data we need, so load the
	    // polyfill and patch the constructors we need with the polyfill's.
	    global.Intl.NumberFormat = _intl2.default.NumberFormat;
	    global.Intl.DateTimeFormat = _intl2.default.DateTimeFormat;
	  }
	} else {
	  // No `Intl`, so use and load the polyfill.
	  global.Intl = _intl2.default;
	}

	// use this to allow nested messages, taken from docs:
	// https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object
	function flattenMessages() {
	  var nestedMessages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	  return Object.keys(nestedMessages).reduce(function (messages, key) {
	    var value = nestedMessages[key];
	    var prefixedKey = prefix ? prefix + '.' + key : key;

	    if (typeof value === 'string') {
	      messages[prefixedKey] = value; // eslint-disable-line no-param-reassign
	    } else {
	      Object.assign(messages, flattenMessages(value, prefixedKey));
	    }

	    return messages;
	  }, {});
	}

	// bring in intl polyfill, react-intl, and app-specific language data

	(0, _reactIntl.addLocaleData)(_en2.default);
	localizationData.en = _en4.default;
	localizationData.en.messages = flattenMessages(localizationData.en.messages);

	(0, _reactIntl.addLocaleData)(_fr2.default);
	localizationData.fr = _fr4.default;
	localizationData.fr.messages = flattenMessages(localizationData.fr.messages);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reduxDevtools = __webpack_require__(97);

	var _reduxDevtoolsLogMonitor = __webpack_require__(99);

	var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);

	var _reduxDevtoolsDockMonitor = __webpack_require__(98);

	var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _reduxDevtools.createDevTools)(_jsx(_reduxDevtoolsDockMonitor2.default, {
	  toggleVisibilityKey: 'ctrl-h',
	  changePositionKey: 'ctrl-w'
	}, void 0, _jsx(_reduxDevtoolsLogMonitor2.default, {})));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _d = __webpack_require__(72);

	var d3 = _interopRequireWildcard(_d);

	var _reactFauxDom = __webpack_require__(93);

	var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

	var _reactRedux = __webpack_require__(1);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BarChart = _react2.default.createClass({
	  displayName: 'BarChart',

	  mixins: [_reactFauxDom2.default.mixins.core, _reactFauxDom2.default.mixins.anim],

	  getInitialState: function getInitialState() {
	    return {
	      chart: '...loading'
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    setTimeout(function () {
	      console.log(window.getComputedStyle(_this.refs.chart, null).getPropertyValue('width'));
	      _this.buildChart(_this.props.pollData);
	    }, 100);
	    // // console.log(this.refs.svg.getDOMNode().offsetWidth)
	    // const x = ReactFauxDOM.createElement('div')
	    // x.textContent = 'fuck'
	    // this.setState({ chart: x.toReact() })
	    // // this.buildChart(this.props.pollData)
	    // this.refs.rootView.measure((ox, oy, width, height) => {
	    //   this.setState({ rootViewHeight: height })
	    // })
	  },
	  buildChart: function buildChart(_ref) {
	    var _this2 = this;

	    var entries = _ref.entries;

	    var containingDivWidth = window.getComputedStyle(this.refs.chart, null).getPropertyValue('width');
	    containingDivWidth = Number(containingDivWidth.replace(/[a-z]*/gi, ''));
	    var height = containingDivWidth / 16 * 10;

	    var pollEntries = entries;
	    var that = this;
	    var fauxDOM = _reactFauxDom2.default.createElement('div');
	    // const fauxDOM = this.connectFauxDOM('div.renderedD3', 'chart')
	    var padding = { left: 30, top: 10, right: 10, bottom: 20 };
	    var chartWidth = containingDivWidth - (padding.left + padding.right);
	    var chartHeight = height - (padding.top + padding.bottom);

	    var xScale = d3.scaleBand().rangeRound([0, chartWidth]).domain(pollEntries.map(function (entry) {
	      return entry.title;
	    })).paddingOuter(0.05).padding(0.05);

	    var yScale = d3.scaleLinear().range([chartHeight, 0]).domain(getYScaleDomain());

	    var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain([0, pollEntries.length]);

	    var xAxis = d3.axisBottom(xScale);
	    var yAxis = d3.axisLeft(yScale);

	    var chart = d3.select(fauxDOM).append('svg').attr('width', chartWidth + padding.left + padding.right).attr('height', chartHeight + padding.top + padding.bottom).style('background-color', 'white');

	    chart = chart.append('g').classed('inner-chart', true).attr('transform', 'translate(' + padding.left + ', ' + padding.top + ')').attr('width', chartWidth).attr('height', chartHeight);

	    var bars = chart.selectAll('rect').data(pollEntries).enter().append('rect').attr('fill', function (entry) {
	      return colorScale(entry.originalEntryIndex);
	    }).attr('width', xScale.bandwidth()).attr('height', getBarHeight).attr('x', function (entry) {
	      return xScale(entry.title);
	    }).attr('y', function (entry) {
	      return yScale(entry.votes.length);
	    }).on('click', callOnBarClickEvent);

	    var xAxisElement = chart.append('g').classed('x axis', true).attr('transform', 'translate(0, ' + chartHeight + ')').attr('shape-rendering', 'crispEdges').call(xAxis);

	    var yAxisElement = chart.append('g').classed('y axis', true).attr('transform', 'translate(0, 0)').attr('shape-rendering', 'crispEdges').call(yAxis);

	    function getYScaleDomain() {
	      var lowestVotedBar = d3.min(pollEntries, function (entry) {
	        return entry.votes.length;
	      });
	      var heighestVotedBar = d3.max(pollEntries, function (entry) {
	        return entry.votes.length;
	      });
	      return [lowestVotedBar > 0 ? 0 : -1, heighestVotedBar > 0 ? heighestVotedBar : 1];
	    }

	    function getBarHeight(entry) {
	      return chartHeight - yScale(entry.votes.length);
	    }

	    function callOnBarClickEvent(bar) {
	      var eventCallback = that.props.barClickedEvent;
	      if (eventCallback) {
	        eventCallback(bar, updateVotedOnBars.bind(this));
	      }
	    }

	    function updateVotedOnBars() {
	      pollEntries = that.props.pollData.entries;
	      var transitionDuration = 500;

	      xScale.domain(pollEntries.map(function (entry) {
	        return entry.title;
	      }));
	      yScale.domain(getYScaleDomain());

	      var counter = 0;

	      bars.data(that.props.pollData.entries).transition().duration(transitionDuration).attr('fill', function (entry) {
	        return colorScale(entry.originalEntryIndex);
	      }).attr('height', function (entry) {
	        return chartHeight - yScale(entry.votes.length);
	      }).attr('x', function (entry) {
	        return xScale(entry.title);
	      }).attr('y', function (entry) {
	        return yScale(entry.votes.length);
	      }).ease(function (frame) {
	        // this is a hack so the chart gets updated every time the first entry gets updated
	        // beginning of hack
	        counter++;
	        if (counter >= entries.length) {
	          counter = 0;
	          that.updateChartState(fauxDOM);
	        }
	        // end of hack
	        return ease(frame);
	      }).on('end', function () {
	        // call the x and y axis elements to make the text crisp again
	        xAxisElement.call(xAxis);
	        yAxisElement.call(yAxis);

	        that.updateChartState(fauxDOM);
	      });

	      xAxisElement.transition().duration(transitionDuration).ease(ease).call(xAxis);

	      yAxisElement.transition().duration(transitionDuration).ease(ease).call(yAxis);

	      function ease(frame) {
	        /* make these in the options when setting up the chart */
	        // return d3.easeBounceInOut(frame)
	        // return d3.easeCubicInOut(frame)
	        return d3.easeExpOut(frame);
	      }
	    }

	    this.updateChartState(fauxDOM);

	    if (that.props.setTriggerUpdate) {
	      that.props.setTriggerUpdate(function () {
	        _this2.buildChart(_this2.props.pollData);
	      });
	    }
	  },
	  updateChartState: function updateChartState(fauxDOM) {
	    this.setState({ chart: fauxDOM.toReact() });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      { className: 'renderedD3', id: 'renderedD3', style: { width: '100%' }, ref: 'chart' },
	      this.state.chart
	    );
	  }
	});

	exports.default = (0, _reactRedux.connect)()(BarChart);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _FlatButton = __webpack_require__(27);

	var _FlatButton2 = _interopRequireDefault(_FlatButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ShareButtons(props) {
	  var baseURL = 'http://192.168.1.8:8000/polls/';
	  var facebook = 'http://www.facebook.com/sharer.php?u=';
	  var googlePlus = 'https://plus.google.com/share?url=';
	  var twitter = 'https://twitter.com/share?url=';

	  function shareOn(socialMediaLink) {
	    openUrlInNewTab(buildShareURL(socialMediaLink));
	  }

	  function buildShareURL(socialMediaLink) {
	    return '' + socialMediaLink + baseURL + props.poll.cuid;
	  }

	  function openUrlInNewTab(url) {
	    var win = window.open(url, '_blank');
	    win.focus();
	  }

	  return _jsx('div', {}, void 0, _jsx('span', {}, void 0, 'Share:', _jsx(_FlatButton2.default, {
	    label: 'Facebook',
	    onClick: function onClick() {
	      return shareOn(facebook);
	    },
	    primary: true
	  }), _jsx(_FlatButton2.default, {
	    label: 'Google+',
	    onClick: function onClick() {
	      return shareOn(googlePlus);
	    },
	    primary: true
	  }), _jsx(_FlatButton2.default, {
	    label: 'Twitter',
	    onClick: function onClick() {
	      return shareOn(twitter);
	    },
	    primary: true
	  })));
	}

	exports.default = ShareButtons;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _ref = _jsx("div", {}, void 0, _jsx("center", {}, void 0, _jsx("img", {
	  src: "https://plnami.blob.core.windows.net/media/2016/07/US_NEWS_CLINTON_14_PH-e1470081012692-800x500.jpg",
	  alt: "crooked hillary smirking about illegally deleting emails"
	}), _jsx("h3", {}, void 0, "What was it you were looking for?")), _jsx("h5", {}, void 0, "404: Page not found"));

	function _404() {
	  return _ref;
	}

	exports.default = _404;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(1);

	var _reactRouter = __webpack_require__(2);

	var _materialUi = __webpack_require__(9);

	var _voting_tools = __webpack_require__(7);

	var _BarChart = __webpack_require__(16);

	var _BarChart2 = _interopRequireDefault(_BarChart);

	var _IncompletePollDialog = __webpack_require__(56);

	var _IncompletePollDialog2 = _interopRequireDefault(_IncompletePollDialog);

	var _PollActions = __webpack_require__(6);

	var _PollReducer = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CreatePollPage = function (_Component) {
	  _inherits(CreatePollPage, _Component);

	  function CreatePollPage(props) {
	    _classCallCheck(this, CreatePollPage);

	    var _this = _possibleConstructorReturn(this, (CreatePollPage.__proto__ || Object.getPrototypeOf(CreatePollPage)).call(this, props));

	    var poll = props.poll || {
	      title: '',
	      author: '',
	      authorID: '',
	      sortOrder: 'None',
	      entries: [],
	      cuid: '0',
	      dateCreated: Date.now()
	    };

	    _this.state = {
	      entryInput: '',
	      dialog: null,
	      poll: poll,
	      triggerPollUpdate: function triggerPollUpdate() {}
	    };
	    return _this;
	  }

	  _createClass(CreatePollPage, [{
	    key: 'setTriggerPollUpdate',
	    value: function setTriggerPollUpdate(triggerPollUpdate) {
	      this.setState({ triggerPollUpdate: triggerPollUpdate });
	    }
	  }, {
	    key: 'handleTitleInputChange',
	    value: function handleTitleInputChange(action) {
	      action.preventDefault();
	      this.state.poll.title = action.target.value;
	      this.setState({ poll: this.state.poll });
	    }
	  }, {
	    key: 'handleEntryInputChange',
	    value: function handleEntryInputChange(action) {
	      this.setState({ entryInput: action.target.value });
	    }
	  }, {
	    key: 'handleEntryInputKeyDown',
	    value: function handleEntryInputKeyDown(action) {
	      if (action.which === 13) {
	        this.addEntry(this.state.entryInput);
	      }
	    }
	  }, {
	    key: 'addEntryButtonClicked',
	    value: function addEntryButtonClicked() {
	      this.addEntry(this.state.entryInput);
	    }
	  }, {
	    key: 'addEntry',
	    value: function addEntry(title) {
	      var entries = this.state.poll.entries;
	      if (this.findEntry(title) === -1 && title.length > 0) {
	        entries.push(this.createEntry(title, entries.length));
	      } else {
	        entries = this.deleteEntry(entries, title);
	      }
	      this.state.poll.entries = entries;
	      (0, _voting_tools.sortPollEntries)(this.state.poll);
	      this.setState({ entryInput: '' });
	      this.state.triggerPollUpdate();
	    }
	  }, {
	    key: 'findEntry',
	    value: function findEntry(title) {
	      var entries = this.state.poll.entries;
	      for (var i = 0; i < entries.length; i++) {
	        if (entries[i].title === title) {
	          return i;
	        }
	      }
	      return -1;
	    }
	  }, {
	    key: 'deleteEntry',
	    value: function deleteEntry(entries, title) {
	      var newEntries = entries.filter(function (current) {
	        return current.title !== title;
	      }).sort(function (current, next) {
	        return current.originalEntryIndex > next.originalEntryIndex;
	      });

	      // set the originalEntryIndexes to the right number
	      for (var i = 0; i < newEntries.length; i++) {
	        newEntries[i].originalEntryIndex = i;
	      }

	      return newEntries;
	    }
	  }, {
	    key: 'createEntry',
	    value: function createEntry(title, originalEntryIndex) {
	      return {
	        title: title,
	        votes: [],
	        originalEntryIndex: originalEntryIndex
	      };
	    }
	  }, {
	    key: 'sortOrderChanged',
	    value: function sortOrderChanged(event, index, value) {
	      this.state.poll.sortOrder = value;
	      (0, _voting_tools.sortPollEntries)(this.state.poll);
	      this.state.triggerPollUpdate();
	    }
	  }, {
	    key: 'createPoll',
	    value: function createPoll() {
	      var poll = this.state.poll;
	      if (poll.title && poll.entries.length > 1) {
	        this.props.dispatch(this.props.editToggled ? (0, _PollActions.updatePollRequest)(poll) : (0, _PollActions.createPollRequest)(poll));
	        _reactRouter.browserHistory.push('/');
	      } else {
	        this.alertIncompletePoll(poll);
	      }
	    }
	  }, {
	    key: 'alertIncompletePoll',
	    value: function alertIncompletePoll(poll) {
	      var _this2 = this;

	      var openDialog = function openDialog(message) {
	        return _this2.setState({ dialog: message });
	      };
	      if (!poll.title) {
	        openDialog('no title');
	      } else {
	        openDialog('you need atleast two entries');
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      return _jsx('div', {}, void 0, _jsx(_materialUi.TextField, {
	        floatingLabelText: 'Poll Title',
	        fullWidth: true,
	        onChange: this.handleTitleInputChange.bind(this),
	        value: this.state.poll.title
	      }), _jsx('div', {}, void 0, _jsx(_BarChart2.default, {
	        pollData: this.state.poll,
	        setTriggerUpdate: this.setTriggerPollUpdate.bind(this)
	      })), _jsx('form', {
	        onSubmit: function onSubmit(action) {
	          return action.preventDefault();
	        }
	      }, void 0, _jsx(_materialUi.TextField, {
	        floatingLabelText: 'Entry Name',
	        onChange: this.handleEntryInputChange.bind(this),
	        onKeyDown: this.handleEntryInputKeyDown.bind(this),
	        value: this.state.entryInput,
	        fullWidth: true
	      }), _jsx(_materialUi.RaisedButton, {
	        label: 'Add/Remove Entry',
	        primary: true,
	        fullWidth: true,
	        onClick: this.addEntryButtonClicked.bind(this)
	      }), _jsx(_materialUi.SelectField, {
	        floatingLabelText: 'Sort by',
	        value: this.state.poll.sortOrder,
	        onChange: this.sortOrderChanged.bind(this),
	        autoWidth: false,
	        fullWidth: true
	      }, void 0, _voting_tools.sortOptions.map(function (option) {
	        return _jsx(_materialUi.MenuItem, {
	          value: option,
	          primaryText: option
	        }, option);
	      })), _jsx(_materialUi.RaisedButton, {
	        label: 'Save',
	        primary: true,
	        fullWidth: true,
	        onClick: this.createPoll.bind(this)
	      })), _jsx('div', {}, void 0, _jsx(_IncompletePollDialog2.default, {
	        dialog: this.state.dialog ? this.state.dialog : '',
	        close: function close() {
	          return _this3.setState({ dialog: null });
	        }
	      })));
	    }
	  }]);

	  return CreatePollPage;
	}(_react.Component);

	function mapStateToProps(state, props) {
	  var user = (0, _PollReducer.getUser)(state) || {};
	  var poll = (0, _PollReducer.getPoll)(state, props.params.cuid) || {};
	  poll = user.github_id === poll.authorID ? poll : null;
	  return {
	    editToggled: !!poll,
	    poll: poll
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(CreatePollPage);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(1);

	var _PollReducer = __webpack_require__(4);

	var _PollListItem = __webpack_require__(8);

	var _PollListItem2 = _interopRequireDefault(_PollListItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function PollDetailPage(props) {
	  return _jsx(_PollListItem2.default, {
	    poll: props.poll
	  });
	}

	function mapStateToProps(state, props) {
	  return {
	    poll: (0, _PollReducer.getPoll)(state, props.params.cuid)
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(PollDetailPage);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(1);

	var _PollReducer = __webpack_require__(4);

	var _PollList = __webpack_require__(57);

	var _PollList2 = _interopRequireDefault(_PollList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function PollListPage(props) {
	  return _jsx('div', {}, void 0, _jsx(_PollList2.default, {
	    polls: props.polls
	  }));
	}

	function mapStateToProps(state) {
	  return {
	    polls: (0, _PollReducer.getPolls)(state)
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(PollListPage);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(2);

	var _reactRedux = __webpack_require__(1);

	var _EditablePollListItem = __webpack_require__(55);

	var _EditablePollListItem2 = _interopRequireDefault(_EditablePollListItem);

	var _PollActions = __webpack_require__(6);

	var _PollReducer = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function UserPollsPage(props) {
	  function deletPoll(_ref) {
	    var cuid = _ref.cuid;

	    props.dispatch((0, _PollActions.deletePollRequest)(cuid));
	  }

	  function editPoll(_ref2) {
	    var cuid = _ref2.cuid;

	    _reactRouter.browserHistory.push('/polls/create/' + cuid);
	  }

	  function pollList() {
	    return props.polls.map(function (poll) {
	      return _jsx(_EditablePollListItem2.default, {
	        poll: poll,
	        'delete': deletPoll,
	        edit: editPoll,
	        showModifyButtons: Boolean(props.user && poll.authorID === props.user.github_id)
	      }, poll.cuid);
	    });
	  }

	  return _jsx('div', {}, void 0, pollList());
	}

	function mapStateToProps(state, props) {
	  var user = (0, _PollReducer.getUser)(state) || null;
	  return {
	    polls: (0, _PollReducer.getUsersPolls)(state, props.params.userid),
	    user: user
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(UserPollsPage);

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.API_URL = undefined;
	exports.default = callApi;

	var _isomorphicFetch = __webpack_require__(78);

	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

	var _config = __webpack_require__(10);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var API_URL = exports.API_URL = typeof window === 'undefined' || process.env.NODE_ENV === 'test' ? process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || _config2.default.port) + '/api' : '/api';

	function callApi(endpoint) {
	  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
	  var body = arguments[2];

	  return (0, _isomorphicFetch2.default)(API_URL + '/' + endpoint, {
	    headers: { 'content-type': 'application/json' },
	    credentials: 'same-origin',
	    method: method,
	    body: JSON.stringify(body)
	  }).then(function (response) {
	    return response.json().then(function (json) {
	      return { json: json, response: response };
	    });
	  }).then(function (_ref) {
	    var json = _ref.json;
	    var response = _ref.response;

	    if (!response.ok) {
	      return Promise.reject(json);
	    }

	    return json;
	  }).then(function (response) {
	    return response;
	  }, function (error) {
	    return error;
	  });
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (varName) {
	  if (!process.env[varName]) {
	    loadEnvs();
	  }

	  return process.env[varName];
	};

	var _privateEnvVariables = __webpack_require__(69);

	var _privateEnvVariables2 = _interopRequireDefault(_privateEnvVariables);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function loadEnvs() {
	  Object.keys(_privateEnvVariables2.default).forEach(function (current) {
	    process.env[current] = process.env[current] || _privateEnvVariables2.default[current];
	  });
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("cuid");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("material-ui/Card");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("material-ui/FlatButton");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }(); /* eslint-disable global-require */


	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(2);

	var _App = __webpack_require__(45);

	var _App2 = _interopRequireDefault(_App);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// require.ensure polyfill for node
	if (false) {
	  require.ensure = function requireModule(deps, callback) {
	    callback(require);
	  };
	}

	/* Workaround for async react routes to work with react-hot-reloader till
	  https://github.com/reactjs/react-router/issues/2182 and
	  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
	 */
	if (process.env.NODE_ENV !== 'production') {
	  // Require async routes only in development for react-hot-reloader to work.
	  __webpack_require__(21);
	  __webpack_require__(19);
	  __webpack_require__(20);
	  __webpack_require__(22);
	  __webpack_require__(18);
	}

	// react-router setup with code-splitting
	// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
	exports.default = _jsx(_reactRouter.Route, {
	  path: '/',
	  component: _App2.default
	}, void 0, _jsx(_reactRouter.IndexRoute, {
	  getComponent: function getComponent(nextState, cb) {
	    Promise.resolve().catch(function(err) { __webpack_require__.oe(err); }).then((function (require) {
	      cb(null, __webpack_require__(21).default);
	    }).bind(null, __webpack_require__));
	  }
	}), _jsx(_reactRouter.Route, {
	  path: 'polls'
	}, void 0, _jsx(_reactRouter.Route, {
	  path: 'create(/:cuid)',
	  getComponent: function getComponent(nextState, cb) {
	    Promise.resolve().catch(function(err) { __webpack_require__.oe(err); }).then((function (require) {
	      cb(null, __webpack_require__(19).default);
	    }).bind(null, __webpack_require__));
	  }
	}), _jsx(_reactRouter.Route, {
	  path: ':cuid',
	  getComponent: function getComponent(nextState, cb) {
	    Promise.resolve().catch(function(err) { __webpack_require__.oe(err); }).then((function (require) {
	      cb(null, __webpack_require__(20).default);
	    }).bind(null, __webpack_require__));
	  }
	}), _jsx(_reactRouter.Route, {
	  path: 'user'
	}, void 0, _jsx(_reactRouter.Route, {
	  path: ':userid',
	  getComponent: function getComponent(nextState, cb) {
	    Promise.resolve().catch(function(err) { __webpack_require__.oe(err); }).then((function (require) {
	      cb(null, __webpack_require__(22).default);
	    }).bind(null, __webpack_require__));
	  }
	}))), _jsx(_reactRouter.Route, {
	  path: '*',
	  getComponent: function getComponent(nextState, cb) {
	    Promise.resolve().catch(function(err) { __webpack_require__.oe(err); }).then((function (require) {
	      cb(null, __webpack_require__(18).default);
	    }).bind(null, __webpack_require__));
	  }
	}));

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.configureStore = configureStore;

	var _redux = __webpack_require__(28);

	var _reduxThunk = __webpack_require__(100);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	var _DevTools = __webpack_require__(15);

	var _DevTools2 = _interopRequireDefault(_DevTools);

	var _reducers = __webpack_require__(60);

	var _reducers2 = _interopRequireDefault(_reducers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Main store function
	 */
	function configureStore() {
	  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  // Middleware and store enhancers
	  var enhancers = [(0, _redux.applyMiddleware)(_reduxThunk2.default)];

	  if (process.env.CLIENT && process.env.NODE_ENV === 'development') {
	    // Enable DevTools only when rendering on client and during development.
	    enhancers.push(window.devToolsExtension ? window.devToolsExtension() : _DevTools2.default.instrument());
	  }

	  var store = (0, _redux.createStore)(_reducers2.default, initialState, _redux.compose.apply(undefined, enhancers));

	  // For hot reloading reducers
	  if (false) {
	    // Enable Webpack hot module replacement for reducers
	    module.hot.accept('./reducers', function () {
	      var nextReducer = require('./reducers').default; // eslint-disable-line global-require
	      store.replaceReducer(nextReducer);
	    });
	  }

	  return store;
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _poll = __webpack_require__(66);

	var _poll2 = _interopRequireDefault(_poll);

	var _post = __webpack_require__(67);

	var _post2 = _interopRequireDefault(_post);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = new _express.Router();

	router.use(_poll2.default);
	router.use(_post2.default);

	exports.default = router;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _connectMongo = __webpack_require__(71);

	var _connectMongo2 = _interopRequireDefault(_connectMongo);

	var _expressSession = __webpack_require__(73);

	var _expressSession2 = _interopRequireDefault(_expressSession);

	var _passport = __webpack_require__(88);

	var _passport2 = _interopRequireDefault(_passport);

	var _user = __webpack_require__(64);

	var _user2 = _interopRequireDefault(_user);

	var _mongoose = __webpack_require__(5);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _envVariables = __webpack_require__(24);

	var _envVariables2 = _interopRequireDefault(_envVariables);

	var _github = __webpack_require__(65);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function verifyCallback(accessToken, refreshToken, profile, done) {
	  process.nextTick(function () {
	    _user2.default.findOne({ github_id: profile.id }, function (err, user) {
	      if (!user) {
	        createNewUser(profile).save(done);
	      } else {
	        done(err, user);
	      }
	    });
	  });
	}

	function createNewUser(profile) {
	  return new _user2.default(_defineProperty({
	    username: profile.displayName
	  }, profile.provider + '_id', profile.id));
	}

	var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);
	var router = new _express.Router();

	var sessionSettings = {
	  secret: (0, _envVariables2.default)('EXPRESS_SESSION_SECRET'),
	  resave: false,
	  saveUnititialized: false,
	  store: new MongoStore({ mongooseConnection: _mongoose2.default.connection })
	};

	_passport2.default.serializeUser(function (user, done) {
	  done(null, user._id);
	});

	_passport2.default.deserializeUser(function (id, done) {
	  _user2.default.findOne({ _id: id }, function (err, user) {
	    done(err, user);
	  });
	});

	_passport2.default.use((0, _github.strategy)(verifyCallback));

	router.use((0, _expressSession2.default)(sessionSettings));
	router.use(_passport2.default.initialize());
	router.use(_passport2.default.session());

	router.use('/auth', (0, _github.authRoutes)(_passport2.default));

	router.get('/auth/logout', function (req, res) {
	  req.logOut();
	  res.redirect('/');
	});

	exports.default = router;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fetchComponentData = fetchComponentData;

	var _promiseUtils = __webpack_require__(70);

	function fetchComponentData(store, components, params) {
	  var needs = components.reduce(function (prev, current) {
	    return (current.need || []).concat((current.WrappedComponent && current.WrappedComponent.need !== current.need ? current.WrappedComponent.need : []) || []).concat(prev);
	  }, []);

	  return (0, _promiseUtils.sequence)(needs, function (need) {
	    return store.dispatch(need(params, store.getState()));
	  });
	} /*
	  Utility function to fetch required data for component to render in server side.
	  This was inspired from https://github.com/caljrimmer/isomorphic-redux-app/blob/73e6e7d43ccd41e2eb557a70be79cebc494ee54b/src/common/api/fetchComponentDataBeforeRender.js
	  */

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var webpack = __webpack_require__(13);
	var cssnext = __webpack_require__(90);
	var postcssFocus = __webpack_require__(91);
	var postcssReporter = __webpack_require__(92);

	module.exports = {
	  devtool: 'cheap-module-eval-source-map',

	  entry: {
	    app: ['eventsource-polyfill', 'webpack-hot-middleware/client', 'webpack/hot/only-dev-server', 'react-hot-loader/patch', './client/index.js'],
	    vendor: ['react', 'react-dom']
	  },

	  output: {
	    path: __dirname,
	    filename: 'app.js',
	    publicPath: 'http://0.0.0.0:8000/'
	  },

	  resolve: {
	    extensions: ['', '.js', '.jsx'],
	    modules: ['client', 'node_modules']
	  },

	  module: {
	    loaders: [{
	      test: /\.css$/,
	      exclude: /node_modules/,
	      loader: 'style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader'
	    }, {
	      test: /\.css$/,
	      include: /node_modules/,
	      loaders: ['style-loader', 'css-loader']
	    }, {
	      test: /\.jsx*$/,
	      exclude: [/node_modules/, /.+\.config.js/],
	      loader: 'babel'
	    }, {
	      test: /\.(jpe?g|gif|png|svg)$/i,
	      loader: 'url-loader?limit=10000'
	    }, {
	      test: /\.json$/,
	      loader: 'json-loader'
	    }]
	  },

	  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.optimize.CommonsChunkPlugin({
	    name: 'vendor',
	    minChunks: Infinity,
	    filename: 'vendor.js'
	  }), new webpack.DefinePlugin({
	    'process.env': {
	      CLIENT: JSON.stringify(true),
	      'NODE_ENV': JSON.stringify('development')
	    }
	  })],

	  postcss: function postcss() {
	    return [postcssFocus(), cssnext({
	      browsers: ['last 2 versions', 'IE > 10']
	    }), postcssReporter({
	      clearMessages: true
	    })];
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = require("method-override");

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = require("webpack-dev-middleware");

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = require("webpack-hot-middleware");

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  locale: 'en',
	  messages: {
	    siteTitle: 'POLL IT',
	    addPost: 'Add Poll',
	    switchLanguage: 'Switch Language',
	    twitterMessage: 'We are on Twitter',
	    by: 'By',
	    deletePost: 'Delete Post',
	    createNewPost: 'Create new post',
	    authorName: 'Author\'s Name',
	    postTitle: 'Post Title',
	    postContent: 'Post Content',
	    submit: 'Submit',
	    comment: 'user {name} {value, plural,\n    \t  =0 {does not have any comments}\n    \t  =1 {has # comment}\n    \t  other {has # comments}\n    \t}',
	    HTMLComment: 'user <b style=\'font-weight: bold\'>{name} </b> {value, plural,\n    \t  =0 {does not have <i style=\'font-style: italic\'>any</i> comments}\n    \t  =1 {has <i style=\'font-style: italic\'>#</i> comment}\n    \t  other {has <i style=\'font-style: italic\'>#</i> comments}\n    \t}',
	    nestedDateComment: 'user {name} {value, plural,\n    \t  =0 {does not have any comments}\n    \t  =1 {has # comment}\n    \t  other {has # comments}\n    \t} as of {date}'
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  locale: 'fr',
	  messages: {
	    siteTitle: 'MERN blog de démarrage',
	    addPost: 'Ajouter Poster',
	    switchLanguage: 'Changer de langue',
	    twitterMessage: 'Nous sommes sur Twitter',
	    by: 'Par',
	    deletePost: 'Supprimer le message',
	    createNewPost: 'Créer un nouveau message',
	    authorName: 'Nom de l\'auteur',
	    postTitle: 'Titre de l\'article',
	    postContent: 'Contenu après',
	    submit: 'Soumettre',
	    comment: 'user {name} {value, plural,\n    \t  =0 {does not have any comments}\n    \t  =1 {has # comment}\n    \t  other {has # comments}\n    \t} (in real app this would be translated to French)',
	    HTMLComment: 'user <b style=\'font-weight: bold\'>{name} </b> {value, plural,\n    \t  =0 {does not have <i style=\'font-style: italic\'>any</i> comments}\n    \t  =1 {has <i style=\'font-style: italic\'>#</i> comment}\n    \t  other {has <i style=\'font-style: italic\'>#</i> comments}\n    \t} (in real app this would be translated to French)',
	    nestedDateComment: 'user {name} {value, plural,\n  \t\t  =0 {does not have any comments}\n  \t\t  =1 {has # comment}\n  \t\t  other {has # comments}\n  \t\t} as of {date} (in real app this would be translated to French)'
	  }
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.App = undefined;

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(1);

	var _colors = __webpack_require__(85);

	var _getMuiTheme = __webpack_require__(86);

	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

	var _MuiThemeProvider = __webpack_require__(84);

	var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

	var _App = {
	  "container": "_4uEyKcd5WHob5qPzotT7"
	};

	var _App2 = _interopRequireDefault(_App);

	var _reactHelmet = __webpack_require__(12);

	var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

	var _DevTools = __webpack_require__(15);

	var _DevTools2 = _interopRequireDefault(_DevTools);

	var _Header = __webpack_require__(51);

	var _Header2 = _interopRequireDefault(_Header);

	var _Footer = __webpack_require__(50);

	var _Footer2 = _interopRequireDefault(_Footer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	// import { darkBaseTheme } from 'material-ui/styles/baseThemes/darkBaseTheme'


	// Import Style


	// Import Components


	var enableDevTools = false;

	var muiTheme = (0, _getMuiTheme2.default)({
	  palette: {
	    accent1Color: _colors.deepOrange500
	  }
	});

	var _ref = _jsx(_DevTools2.default, {});

	var _ref2 = _jsx(_Header2.default, {});

	var _ref3 = _jsx(_Footer2.default, {});

	var App = exports.App = function (_Component) {
	  _inherits(App, _Component);

	  function App(props) {
	    _classCallCheck(this, App);

	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

	    _this.state = { isMounted: false };
	    return _this;
	  }

	  _createClass(App, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.setState({ isMounted: true }); // eslint-disable-line
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _jsx(_MuiThemeProvider2.default, {
	        muiTheme: muiTheme
	      }, void 0, _jsx('div', {}, void 0, this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && _ref && enableDevTools, _jsx('div', {}, void 0, _jsx(_reactHelmet2.default, {
	        title: 'MERN Starter - Blog App',
	        titleTemplate: '%s - Blog App',
	        meta: [{ charset: 'utf-8' }, {
	          'http-equiv': 'X-UA-Compatible',
	          content: 'IE=edge'
	        }, {
	          name: 'viewport',
	          content: 'width=device-width, initial-scale=1'
	        }]
	      }), _ref2, _jsx('div', {
	        className: _App2.default.container
	      }, void 0, this.props.children), _ref3)));
	    }
	  }]);

	  return App;
	}(_react.Component);

	// Retrieve data from store as props
	function mapStateToProps(store) {
	  return {
	    intl: store.intl,
	    user: store.user
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(App);

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toggleAddPost = toggleAddPost;
	// Export Constants
	var TOGGLE_ADD_POST = exports.TOGGLE_ADD_POST = 'TOGGLE_ADD_POST';
	var LOGIN_WITH_GITHUB = exports.LOGIN_WITH_GITHUB = 'LOGIN_WITH_GITHUB';

	// Export Actions
	function toggleAddPost() {
	  return {
	    type: TOGGLE_ADD_POST
	  };
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getShowAddPost = undefined;

	var _AppActions = __webpack_require__(46);

	// Initial State
	var initialState = {
	  showAddPost: false
	}; // Import Actions


	var AppReducer = function AppReducer() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	  var action = arguments[1];

	  switch (action.type) {
	    case _AppActions.TOGGLE_ADD_POST:
	      return {
	        showAddPost: !state.showAddPost
	      };

	    default:
	      return state;
	  }
	};

	/* Selectors */

	// Get showAddPost
	var getShowAddPost = exports.getShowAddPost = function getShowAddPost(state) {
	  return state.app.showAddPost;
	};

	// Export Reducer
	exports.default = AppReducer;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(2);

	var _IconButton = __webpack_require__(81);

	var _IconButton2 = _interopRequireDefault(_IconButton);

	var _IconMenu = __webpack_require__(82);

	var _IconMenu2 = _interopRequireDefault(_IconMenu);

	var _moreVert = __webpack_require__(87);

	var _moreVert2 = _interopRequireDefault(_moreVert);

	var _MenuItem = __webpack_require__(83);

	var _MenuItem2 = _interopRequireDefault(_MenuItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var styles = {
	  dropdownMenu: {
	    width: '200px',
	    anchor: 'center'
	  }
	};

	var _ref = _jsx(_IconButton2.default, {}, void 0, _jsx(_moreVert2.default, {}));

	function LoggedInDropdownButton(props) {
	  function logout() {
	    window.location.href = '/auth/logout';
	  }

	  function user() {
	    redirect('/polls/user/' + props.userID);
	  }

	  function redirect(url) {
	    _reactRouter.browserHistory.push(url);
	  }

	  return _jsx(_IconMenu2.default, {
	    iconButtonElement: _ref,
	    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
	    targetOrigin: { horizontal: 'right', vertical: 'top' },
	    menuStyle: styles.dropdownMenu
	  }, void 0, _jsx(_MenuItem2.default, {
	    primaryText: 'Create Poll',
	    onClick: function onClick() {
	      return redirect('/polls/create');
	    }
	  }), _jsx(_MenuItem2.default, {
	    primaryText: 'My Polls',
	    onClick: user
	  }), _jsx(_MenuItem2.default, {
	    primaryText: 'Logout',
	    onClick: logout
	  }));
	}

	exports.default = LoggedInDropdownButton;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _FlatButton = __webpack_require__(27);

	var _FlatButton2 = _interopRequireDefault(_FlatButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function LoginButton() {
	  function login() {
	    window.location.href = '/auth/github';
	  }

	  return _jsx(_FlatButton2.default, {
	    label: 'Login with Github',
	    onClick: login
	  });
	}

	exports.default = LoginButton;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	// Import Style


	exports.Footer = Footer;

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _Footer = {
	  "footer": "_3vPEi87A1wyh1iLR3bsBGf",
	  "contact-icons": "Y1uBol8EFtQfp5YRYtt-t",
	  "heart": "_3wOaYYNZRpYYBoiUdrVYm9"
	};

	var _Footer2 = _interopRequireDefault(_Footer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _ref = _jsx('a', {
	  href: 'http://caleb272.github.io/portfolio/',
	  target: '_blank'
	}, void 0, ' Caleb Martin');

	function Footer() {
	  return _jsx('div', {
	    className: _Footer2.default.footer
	  }, void 0, _jsx('span', {}, void 0, 'Made with ', _jsx('i', {
	    className: _Footer2.default.heart + ' fa fa-heart',
	    'aria-hidden': 'true'
	  }), ' by', _ref), _jsx('a', {
	    href: 'https://github.com/caleb272',
	    target: '_blank'
	  }, void 0, _jsx('i', {
	    className: _Footer2.default['contact-icons'] + ' contact-icons fa fa-2x fa-github-alt',
	    'aria-hidden': 'true'
	  })));
	}

	exports.default = Footer;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	exports.Header = Header;

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(2);

	var _reactRedux = __webpack_require__(1);

	var _LoginButton = __webpack_require__(49);

	var _LoginButton2 = _interopRequireDefault(_LoginButton);

	var _LoggedInDropdownButton = __webpack_require__(48);

	var _LoggedInDropdownButton2 = _interopRequireDefault(_LoggedInDropdownButton);

	var _AppBar = __webpack_require__(80);

	var _AppBar2 = _interopRequireDefault(_AppBar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _ref = _jsx(_LoginButton2.default, {});

	function Header(props) {
	  function loggedIn() {
	    return _jsx(_LoggedInDropdownButton2.default, {
	      userID: props.user.userProfile.github_id
	    });
	  }
	  return _jsx(_AppBar2.default, {
	    title: 'Poll IT',
	    onTitleTouchTap: function onTitleTouchTap() {
	      return _reactRouter.browserHistory.push('/');
	    },
	    showMenuIconButton: false,
	    iconElementRight: props.user.userProfile ? loggedIn() : _ref
	  });
	}

	/* old shit */
	/*
	<div className={styles.header}>
	  <div className={styles.content}>
	    <h1 className={styles['site-title']}>
	      <Link to="/" id="siteTitle">POLL IT</Link>
	    </h1>
	    {
	      // use this for the polls/user page to change to 404 if the user isnt found
	      // context.router.isActive('/', true)
	      //   ? <LoginButton />
	      //   : null
	    }
	    {!props.user ?
	      <LoginButton />
	      :
	      <div>
	        <LogoutButton />
	        <MyPollsButton userID={props.user.github_id} />
	        <CreatePollButton />
	      </div>
	    }
	  </div>
	</div>
	*/

	Header.contextTypes = {
	  router: _react2.default.PropTypes.object
	};

	function mapStateToProps(state) {
	  return {
	    user: state.user
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(Header);

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SWITCH_LANGUAGE = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.switchLanguage = switchLanguage;

	var _setup = __webpack_require__(14);

	// Export Constants
	var SWITCH_LANGUAGE = exports.SWITCH_LANGUAGE = 'SWITCH_LANGUAGE';

	function switchLanguage(newLang) {
	  return _extends({
	    type: SWITCH_LANGUAGE
	  }, _setup.localizationData[newLang]);
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _setup = __webpack_require__(14);

	var _IntlActions = __webpack_require__(52);

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var initLocale = global.navigator && global.navigator.language || 'en';

	var initialState = _extends({
	  locale: initLocale,
	  enabledLanguages: _setup.enabledLanguages
	}, _setup.localizationData[initLocale] || {});

	var IntlReducer = function IntlReducer() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	  var action = arguments[1];

	  switch (action.type) {
	    case _IntlActions.SWITCH_LANGUAGE:
	      {
	        var type = action.type;

	        var actionWithoutType = _objectWithoutProperties(action, ['type']); // eslint-disable-line


	        return _extends({}, state, actionWithoutType);
	      }

	    default:
	      return state;
	  }
	};

	exports.default = IntlReducer;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(1);

	var _BarChart = __webpack_require__(16);

	var _BarChart2 = _interopRequireDefault(_BarChart);

	var _PollReducer = __webpack_require__(4);

	var _PollActions = __webpack_require__(6);

	var _voting_tools = __webpack_require__(7);

	var _voting_tools2 = _interopRequireDefault(_voting_tools);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var VoteableBarChart = function (_Component) {
	  _inherits(VoteableBarChart, _Component);

	  function VoteableBarChart(props) {
	    _classCallCheck(this, VoteableBarChart);

	    var _this = _possibleConstructorReturn(this, (VoteableBarChart.__proto__ || Object.getPrototypeOf(VoteableBarChart)).call(this, props));

	    _this.state = {
	      triggerChartUpdate: null
	    };
	    return _this;
	  }

	  _createClass(VoteableBarChart, [{
	    key: 'setTriggerChartUpdate',
	    value: function setTriggerChartUpdate(triggerChartUpdate) {
	      this.setState({ triggerChartUpdate: triggerChartUpdate });
	    }
	  }, {
	    key: 'barClickedEvent',
	    value: function barClickedEvent(entry, updateVotedOnBars) {
	      var voterID = this.props.user ? this.props.user.github_id : this.props.clientIP;
	      _voting_tools2.default.voteOnPollEntries(voterID, entry.title, this.props.poll.entries);
	      (0, _voting_tools.sortPollEntries)(this.props.poll);
	      updateVotedOnBars();

	      // use the data on the client side to figure out what changes on the chart
	      // then once the server returns the data verify and update if necessary
	      this.props.dispatch((0, _PollActions.voteOnPollRequest)(this.props.poll.cuid, entry.title)).then(function () {
	        /*
	          you could update the users end with the response from the server
	          but its not realy necessary
	        */
	        // sortPollEntries(this.props.poll)
	        // updateVotedOnBars()
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _jsx('div', {}, void 0, _jsx(_BarChart2.default, {
	        pollData: this.props.poll,
	        barClickedEvent: this.barClickedEvent.bind(this),
	        setTriggerUpdate: this.setTriggerChartUpdate.bind(this)
	      }));
	    }
	  }]);

	  return VoteableBarChart;
	}(_react.Component);

	function mapStateToProps(state) {
	  return {
	    user: (0, _PollReducer.getUser)(state),
	    clientIP: (0, _PollReducer.getClientIP)(state)
	  };
	}

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(VoteableBarChart);

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _materialUi = __webpack_require__(9);

	var _PollListItem = __webpack_require__(8);

	var _PollListItem2 = _interopRequireDefault(_PollListItem);

	var _ShareButtons = __webpack_require__(17);

	var _ShareButtons2 = _interopRequireDefault(_ShareButtons);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function EditablePollListItem(props) {
	  function deletePoll() {
	    props.delete(props.poll);
	  }

	  function editPoll() {
	    props.edit(props.poll);
	  }

	  var actions = _jsx(_materialUi.CardActions, {}, void 0, _jsx(_ShareButtons2.default, {
	    poll: props.poll
	  }), _jsx(_materialUi.FlatButton, {
	    label: 'Edit',
	    primary: true,
	    onClick: editPoll
	  }), _jsx(_materialUi.FlatButton, {
	    label: 'Delete',
	    secondary: true,
	    onClick: deletePoll
	  }));

	  var shareButtons = _jsx(_materialUi.CardActions, {}, void 0, _jsx(_ShareButtons2.default, {
	    poll: props.poll
	  }));

	  return _jsx(_PollListItem2.default, {
	    poll: props.poll,
	    innerElements: props.showModifyButtons ? actions : shareButtons
	  });
	}

	exports.default = EditablePollListItem;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _materialUi = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function IncompletePollDialog(props) {
	  var closeButton = [_jsx(_materialUi.FlatButton, {
	    label: 'OK',
	    primary: true,
	    onClick: props.close
	  })];

	  return _jsx(_materialUi.Dialog, {
	    title: 'Poll Incomplete',
	    actions: closeButton,
	    modal: false,
	    open: !!props.dialog,
	    onRequestClose: props.close
	  }, void 0, props.dialog);
	}

	exports.default = IncompletePollDialog;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _PollListItem = __webpack_require__(8);

	var _PollListItem2 = _interopRequireDefault(_PollListItem);

	var _ShareButtons = __webpack_require__(17);

	var _ShareButtons2 = _interopRequireDefault(_ShareButtons);

	var _Card = __webpack_require__(26);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function PollList(props) {
	  return _jsx('div', {}, void 0, props.polls.map(function (poll) {
	    return _jsx(_PollListItem2.default, {
	      poll: poll,
	      innerElements: _jsx(_Card.CardActions, {}, void 0, _jsx(_ShareButtons2.default, {
	        poll: poll
	      }))
	    }, poll.cuid);
	  }));
	}

	exports.default = PollList;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DELETE_POST = exports.ADD_POSTS = exports.ADD_POST = undefined;
	exports.addPost = addPost;
	exports.addPostRequest = addPostRequest;
	exports.addPosts = addPosts;
	exports.fetchPosts = fetchPosts;
	exports.fetchPost = fetchPost;
	exports.deletePost = deletePost;
	exports.deletePostRequest = deletePostRequest;

	var _apiCaller = __webpack_require__(23);

	var _apiCaller2 = _interopRequireDefault(_apiCaller);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Export Constants
	var ADD_POST = exports.ADD_POST = 'ADD_POST';
	var ADD_POSTS = exports.ADD_POSTS = 'ADD_POSTS';
	var DELETE_POST = exports.DELETE_POST = 'DELETE_POST';

	// Export Actions
	function addPost(post) {
	  return {
	    type: ADD_POST,
	    post: post
	  };
	}

	function addPostRequest(post) {
	  return function (dispatch) {
	    return (0, _apiCaller2.default)('posts', 'post', {
	      post: {
	        name: post.name,
	        title: post.title,
	        content: post.content
	      }
	    }).then(function (res) {
	      return dispatch(addPost(res.post));
	    });
	  };
	}

	function addPosts(posts) {
	  return {
	    type: ADD_POSTS,
	    posts: posts
	  };
	}

	function fetchPosts() {
	  return function (dispatch) {
	    return (0, _apiCaller2.default)('posts').then(function (res) {
	      dispatch(addPosts(res.posts));
	    });
	  };
	}

	function fetchPost(cuid) {
	  return function (dispatch) {
	    return (0, _apiCaller2.default)('posts/' + cuid).then(function (res) {
	      return dispatch(addPost(res.post));
	    });
	  };
	}

	function deletePost(cuid) {
	  return {
	    type: DELETE_POST,
	    cuid: cuid
	  };
	}

	function deletePostRequest(cuid) {
	  return function (dispatch) {
	    return (0, _apiCaller2.default)('posts/' + cuid, 'delete').then(function () {
	      return dispatch(deletePost(cuid));
	    });
	  };
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getPost = exports.getPosts = undefined;

	var _PostActions = __webpack_require__(58);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// Initial State
	var initialState = { data: [] };

	var PostReducer = function PostReducer() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	  var action = arguments[1];

	  switch (action.type) {
	    case _PostActions.ADD_POST:
	      return {
	        data: [action.post].concat(_toConsumableArray(state.data))
	      };

	    case _PostActions.ADD_POSTS:
	      return {
	        data: action.posts
	      };

	    case _PostActions.DELETE_POST:
	      return {
	        data: state.data.filter(function (post) {
	          return post.cuid !== action.cuid;
	        })
	      };

	    default:
	      return state;
	  }
	};

	/* Selectors */

	// Get all posts
	var getPosts = exports.getPosts = function getPosts(state) {
	  return state.posts.data;
	};

	// Get post by cuid
	var getPost = exports.getPost = function getPost(state, cuid) {
	  return state.posts.data.filter(function (post) {
	    return post.cuid === cuid;
	  })[0];
	};

	// Export Reducer
	exports.default = PostReducer;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _redux = __webpack_require__(28);

	var _AppReducer = __webpack_require__(47);

	var _AppReducer2 = _interopRequireDefault(_AppReducer);

	var _PostReducer = __webpack_require__(59);

	var _PostReducer2 = _interopRequireDefault(_PostReducer);

	var _IntlReducer = __webpack_require__(53);

	var _IntlReducer2 = _interopRequireDefault(_IntlReducer);

	var _PollReducer = __webpack_require__(4);

	var _PollReducer2 = _interopRequireDefault(_PollReducer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* temp till i create the user pages */


	// Import Reducers
	function user() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	  var action = arguments[1];

	  switch (action.type) {
	    default:
	      return state;
	  }
	}

	// Combine all reducers into one root reducer
	/**
	 * Root Reducer
	 */
	exports.default = (0, _redux.combineReducers)({
	  app: _AppReducer2.default,
	  posts: _PostReducer2.default,
	  intl: _IntlReducer2.default,
	  polls: _PollReducer2.default,
	  user: user
	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createPoll = createPoll;
	exports.updatePoll = updatePoll;
	exports.voteOnPoll = voteOnPoll;
	exports.deletePoll = deletePoll;

	var _poll = __webpack_require__(11);

	var _poll2 = _interopRequireDefault(_poll);

	var _voting_tools = __webpack_require__(7);

	var _voting_tools2 = _interopRequireDefault(_voting_tools);

	var _cuid = __webpack_require__(25);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createPoll(req, res) {
	  if (!req.user) {
	    res.redirect('/api/auth/github');
	    return;
	  }

	  var poll = req.body;
	  poll.author = req.user.username;
	  poll.authorID = req.user.github_id;
	  poll.cuid = (0, _cuid.slug)();
	  poll.dateCreated = Date.now();

	  checkIfPollExists(poll).then(function (doesExist) {
	    if (doesExist) {
	      send(null, 'poll already exists');
	    } else {
	      createPollInDB(poll).then(function (createdPoll) {
	        return send(createdPoll, 'success');
	      });
	    }
	  }).catch(function (err) {
	    console.error(err); // eslint-disable-line
	    send(null, 'couldnt create poll');
	  });

	  function send(createdPoll, message) {
	    res.send({ createdPoll: createdPoll, message: message });
	  }
	}

	function checkIfPollExists(poll) {
	  return _poll2.default.findOne({ title: poll.title }).then(function (found) {
	    return !!found;
	  });
	}

	function createPollInDB(poll) {
	  return new _poll2.default(poll).save();
	}

	function updatePoll(req, res) {
	  if (!req.user || !req.body || req.user.github_id !== req.body.authorID) {
	    send(null, 'not logged in or user didnt match poll author');
	    return;
	  }

	  _poll2.default.findOneAndUpdate({ cuid: req.body.cuid }, req.body).then(function (updatedPoll) {
	    return send(updatedPoll, 'success');
	  }).catch(function (err) {
	    return console.err(err);
	  }); // eslint-disable-line

	  function send(updatedPoll, message) {
	    res.send({ updatedPoll: updatedPoll, message: message });
	  }
	}

	function voteOnPoll(req, res) {
	  console.log('voteOnPoll:', req.body);
	  console.error('voteOnPoll:', req.body);
	  send(null, null);
	  return;
	  var voterID = (req.user ? req.user.github_id : null) || req.connection.remoteAddress;
	  var entryTitle = req.body.entryTitle;
	  var query = { cuid: req.body.cuid };

	  _poll2.default.findOne(query).then(function (poll) {
	    _voting_tools2.default.voteOnPollEntries(voterID, entryTitle, poll.entries);
	    poll.markModified('entries');
	    return poll.save().then(function (votedOnPoll) {
	      return send(votedOnPoll, 'voted on poll');
	    });
	  }).catch(function (err) {
	    return console.error(err);
	  }); // eslint-disable-line


	  function send(votedOnPoll, message) {
	    res.send({ votedOnPoll: votedOnPoll, message: message });
	  }
	}

	function deletePoll(req, res) {
	  _poll2.default.findOneAndRemove({ cuid: req.body.pollID }).then(function () {
	    return res.send({ message: 'success' });
	  }).catch(function (err) {
	    return console.error(err);
	  }); // eslint-disable-line
	}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getPosts = getPosts;
	exports.addPost = addPost;
	exports.getPost = getPost;
	exports.deletePost = deletePost;

	var _post = __webpack_require__(63);

	var _post2 = _interopRequireDefault(_post);

	var _cuid = __webpack_require__(25);

	var _cuid2 = _interopRequireDefault(_cuid);

	var _limax = __webpack_require__(79);

	var _limax2 = _interopRequireDefault(_limax);

	var _sanitizeHtml = __webpack_require__(101);

	var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Get all posts
	 * @param req
	 * @param res
	 * @returns void
	 */
	function getPosts(req, res) {
	  _post2.default.find().sort('-dateAdded').exec(function (err, posts) {
	    if (err) {
	      res.status(500).send(err);
	    }
	    res.json({ posts: posts });
	  });
	}

	/**
	 * Save a post
	 * @param req
	 * @param res
	 * @returns void
	 */
	function addPost(req, res) {
	  if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
	    res.status(403).end();
	  }

	  var newPost = new _post2.default(req.body.post);

	  // Let's sanitize inputs
	  newPost.title = (0, _sanitizeHtml2.default)(newPost.title);
	  newPost.name = (0, _sanitizeHtml2.default)(newPost.name);
	  newPost.content = (0, _sanitizeHtml2.default)(newPost.content);

	  newPost.slug = (0, _limax2.default)(newPost.title.toLowerCase(), { lowercase: true });
	  newPost.cuid = (0, _cuid2.default)();
	  newPost.save(function (err, saved) {
	    if (err) {
	      res.status(500).send(err);
	    }
	    res.json({ post: saved });
	  });
	}

	/**
	 * Get a single post
	 * @param req
	 * @param res
	 * @returns void
	 */
	function getPost(req, res) {
	  _post2.default.findOne({ cuid: req.params.cuid }).exec(function (err, post) {
	    if (err) {
	      res.status(500).send(err);
	    }
	    res.json({ post: post });
	  });
	}

	/**
	 * Delete a post
	 * @param req
	 * @param res
	 * @returns void
	 */
	function deletePost(req, res) {
	  _post2.default.findOne({ cuid: req.params.cuid }).exec(function (err, post) {
	    if (err) {
	      res.status(500).send(err);
	    }

	    post.remove(function () {
	      res.status(200).end();
	    });
	  });
	}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(5);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var postSchema = new Schema({
	  name: { type: 'String', required: true },
	  title: { type: 'String', required: true },
	  content: { type: 'String', required: true },
	  slug: { type: 'String', required: true },
	  cuid: { type: 'String', required: true },
	  dateAdded: { type: 'Date', default: Date.now, required: true }
	});

	exports.default = _mongoose2.default.model('Post', postSchema);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _mongoose = __webpack_require__(5);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Schema = _mongoose2.default.Schema;

	var userSchema = new Schema({
	  username: String,
	  github_id: String
	});

	exports.default = _mongoose2.default.model('User', userSchema);

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.strategy = strategy;
	exports.authRoutes = authRoutes;

	var _passportGithub = __webpack_require__(89);

	var _express = __webpack_require__(3);

	var _envVariables = __webpack_require__(24);

	var _envVariables2 = _interopRequireDefault(_envVariables);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = new _express.Router();

	function strategy(verifyCallback) {
	  return new _passportGithub.Strategy({
	    clientID: (0, _envVariables2.default)('GITHUB_CLIENT_ID'),
	    clientSecret: (0, _envVariables2.default)('GITHUB_CLIENT_SECRET_ID'),
	    callbackURL: (0, _envVariables2.default)('GITHUB_CALLBACK_URL')
	  }, verifyCallback);
	}

	function authRoutes(passport) {
	  router.post('/github', passport.authenticate('github', { scope: ['user:email'] }));

	  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
	  router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/failed' }), function (req, res) {
	    res.redirect('/');
	  });
	  return router;
	}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _poll = __webpack_require__(61);

	var router = new _express.Router();

	router.route('/polls').post(_poll.createPoll);
	router.route('/polls').put(_poll.updatePoll);
	router.route('/polls/vote').patch(_poll.voteOnPoll);
	router.route('/polls').delete(_poll.deletePoll);

	exports.default = router;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _post = __webpack_require__(62);

	var PostController = _interopRequireWildcard(_post);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var router = new _express.Router();

	// Get all Posts
	router.route('/posts').get(PostController.getPosts);

	// Get one post by cuid
	router.route('/posts/:cuid').get(PostController.getPost);

	// Add a new Post
	router.route('/posts').post(PostController.addPost);

	// Delete a post by cuid
	router.route('/posts/:cuid').delete(PostController.deletePost);

	exports.default = router;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _express = __webpack_require__(3);

	var _express2 = _interopRequireDefault(_express);

	var _compression = __webpack_require__(36);

	var _compression2 = _interopRequireDefault(_compression);

	var _cookieParser = __webpack_require__(37);

	var _cookieParser2 = _interopRequireDefault(_cookieParser);

	var _mongoose = __webpack_require__(5);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _bodyParser = __webpack_require__(35);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _methodOverride = __webpack_require__(38);

	var _methodOverride2 = _interopRequireDefault(_methodOverride);

	var _path = __webpack_require__(39);

	var _path2 = _interopRequireDefault(_path);

	var _webpack = __webpack_require__(13);

	var _webpack2 = _interopRequireDefault(_webpack);

	var _webpackConfig = __webpack_require__(34);

	var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

	var _webpackDevMiddleware = __webpack_require__(41);

	var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

	var _webpackHotMiddleware = __webpack_require__(42);

	var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

	var _store = __webpack_require__(30);

	var _reactRedux = __webpack_require__(1);

	var _react = __webpack_require__(0);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(40);

	var _reactRouter = __webpack_require__(2);

	var _reactHelmet = __webpack_require__(12);

	var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

	var _routes = __webpack_require__(29);

	var _routes2 = _interopRequireDefault(_routes);

	var _fetchData = __webpack_require__(33);

	var _config = __webpack_require__(10);

	var _config2 = _interopRequireDefault(_config);

	var _auth = __webpack_require__(32);

	var _auth2 = _interopRequireDefault(_auth);

	var _api = __webpack_require__(31);

	var _api2 = _interopRequireDefault(_api);

	var _pollSymbol = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNDU5IDQ1OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDU5IDQ1OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJwb2xsIj4KCQk8cGF0aCBkPSJNNDA4LDBINTFDMjIuOTUsMCwwLDIyLjk1LDAsNTF2MzU3YzAsMjguMDUsMjIuOTUsNTEsNTEsNTFoMzU3YzI4LjA1LDAsNTEtMjIuOTUsNTEtNTFWNTFDNDU5LDIyLjk1LDQzNi4wNSwwLDQwOCwweiAgICAgTTE1MywzNTdoLTUxVjE3OC41aDUxVjM1N3ogTTI1NSwzNTdoLTUxVjEwMmg1MVYzNTd6IE0zNTcsMzU3aC01MVYyNTVoNTFWMzU3eiIgZmlsbD0iIzkxREM1QSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

	var _pollSymbol2 = _interopRequireDefault(_pollSymbol);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Initialize the Express App


	// Webpack Requirements
	var app = new _express2.default();
	// Run Webpack dev server in development mode
	// "start": "cross-env BABEL_DISABLE_CACHE=1 NODE_ENV=development nodemon index.js",
	// "start": "NODE_ENV=production MONGO_URL=mongodb://caleb-db:123Dog@ds023560.mlab.com:23560/fcc-project-database node index.js",

	if (process.env.NODE_ENV === 'development') {
	  var compiler = (0, _webpack2.default)(_webpackConfig2.default);
	  app.use((0, _webpackDevMiddleware2.default)(compiler, { noInfo: true, publicPath: _webpackConfig2.default.output.publicPath }));
	  app.use((0, _webpackHotMiddleware2.default)(compiler));
	}

	// React And Redux Setup


	// Import required modules


	// temp imports figure out how to do this proper


	// Set native promises as mongoose promise
	_mongoose2.default.Promise = global.Promise;

	// MongoDB Connection
	_mongoose2.default.connect(_config2.default.mongoURL, function (error) {
	  if (error) {
	    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
	    throw error;
	  }
	});

	// Apply body Parser and server public assets and routes
	app.use(_express2.default.static(_path2.default.resolve(__dirname, '../dist')));
	app.use((0, _compression2.default)());
	app.use((0, _cookieParser2.default)());
	app.use(_bodyParser2.default.urlencoded({ limit: '20mb', extended: true }));
	app.use(_bodyParser2.default.json());
	app.use((0, _methodOverride2.default)());

	app.use(_auth2.default);
	app.use('/api', _api2.default);

	// Render Initial HTML
	var renderFullPage = function renderFullPage(html, initialState) {
	  var head = _reactHelmet2.default.rewind();

	  // Import Manifests
	  var assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
	  var chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

	  // <link rel="shortcut icon" href='${process.env.NODE_ENV === 'production' ? assetsManifest['/poll-symbol.png'] : pollSymbol}' />
	  return '\n    <!doctype html>\n    <html>\n      <head>\n        ' + head.base.toString() + '\n        ' + head.title.toString() + '\n        ' + head.meta.toString() + '\n        ' + head.link.toString() + '\n        ' + head.script.toString() + '\n\n        ' + (process.env.NODE_ENV === 'production' ? '<link rel=\'stylesheet\' href=\'' + assetsManifest['/app.css'] + '\' />' : '') + '\n        <link rel="shortcut icon" href=\'' + _pollSymbol2.default + '\' />\n        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">\n      </head>\n      <body>\n        <div id="root">' + html + '</div>\n        <script>\n          // this might fix the react attempted to reuse markup in container error try out later\n          // window.APP_STATE\n          window.__INITIAL_STATE__ = ' + JSON.stringify(initialState) + ';\n          ' + (process.env.NODE_ENV === 'production' ? '//<![CDATA[\n          window.webpackManifest = ' + JSON.stringify(chunkManifest) + ';\n          //]]>' : '') + '\n        </script>\n\n        <script src="https://use.fontawesome.com/cae23e1025.js"></script>\n        <script src=\'' + (process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js') + '\'></script>\n        <script src=\'' + (process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js') + '\'></script>\n      </body>\n    </html>\n  ';
	};

	var renderError = function renderError(err) {
	  var softTab = '&#32;&#32;&#32;&#32;';
	  var errTrace = process.env.NODE_ENV !== 'production' ? ':<br><br><pre style="color:red">' + softTab + err.stack.replace(/\n/g, '<br>' + softTab) + '</pre>' : '';
	  return renderFullPage('Server Error' + errTrace, {});
	};

	// Server Side Rendering based on routes matched by React-router.
	app.use(function (req, res, next) {
	  (0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (err, redirectLocation, renderProps) {
	    if (err) {
	      '';
	      return res.status(500).end(renderError(err));
	    }

	    if (redirectLocation) {
	      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
	    }

	    if (!renderProps) {
	      return next();
	    }

	    /* THIS IS TEMP TILL I SETUP THE NEED STUFF */
	    __webpack_require__(11).default.find({}).then(function (polls) {
	      return sendAppToClient({
	        polls: polls,
	        user: {
	          userProfile: req.user,
	          clientIP: req.connection.remoteAddress
	        }
	      });
	    }).catch(function (err) {
	      return console.error(err);
	    });

	    /* this works but it doesnt do server side rendering */
	    /* this also fixes the refresh not working on the CreatePollPage */
	    /* it also stops need woring on the components */
	    function sendAppToClient(startingData) {
	      var store = (0, _store.configureStore)(startingData);
	      var finalState = store.getState();

	      res.set('Content-Type', 'text/html').status(200).end(renderFullPage('', finalState));
	    }
	    // return fetchComponentData(store, renderProps.components, renderProps.params)
	    //   .then(() => {
	    //     const initialView = renderToString(
	    //       <Provider store={store}>
	    //         <IntlWrapper>
	    //           <RouterContext {...renderProps} />
	    //         </IntlWrapper>
	    //       </Provider>
	    //     );
	    //
	    //     const finalState = store.getState()
	    //
	    //     res
	    //       .set('Content-Type', 'text/html')
	    //       .status(200)
	    //       .end(renderFullPage('', finalState));

	    /* this should fix the error being throw specifically data={window.APP_STATE}
	      render((
	          <ContextWrapper data={window.APP_STATE}>
	          <Router history={createHistory()}>
	          {routes}
	          </Router>
	          </ContextWrapper>
	      ), document.querySelectorAll('[data-ui-role="content"]')[0]);
	    */
	    /* warning js?8a56:36Warning: React attempted to reuse markup in a
	    container but the checksum was invalid. This generally means that
	    you are using server rendering and the markup generated on the server was
	    not what the client was expecting. React injected new markup to
	    compensate which works but you have lost many of the benefits of server
	    rendering. Instead, figure out why the markup being generated is different
	    on the client or server:
	    (client) <!-- react-empty: 1 -
	    (server) <div data-reactroot=""
	    // the line bellow is commented and replaced with the one above all these
	    // .end(renderFullPage(initialView, finalState));
	    comments due to this error
	    */
	    // })
	    // .catch((error) => next(error));
	  });
	});

	// start app
	app.listen(_config2.default.port, function (error) {
	  if (!error) {
	    console.log('MERN is running on port: ' + _config2.default.port + '! Build something amazing!'); // eslint-disable-line
	  }
	});

	exports.default = app;
	/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ },
/* 69 */
/***/ function(module, exports) {

	"use strict";
	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  GITHUB_CLIENT_ID: 'b8d88dcbb5cea7da59e8',
	  GITHUB_CLIENT_SECRET_ID: '2d081ea24568da9b8d962af74e578f5bf0da7f73',
	  GITHUB_CALLBACK_URL: 'http://192.168.1.8:8000/auth/github/callback',
	  EXPRESS_SESSION_SECRET: 'calebmartin',

	  MONGO_URL: 'mongodb://caleb-db:123Dog@ds023560.mlab.com:23560/fcc-project-database',

	  GOOGLE_CLIENT_ID: '1069419221190-bj809935dmpantne6hii5re7js99sv2t.apps.googleusercontent.com',
	  GOOGLE_CLIENT_SECRET: 'iPBdIi9Naq7K4Ze38CuOUFvg',

	  BITLY_SHORTENED_CALLBACK_URL: 'http://bit.ly/2dRoLMw',
	  GOOGLE_CALLBACK_URL: 'http://bit.ly/2dRoLMw'
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	"use strict";
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sequence = sequence;
	/**
	 * Throw an array to it and a function which can generate promises
	 * and it will call them sequentially, one after another
	 */
	function sequence(items, consumer) {
	  var results = [];
	  var runner = function runner() {
	    var item = items.shift();
	    if (item) {
	      return consumer(item).then(function (result) {
	        results.push(result);
	      }).then(runner);
	    }

	    return Promise.resolve(results);
	  };

	  return runner();
	}

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = require("connect-mongo");

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = require("d3");

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = require("intl");

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = require("intl-locales-supported");

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = require("intl/locale-data/jsonp/en");

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = require("intl/locale-data/jsonp/fr");

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = require("limax");

/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = require("material-ui/AppBar");

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = require("material-ui/IconButton");

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = require("material-ui/IconMenu");

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = require("material-ui/MenuItem");

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = require("material-ui/styles/MuiThemeProvider");

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = require("material-ui/styles/colors");

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = require("material-ui/styles/getMuiTheme");

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = require("material-ui/svg-icons/navigation/more-vert");

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = require("passport-github2");

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = require("postcss-cssnext");

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = require("postcss-focus");

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = require("postcss-reporter");

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = require("react-faux-dom");

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = require("react-intl");

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = require("react-intl/locale-data/en");

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = require("react-intl/locale-data/fr");

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = require("redux-devtools");

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = require("redux-devtools-dock-monitor");

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = require("redux-devtools-log-monitor");

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = require("redux-thunk");

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = require("sanitize-html");

/***/ }
/******/ ]);