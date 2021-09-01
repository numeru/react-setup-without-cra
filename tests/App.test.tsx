import { render } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('<App />', () => {
  it('app text', () => {
    const { getByText } = render(<App />);
    const AppText = getByText('App');

    expect(AppText).toBeInTheDocument();
  });
});
