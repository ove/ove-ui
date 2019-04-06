/* jshint ignore:start */
// JSHint cannot deal with React.
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import Constants from '../constants/preview';

export default () => {
    const formReducer = (state = {}, action) => {
        switch (action.type) {
            case Constants.UPDATE:
                return {
                    ...state
                };
            default:
                return state;
        }
    };
    const persistedReducer = persistReducer({
        key: 'root',
        storage,
        blacklist: []
    }, combineReducers({
        form: persistReducer({
            key: 'form',
            storage,
            blacklist: []
        }, formReducer)
    }));
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
    const mapStateToProps = (_state, ownProps) => ({
        log: ownProps.log
    });
    return { store, persistor, mapStateToProps };
};
