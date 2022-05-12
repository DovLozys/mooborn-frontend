import { render, screen } from '@testing-library/react';
import UserRoleChooser from './UserRoleChooser';

test('renders Childcare role text', () => {
  render(<UserRoleChooser />);
  const linkElement = screen.getByText(/Childcare role/i);
  expect(linkElement).toBeInTheDocument();
});
