import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LuxuryPreview } from './LuxuryPreview';

describe('LuxuryPreview', () => {
  it('should render correctly', () => {
    render(<LuxuryPreview />);
    expect(screen.getByText('UsheReel')).toBeTruthy();
    expect(screen.getByText('GET STARTED')).toBeTruthy();
    expect(screen.getByText('Global Operations')).toBeTruthy();
  });
});
