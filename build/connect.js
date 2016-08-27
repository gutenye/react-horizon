Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports["default"] = connect;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require("shallowequal");

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _rxjs = require("rxjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function connect() {
  var subscriptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var mutations = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (ReactComponent) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      _inherits(_class, _Component);

      function _class(props, context) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

        _this._subscriptions = [];
        _this._mutations = {};
        _this._subscription;

        _this.state = {
          data: {},
          loading: true
        };

        _this._subscribe = _this._subscribe.bind(_this);
        _this._unsubscribe = _this._unsubscribe.bind(_this);
        _this._createMutations = _this._createMutations.bind(_this);
        return _this;
      }

      _createClass(_class, [{
        key: "shouldComponentUpdate",
        value: function () {
          function shouldComponentUpdate(nextProps, nextState) {
            return (0, _shallowequal2["default"])(nextProps, this.props) === false || (0, _shallowequal2["default"])(nextState, this.state) === false;
          }

          return shouldComponentUpdate;
        }()
        /*
        componentWillReceiveProps(nextProps) {
          this._unsubscribe()
          this._subscribe(this.context.hz, nextProps)
        }
        */

      }, {
        key: "componentDidMount",
        value: function () {
          function componentDidMount() {
            this._subscribe(this.context.hz, this.props);
            this._createMutations(this.context.hz);
          }

          return componentDidMount;
        }()
      }, {
        key: "componentWillUnmount",
        value: function () {
          function componentWillUnmount() {
            this._unsubscribe();
          }

          return componentWillUnmount;
        }()
      }, {
        key: "_subscribe",
        value: function () {
          function _subscribe(hz, props) {
            var _this2 = this;

            Object.keys(subscriptions).forEach(function (qname) {
              var q = subscriptions[qname];
              var subscription = q(hz, props).watch();
              _this2._subscriptions.push(subscription);
            });

            this._subscription = _rxjs.Observable.combineLatest.apply(_rxjs.Observable, _toConsumableArray(this._subscriptions)).subscribe(function (results) {
              var data = {};
              var keys = Object.keys(subscriptions);
              results.forEach(function (result, i) {
                data[keys[i]] = result;
              });
              _this2.setState({ data: data, loading: false });
            });
          }

          return _subscribe;
        }()
      }, {
        key: "_unsubscribe",
        value: function () {
          function _unsubscribe(subscriptions) {
            this._subscription.unsubscribe();
          }

          return _unsubscribe;
        }()
      }, {
        key: "_createMutations",
        value: function () {
          function _createMutations(hz) {
            var _this3 = this;

            Object.keys(mutations).forEach(function (mname) {
              _this3._mutations[mname] = mutations[mname](hz);
            });
          }

          return _createMutations;
        }()
      }, {
        key: "render",
        value: function () {
          function render() {
            if (this.state.loading) return null;
            return _react2["default"].createElement(ReactComponent, _extends({}, this.props, this.state.data, this._mutations, { hz: this.context.hz }));
          }

          return render;
        }()
      }]);

      return _class;
    }(_react.Component), _class.contextTypes = {
      hz: _react.PropTypes.func
    }, _temp;
  };
}