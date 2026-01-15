import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderApp = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('App', () => {
  it('renders the home page', () => {
    renderApp();
    expect(screen.getByText('TDD TS Template')).toBeInTheDocument();
  });

  it('shows welcome message', () => {
    renderApp();
    expect(screen.getByText(/Welcome to your TDD-ready TypeScript monorepo/)).toBeInTheDocument();
  });
});
