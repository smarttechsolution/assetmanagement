import React from 'react';
import { createMemoryHistory } from 'history'
import { render } from './utils/tests/test-wrapper-render';
import '@testing-library/jest-dom/extend-expect'

import App from './App';

test('Login page rendered when no session', () => {
    const history = createMemoryHistory();
    
    render(
        {},
        <App />
    )
    // check if login page
    expect(history.location.pathname).toEqual('/login')

})