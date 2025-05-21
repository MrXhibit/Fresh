import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Availability from '../page';

describe('Availability Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage
    localStorage.getItem.mockReturnValue('fake-token');
  });

  it('renders availability form', () => {
    render(<Availability />);
    
    // Check if all days are present
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('Wednesday')).toBeInTheDocument();
    expect(screen.getByText('Thursday')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    
    // Check if save button is present
    expect(screen.getByRole('button', { name: /save availability/i })).toBeInTheDocument();
  });

  it('handles time slot changes', async () => {
    render(<Availability />);
    
    // Get Monday's start time select
    const mondayStartTime = screen.getByLabelText(/monday.*start time/i);
    
    // Change the start time
    await userEvent.selectOptions(mondayStartTime, '10:00');
    
    // Check if the value was updated
    expect(mondayStartTime).toHaveValue('10:00');
  });

  it('handles availability toggle', async () => {
    render(<Availability />);
    
    // Get Monday's checkbox
    const mondayCheckbox = screen.getByLabelText(/monday/i);
    
    // Toggle availability
    fireEvent.click(mondayCheckbox);
    
    // Check if the checkbox is unchecked
    expect(mondayCheckbox).not.toBeChecked();
    
    // Check if time selects are disabled
    const mondayStartTime = screen.getByLabelText(/monday.*start time/i);
    const mondayEndTime = screen.getByLabelText(/monday.*end time/i);
    expect(mondayStartTime).toBeDisabled();
    expect(mondayEndTime).toBeDisabled();
  });

  it('handles form submission', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Availability updated successfully' }),
    });

    render(<Availability />);
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save availability/i }));
    
    // Check if fetch was called with correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token',
        },
        body: expect.any(String),
      });
    });
  });

  it('redirects to login if not authenticated', () => {
    // Mock localStorage to return null (no token)
    localStorage.getItem.mockReturnValue(null);
    
    // Mock router.push
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
    });
    
    render(<Availability />);
    
    // Check if redirected to login
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('handles save failure', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Availability />);
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save availability/i }));
    
    // Check if error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to update availability');
    });
    
    consoleSpy.mockRestore();
  });
}); 