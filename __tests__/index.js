import configureStore from 'redux-mock-store';
import Subscriber, { subscribeAction, subscribeOnceAction, unsubscribeAction } from '../index';

let store;
let mockCallback;
const addAction   = () => ({ type: 'ADD_ACTION' });
const otherAction = () => ({ type: 'OTHER_ACTION' });

function initialize() {
  const middlewares = [Subscriber()];
  const mockStore = configureStore(middlewares);
  const initialState = {};
  store = mockStore(initialState);
  mockCallback = jest.fn();
}

describe('redux-subscriber-middleware', () => {
  beforeEach(() => {
    initialize();
  });
  describe('subscribeOnce function', () => {
    it('should call the callback function one time', () => {
      // Dispatch the action
      store.dispatch(subscribeOnceAction('ADD_ACTION', mockCallback));
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(1);
    });

    it('should call the callback function one time only', () => {
      // Dispatch the action
      store.dispatch(subscribeOnceAction('ADD_ACTION', mockCallback));
      store.dispatch(addAction());
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(1);
    });
    it('should call mulitiple callback functions one time', () => {
      // Dispatch the action
      const mockCallback2 = jest.fn();
      store.dispatch(subscribeOnceAction('ADD_ACTION', mockCallback));
      store.dispatch(subscribeOnceAction('ADD_ACTION', mockCallback2));
      store.dispatch(addAction());
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(1);
      expect(mockCallback2.mock.calls.length).toEqual(1);
    });
    it('should not call the callback function after unsubscribed', () => {
      // Dispatch the action
      store.dispatch(subscribeOnceAction('ADD_ACTION', mockCallback));
      store.dispatch(unsubscribeAction('ADD_ACTION'));
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(0);
    });
    describe('subscribe executed action type', () => {
      it('should call the callback function one time', () => {
        store.dispatch(addAction());
        store.dispatch(subscribeOnceAction('ADD_ACTION', mockCallback));
        store.dispatch(addAction());
        expect(mockCallback.mock.calls.length).toEqual(1);
      });
    });
  });
  describe('subscribe function', () => {
    it('should call the callback function one time', () => {
      // Dispatch the action
      store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(1);
    });

    it('should call the callback function two time', () => {
      // Dispatch the action
      store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
      store.dispatch(addAction());
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(2);
    });
    describe('subscribe executed action type', () => {
      beforeEach(() => {
        initialize();
      });
      it('should call the callback function one time', () => {
        store.dispatch(addAction());
        store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
        store.dispatch(addAction());
        store.dispatch(addAction());
        expect(mockCallback.mock.calls.length).toEqual(3);
      });
    });
  });
  describe('unsubscribe function', () => {
    it('should call the callback function one time before the unsubscribe', () => {
      // Dispatch the action
      store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
      store.dispatch(addAction());
      store.dispatch(unsubscribeAction('ADD_ACTION'));
      store.dispatch(addAction());
      expect(mockCallback.mock.calls.length).toEqual(1);
    });

    it('should unsubscribe the specific callback given', () => {
      let otherCallback = jest.fn();
      let onceCallback = jest.fn();

      store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
      store.dispatch(subscribeAction('ADD_ACTION', otherCallback));
      store.dispatch(addAction());

      store.dispatch(subscribeOnceAction('ADD_ACTION', onceCallback));
      expect(onceCallback).not.toBeCalled();
      store.dispatch(unsubscribeAction('ADD_ACTION', otherCallback));
      store.dispatch(unsubscribeAction('ADD_ACTION', onceCallback));

      store.dispatch(addAction());

      expect(otherCallback.mock.calls.length).toEqual(1);
      expect(mockCallback.mock.calls.length).toEqual(2);
    });

    it('should unsubscribe the specific callback given for all actions', () => {
      let onceCallback = jest.fn();

      store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
      store.dispatch(subscribeAction('OTHER_ACTION', mockCallback));
      store.dispatch(addAction());
      store.dispatch(otherAction());
    
      store.dispatch(subscribeOnceAction('ADD_ACTION', onceCallback));
      expect(onceCallback).not.toBeCalled();
      store.dispatch(unsubscribeAction(null, mockCallback));
      store.dispatch(unsubscribeAction(null, onceCallback));

      store.dispatch(addAction());
      store.dispatch(otherAction());

      expect(mockCallback.mock.calls.length).toEqual(2);
    });

    it('should unsubscribe ALL THE THINGS', () => {
      let otherCallback = jest.fn();

      store.dispatch(subscribeAction('ADD_ACTION', mockCallback));
      store.dispatch(subscribeAction('OTHER_ACTION', mockCallback));
      store.dispatch(subscribeAction('OTHER_ACTION', otherCallback));
      store.dispatch(addAction());
      store.dispatch(otherAction());
      store.dispatch(unsubscribeAction());
      store.dispatch(addAction());
      store.dispatch(otherAction());
      expect(mockCallback.mock.calls.length).toEqual(2);
      expect(otherCallback.mock.calls.length).toEqual(1);
    });
  });
});
