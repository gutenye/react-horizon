Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {
  return null;
};

var HorizonRoute = function (_Component) {
  _inherits(HorizonRoute, _Component);

  function HorizonRoute(props, context) {
    _classCallCheck(this, HorizonRoute);

    var _this = _possibleConstructorReturn(this, (HorizonRoute.__proto__ || Object.getPrototypeOf(HorizonRoute)).call(this, props, context));

    _this.state = {
      status: undefined,
      error: undefined
    };
    return _this;
  }

  _createClass(HorizonRoute, [{
    key: 'componentWillMount',
    value: function () {
      function componentWillMount() {
        var _this2 = this;

        this._status = this.context.hz.status(function (_ref) {
          var type = _ref.type;
          return _this2.setState({ status: type });
        }, function (error) {
          return _this2.setState({ error: error });
        });
      }

      return componentWillMount;
    }()
  }, {
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        this._status.unsubscribe();
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'shouldComponentUpdate',
    value: function () {
      function shouldComponentUpdate(nextProps, nextState) {
        return (0, _shallowequal2['default'])(nextProps, this.props) === false || (0, _shallowequal2['default'])(nextState, this.state) === false;
      }

      return shouldComponentUpdate;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _state = this.state;
        var status = _state.status;
        var error = _state.error;


        switch (this.state.status) {
          case 'unconnected':
            return this.props.renderConnecting();
          case 'connected':
            return this.props.renderConnected();
          case 'ready':
            return this.props.renderSuccess();
          case 'error':
            return this.props.renderFailure(error);
          case 'disconnected':
            return this.props.renderDisconnected();
          default:
            return null;
        }
      }

      return render;
    }()
  }]);

  return HorizonRoute;
}(_react.Component);

HorizonRoute.contextTypes = {
  hz: _react.PropTypes.func
};
HorizonRoute.propTypes = {
  renderConnecting: _react.PropTypes.func,
  renderDisconnected: _react.PropTypes.func,
  renderConnected: _react.PropTypes.func,
  renderSuccess: _react.PropTypes.func,
  renderFailure: _react.PropTypes.func
};
HorizonRoute.defaultProps = {
  renderConnecting: noop,
  renderDisconnected: noop,
  renderConnected: noop,
  renderSuccess: noop,
  renderFailure: noop
};
exports['default'] = HorizonRoute;