import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './Header';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Header', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    localStorage.clear();
  });

  it('should render login link when not logged in', () => {
    render(<Header />);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('should render account dropdown when logged in', () => {
    localStorage.setItem('ushereel_token', 'token');
    render(<Header />);
    expect(screen.getByText('ACCOUNT')).toBeTruthy();
  });

  it('should logout and redirect to home', () => {
    localStorage.setItem('ushereel_token', 'token');
    render(<Header />);
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);
    expect(localStorage.getItem('ushereel_token')).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
