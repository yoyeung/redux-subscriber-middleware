[![Build Status](https://travis-ci.org/yoyeung/redux-subscriber-middleware.svg?branch=master)](https://travis-ci.org/yoyeung/redux-subscriber-middleware)
[![Coverage Status](https://coveralls.io/repos/github/yoyeung/redux-subscriber-middleware/badge.svg?branch=master)](https://coveralls.io/github/yoyeung/redux-subscriber-middleware?branch=master)

# redux-subscriber-middleware

Subscribe and UnSubscribe action for Redux

## Installation

`npm install redux-subscriber-middleware --save`

## Usage

For Middleware

```js
import {createStore} from 'redux';
import Subscriber from 'redux-subscriber-middleware';

const middleware = [
  thunk,
  Subscriber()
];
let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  applyMiddleware(middleware)
);
```

Inside the script

```js
// or you can just import "subscribe" function from the package
import { subscribeAction, subscribeOnceAction, unsubscribeAction } from 'redux-subscriber-middleware';

// for normal subscribe
dispatch(subscribeAction('ACTION_YOU_WANT_TO_SUBSCRIBE', CALLBACK_FUNCTION));

// for one time
dispatch(subscribeOnceAction('ACTION_YOU_WANT_TO_SUBSCRIBE', CALLBACK_FUNCTION));

// unsubscribe all callbacks for action
dispatch(unsubscribeAction('ACTION_YOU_WANT_TO_UNSUBSCRIBE'));

// unsubscribe specific callback for action
dispatch(unsubscribeAction('ACTION_YOU_WANT_TO_UNSUBSCRIBE', CALLBACK_FUNCTION));

// unsubscribe specific callback for all actions
dispatch(unsubscribeAction(null, CALLBACK_FUNCTION));

// unsubscribe everything
dispatch(unsubscribeAction());

```

