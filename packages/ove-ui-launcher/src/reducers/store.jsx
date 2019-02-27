/* jshint ignore:start */
// JSHint cannot deal with React.
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import Constants from '../constants/launcher';

export default () => {
    const formReducer = (state = {}, action) => {
        switch (action.type) {
            case Constants.UPDATE:
                return {
                    ...state,
                    email: action.email,
                    app: action.app,
                    mode: action.mode,
                    space: action.space,
                    geometry: action.geometry,
                    url: action.url,
                    state: action.state,
                    config: action.config,
                    deleteSections: action.deleteSections,
                    showController: action.showController,
                    controllerURL: action.controllerURL
                };
            default:
                return state;
        }
    };   
    const persistedReducer = persistReducer({
        key: 'root',
        storage,
        blacklist: Constants.BLACKLIST
    }, combineReducers({
        form: persistReducer({
            key: 'form',
            storage,
            blacklist: Constants.BLACKLIST
        }, formReducer)
    }));
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
    const mapStateToProps = (state, ownProps) => ({
        email: state.form.email,
        app: state.form.app,
        mode: state.form.mode,
        space: state.form.space,
        spaces: state.form.spaces,
        geometry: state.form.geometry,
        url: state.form.url,
        state: state.form.state,
        states: state.form.states,
        deleteSections: state.form.deleteSections,
        showController: state.form.showController,
        controllerURL: state.form.controllerURL,
        log: ownProps.log
    });
    return { store, persistor, mapStateToProps };
};