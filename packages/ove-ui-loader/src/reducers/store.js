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
                    mode: action.mode,
                    space: action.space,
                    geometry: action.geometry,
                    url: action.url,
                    state: action.state,
                    config: action.config,
                    deleteSections: action.deleteSections,
                    showPreview: action.showPreview,
                    showController: action.showController
                };
            default:
                return state;
        }
    };   
    const persistedReducer = persistReducer({
        key: 'root',
        storage,
        blacklist: ['log', 'spaces', 'states']
    }, combineReducers({
        form: persistReducer({
            key: 'form',
            storage,
            blacklist: ['log', 'spaces', 'states']
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
        showPreview: state.form.showPreview,
        showController: state.form.showController,
        log: ownProps.log
    });
    return { store, persistor, mapStateToProps };
};