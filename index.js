

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

  return store => next => (action) => { // eslint-disable-line no-unused-vars
    const result = next(action);
    if (action.type === SUBSCRIBE || action.type === SUBSCRIBEONCE || action.type === UNSUBSCRIBE) {
      switch (action.type) {
        case SUBSCRIBE:
          subscribeHandler(subscribe, action.payload.event, action.payload.callback, true);
          break;
        case SUBSCRIBEONCE:
          subscribeHandler(subscribeOnce, action.payload.event, action.payload.callback);
          break;
        case UNSUBSCRIBE: // eslint-disable-line no-case-declarations
          const { event, callback } = action.payload;
          if (event) {
            if (callback) {
              if (subscribe[event]) {
                subscribe[event] = subscribe[event].filter(cb => cb !== callback);
              }

              if (subscribeOnce[event]) {
                subscribeOnce[event] = subscribeOnce[event].filter(cb => cb !== callback);
              }
            } else {
              delete subscribe[event];
              delete subscribeOnce[event];
            }
          } else if (callback) {
            // eslint-disable-next-line no-return-assign
            Object.keys(subscribe).forEach(k =>
                    subscribe[k] = subscribe[k].filter(cb => cb !== callback),
                );
            // eslint-disable-next-line no-return-assign
            Object.keys(subscribeOnce).forEach(k =>
                    subscribeOnce[k] = subscribeOnce[k].filter(cb => cb !== callback),
                );
          } else {
            Object.keys(subscribe).forEach(k => delete subscribe[k]);
            Object.keys(subscribeOnce).forEach(k => delete subscribeOnce[k]);
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
    callback,
  },
});

export const subscribeOnceAction = (event, callback) => ({
  type: SUBSCRIBEONCE,
  payload: {
    event,
    callback,
  },
});

export const unsubscribeAction = (event, callback = null) => {
  const action = { type: UNSUBSCRIBE, payload: { } };
  if (event) action.payload.event = event;
  if (callback) action.payload.callback = callback;
  return action;
};
