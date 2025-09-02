import { render, screen } from '@testing-library/react';
import Home from './page';

// Test that verifies the component renders correctly
describe('Home Page', () => {
  it('should render the home page with correct title', () => {
    // Render the component
    render(<Home />);
    
    // Check if the main heading is present
    const heading = screen.getByText(/Interactive Story Engine/i);
    expect(heading).toBeInTheDocument();
    
    // Check if the description is present  
    const description = screen.getByText(/Physics, Component System & Auto-generation Features/i);
    expect(description).toBeInTheDocument();
  });

  it('should render component system demo', () => {
    render(<Home />);
    
    // Check for button in demo
    const countButton = screen.getByRole('button', { name: /Count:/i });
    expect(countButton).toBeInTheDocument();
  });
});