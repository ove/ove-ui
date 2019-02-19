/* jshint ignore:start */
// JSHint cannot deal with React.
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
 
const formReducer = (state = {}, action) => {
  switch(action.type) {
      case 'UPDATE':
          return {
              ...state,
              email: action.email,
              app: action.app,
              savedToCloud: action.savedToCloud
          };
      default:
          return state;
  }
};

const persistedReducer = persistReducer({
  key: 'root',
  storage
}, combineReducers({
    form: persistReducer({
        key: 'form',
        storage
      }, formReducer
    )
}));
 
export default () => {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  const mapStateToProps = state => ({
    email: state.form.email,
    app: state.form.app,
    savedToCloud: state.form.savedToCloud
  });
  return { store, persistor, mapStateToProps };
};