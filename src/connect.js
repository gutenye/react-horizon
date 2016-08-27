import React, {Component, PropTypes} from "react"
import shallowequal from "shallowequal"
import {Observable} from "rxjs"
import {forEach, remove, isArray, castArray} from "lodash"

export default function resolve(subscriptions, mutations={}) {
  return function(WrappedComponent) {
    return class extends Component {
      static contextTypes = {
        hz: PropTypes.func
      }

      state = {
        loaded: false,
        data: {},  // {users: [...]}
      }

      _subscriptions = []
      

      constructor(props) {
        super(props)
        this.actions = this.processActions(actions)
        this.resolve = this.resolve.bind(this)
      }

      render() {
        if (!this.state.loaded)
          return null
        var {props, state: {data}, resolve, actions} = this
        return <WrappedComponent {...props} {...data} {...actions} resolve={resolve}  />
      }

      componentDidMount() {
        this.resolve()
      }

      componentDidUpdate(prev) {
        if (prev.params && prev.params.id !== this.props.params.id) {
          this.resolve()
        }
      }

      resolve(options) {
        var {props} = this
        options = Object.assign({}, init, props, options)
        var promises = Object.keys(query).map(field => query[field](options))
        var fields = Object.keys(query)
        Promise.all(promises).then(results => {
          var data = results.reduce((data, value, i) => {
            data[fields[i]] = value
            return data
          }, {})
          this.setState({data, loaded: true})
        })
      }

      remove(field, result) {
        var {state: {data}} = this
        remove(data[field], v => v.id === result.id)
        this.setState({data})
      }

      add(field, result) {
        var {state: {data}} = this
        data[field].push(result)
        this.setState({data})
      }

      update(field, result) {
        var {state: {data}} = this
        var index = data[field].findIndex(v => v.id === result.id)
        if (index !== -1)
          data[field].splice(index, 1, result)
        this.setState({data})
      }

      processActions(actions) {
        forEach(actions, (args, name) => {
          args = castArray(args)
          var action = args[0],
              type = (args[1] || ACTION_ALIAS[name] || name).toLowerCase(),
              field = args[2] || Object.keys(query)[0]
          actions[name] = (...args) => {
            action(...args).then(result => {
              this[type](field, result)
            })
          }
        })
        return actions
      }
    }
  }
}

export default function connect(subscriptions = {}, mutations = {}) {
  return function(ReactComponent) {
    return class extends Component {
      static contextTypes = {
        hz: PropTypes.func
      }

      constructor(props, context) {
        super(props, context)
        this._subscriptions = []
        this._mutations = {}

        this.state = {
          data: {},
          loaded: false,
        }

        this._subscribe = this._subscribe.bind(this)
        this._unsubscribe = this._unsubscribe.bind(this)
        this._createMutations = this._createMutations.bind(this)
      }
      shouldComponentUpdate(nextProps, nextState) {
        return shallowequal(nextProps, this.props) === false ||
               shallowequal(nextState, this.state) === false
      }
      componentWillReceiveProps(nextProps) {
        this._unsubscribe(this._subscriptions)
        this._subscribe(this.context.hz, nextProps)
      }
      componentWillMount() {
        this._subscribe(this.context.hz, this.props)
        this._createMutations(this.context.hz)
      }
      componentWillUnmount() {
        this._unsubscribe(this._subscriptions)
      }
      _subscribe(hz, props) {
        Object.keys(subscriptions)
          .forEach((qname) => {
            const q = subscriptions[qname]
            const subscription = q(hz, props).watch()
            this._subscriptions.push(subscription)
          })

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
        subscriptions.forEach((q) => q.unsubscribe())
      }
      _createMutations(hz) {
        Object.keys(mutations)
          .forEach((mname) => {
            this._mutations[mname] = mutations[mname](hz)
          })
      }
      render() {
        if (!this.state.loaded)
          return null
        return <ReactComponent {...this.props} {...this.state.data} {...this._mutations} hz={this.context.hz}/>
      }
    }
  }
}
