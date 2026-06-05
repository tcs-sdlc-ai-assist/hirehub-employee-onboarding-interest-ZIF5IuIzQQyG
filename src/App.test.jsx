import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock localStorage/sessionStorage for test isolation
function setupStorage() {
  let store = {};
  let session = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
      removeItem: vi.fn(key => { delete store[key]; }),
      clear: vi.fn(() => { store = {}; })
    },
    writable: true
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn(key => session[key] || null),
      setItem: vi.fn((key, val) => { session[key] = val; }),
      removeItem: vi.fn(key => { delete session[key]; }),
      clear: vi.fn(() => { session = {}; })
    },
    writable: true
  });
}

describe('App integration', () => {
  beforeEach(() => {
    setupStorage();
    window.history.pushState({}, '', '/');
  });

  it('renders header and landing page by default', () => {
    render(<App />);
    expect(screen.getByText(/HireHub Onboarding Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to HireHub Onboarding Portal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply Now/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Admin Dashboard/i })).toBeInTheDocument();
  });

  it('navigates to /apply and shows the interest form', async () => {
    render(<App />);
    const applyBtn = screen.getByRole('button', { name: /Apply Now/i });
    fireEvent.click(applyBtn);
    await waitFor(() => {
      expect(screen.getByText(/Apply for Onboarding/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });
  });

  it('navigates to /admin and shows admin login', async () => {
    render(<App />);
    const adminBtn = screen.getByRole('button', { name: /Admin Dashboard/i });
    fireEvent.click(adminBtn);
    await waitFor(() => {
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Admin Password/i)).toBeInTheDocument();
    });
  });

  it('shows error on wrong admin password and allows login with correct password', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Admin Dashboard/i }));
    await waitFor(() => {
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    });
    const pwdInput = screen.getByLabelText(/Admin Password/i);
    fireEvent.change(pwdInput, { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
    });
    fireEvent.change(pwdInput, { target: { value: 'hirehubadmin' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Submissions/i)).toBeInTheDocument();
    });
  });

  it('header navigation links work and highlight active', async () => {
    render(<App />);
    // Home is active
    expect(screen.getByText('Home').className).toMatch(/active/);
    // Go to Apply
    fireEvent.click(screen.getByText('Apply'));
    await waitFor(() => {
      expect(screen.getByText(/Apply for Onboarding/i)).toBeInTheDocument();
      expect(screen.getByText('Apply').className).toMatch(/active/);
    });
    // Go to Admin
    fireEvent.click(screen.getByText('Admin'));
    await waitFor(() => {
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
      expect(screen.getByText('Admin').className).toMatch(/active/);
    });
    // Go Home
    fireEvent.click(screen.getByText('Home'));
    await waitFor(() => {
      expect(screen.getByText(/Welcome to HireHub Onboarding Portal/i)).toBeInTheDocument();
      expect(screen.getByText('Home').className).toMatch(/active/);
    });
  });

  it('redirects unknown routes to home', async () => {
    window.history.pushState({}, '', '/not-a-real-route');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome to HireHub Onboarding Portal/i)).toBeInTheDocument();
    });
  });
});