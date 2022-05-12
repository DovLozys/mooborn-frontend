import { render, screen } from '@testing-library/react';
import Navbar from './index';

test('renders learn react link', () => {
  render(<Navbar title='Hello'/>);
  const title = screen.getByText(/Henlo/i);
  expect(title).toBeInTheDocument();
});
