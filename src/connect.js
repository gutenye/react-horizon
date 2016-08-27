import React, { Component, PropTypes } from 'react';
import shallowequal from 'shallowequal';
import {Observable} from "rxjs";

export default function connect(subscriptions = {}, mutations = {}) {
  return function(ReactComponent) {
    return class extends Component {
      static contextTypes = {
        hz: PropTypes.func
      }

      constructor(props, context) {
        super(props, context);
        this._subscriptions = [];
        this._mutations = {};

        this.state = {
          data: {},
          loaded: false,
        }

        this._subscribe = this._subscribe.bind(this);
        this._unsubscribe = this._unsubscribe.bind(this);
        this._createMutations = this._createMutations.bind(this);
      }
      shouldComponentUpdate(nextProps, nextState) {
        return shallowequal(nextProps, this.props) === false ||
               shallowequal(nextState, this.state) === false;
      }
      componentWillReceiveProps(nextProps) {
        this._unsubscribe(this._subscriptions);
        this._subscribe(this.context.hz, nextProps);
      }
      componentWillMount() {
        this._subscribe(this.context.hz, this.props);
        this._createMutations(this.context.hz);
      }
      componentWillUnmount() {
        this._unsubscribe(this._subscriptions);
      }
      _subscribe(hz, props) {
        Object.keys(subscriptions)
          .forEach((qname) => {
            const q = subscriptions[qname];
            const subscription = q(hz, props).watch()
            this._subscriptions.push(subscription);
          });

        Observable.combineLatest(...this._subscriptions).subscribe(results => {
          var data = {}
          var keys = Object.keys(subscriptions)
          results.forEach((result, i) => {
            data[keys[i]] = result
          })
          this.setState({data, loaded: true})
        })
      }
      _unsubscribe(subscriptions) {
        subscriptions.forEach((q) => q.unsubscribe());
      }
      _createMutations(hz) {
        Object.keys(mutations)
          .forEach((mname) => {
            this._mutations[mname] = mutations[mname](hz);
          });
      }
      render() {
        if (!this.state.loaded)
          return null
        return <ReactComponent {...this.props} {...this.state.data} {...this._mutations} hz={this.context.hz}/>;
      }
    }
  }
}
