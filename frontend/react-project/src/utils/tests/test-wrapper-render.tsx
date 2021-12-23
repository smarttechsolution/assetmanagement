// @ts-nocheck
import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import initialReduxState from '../../store/helper/default-state';
import rootReducer from '../../store/root-reducer';

function render(
    ui,
    {
        initialState = initialReduxState,
        store = createStore(rootReducer, applyMiddleware(thunk)),
        ...renderOptions
    }
) {
    function Wrapper({ children }) {
        const history = createMemoryHistory();

        return (
            <Provider store={store}>
                <Router history={history}>
                    <Suspense fallback="...">
                        {children}
                    </Suspense>
                </Router>
            </Provider>
        )
    }

    return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
}

export * from '@testing-library/react'

export { render };