import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from '../reducers';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    let error = {
      err,
      action,
      state: store.getState()
    };
    window.onerror(error);
    throw err;
  }
}

const logger = createLogger({
  predicate: (getState, action) => action.type !== 'LOADING_TRUE' && action.type !== 'LOADING_FALSE'
});

let middleware = [thunk, crashReporter];

if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

middleware.push(store => next => action => {
  if ((typeof window === 'undefined') || !window.ga) {
    return next(action);
  }
  if ((action.type === 'LOADING_TRUE') || (action.type === 'LOADING_FALSE')) {
    return next(action);
  }
  return next(action);
});

const finalCreateStore = compose(applyMiddleware(...middleware), ((typeof window !== 'undefined') && window.devToolsExtension) ? window.devToolsExtension() : f => f)(createStore);

export function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);
  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers')));
  }
  return store;
}
