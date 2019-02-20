/* jshint ignore:start */
// JSHint cannot deal with React.
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export default () => {
    const formReducer = (state = {}, action) => {
        switch (action.type) {
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
        storage,
        blacklist: ['log']
    }, combineReducers({
        form: persistReducer({
            key: 'form',
            storage,
            blacklist: ['log']
        }, formReducer)
    }));
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
    const mapStateToProps = (state, ownProps) => ({
        email: state.form.email,
        app: state.form.app,
        savedToCloud: state.form.savedToCloud,
        log: ownProps.log
    });
    return { store, persistor, mapStateToProps };
};