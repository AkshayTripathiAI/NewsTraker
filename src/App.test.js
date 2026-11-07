import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

test('renders headlines returned by the API', async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        title: 'Sample headline',
        description: 'Sample description',
        url: 'https://example.com/a',
        source: { name: 'Example' },
      },
    ],
  });

  render(<App />);
  expect(screen.getByRole('heading', { name: /news aggregator/i })).toBeInTheDocument();
  expect(await screen.findByText('Sample headline')).toBeInTheDocument();
});

test('shows an error message when the API is unreachable', async () => {
  axios.get.mockRejectedValue(new Error('Network Error'));

  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the news api/i);
});
