/* global io */
import { createStore, applyMiddleware, compose } from 'redux'

const defaultState = {
  ifaces: [],
  session: []
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'set':
      const newState = {...state, ...action.payload}
      return newState
    case 'tcp':
      const session = state.session.slice(-99)
      session.push(action.payload)
      return {...state, session}
    default: return state
  }
}

// redux middleware: If the promise is resolved, its result will be dispatched as an action.
const promiseActions = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action)
  }
  return Promise.resolve(action).then(store.dispatch)
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(
    promiseActions
  ))
)

export const set = payload => store.dispatch({type: 'set', payload})

const socket = io()
socket.on('session', payload => {
  store.dispatch({type: 'tcp', payload})
})

export default store
