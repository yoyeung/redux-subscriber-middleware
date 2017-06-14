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

// for unsubscribe
dispatch(unsubscribeAction('ACTION_YOU_WANT_TO_SUBSCRIBE'));

```

