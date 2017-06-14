'use strict';

export const SUBSCRIBE = 'REDUX_ACTION_SUBSCRIBE';
export const SUBSCRIBEONCE = 'REDUX_ACTION_SUBSCRIBEONCE';
export const UNSUBSCRIBE = 'REDUX_ACTION_UNSUBSCRIBE';

export default () => {
  const actionList = [];
  const subscribe = {};
  const subscribeOnce = {};
  function subscribeHandler(subscribe, event, cb, isMultiple = false) {
    const _subscribe = subscribe;
    if (actionList.indexOf(event) >= 0) {
      cb();
      isMultiple ? _subscribe[event] = [cb] : '';
    } else if (_subscribe[event]) {
      _subscribe[event].push(cb);
    } else {
      _subscribe[event] = [cb];
    }
  }

  return store => next => (action) => {
    const result = next(action);
    if (action.type === SUBSCRIBE || action.type === SUBSCRIBEONCE || action.type === UNSUBSCRIBE) {
      switch (action.type) {
      case SUBSCRIBE:
        subscribeHandler(subscribe, action.payload.event, action.payload.callback ,true);
        break;
      case SUBSCRIBEONCE:
        subscribeHandler(subscribeOnce, action.payload.event, action.payload.callback);
        break;
      case UNSUBSCRIBE:
        if (subscribe[action.payload.event]) {
          delete subscribe[action.payload.event];
        }
        if (subscribeOnce[action.payload.event]) {
          delete subscribeOnce[action.payload.event];
        }
        break;
      default:
      }
    } else {
      actionList.push(action.type);
      if (subscribe[action.type]) {
        subscribe[action.type].forEach(cb => cb(result));
      }
      if (subscribeOnce[action.type]) {
        subscribeOnce[action.type].forEach(cb => cb(result));
        delete subscribeOnce[action.type];
      }
    }
    return result;
  };
};

export const subscribeAction = (event, callback) => ({
  type: SUBSCRIBE,
  payload: {
    event,
    callback
  }
});

export const subscribeOnceAction = (event, callback) => ({
  type: SUBSCRIBEONCE,
  payload: {
    event,
    callback
  }
});

export const unsubscribeAction = event => ({
  type: UNSUBSCRIBE,
  payload: {
    event
  }
});
