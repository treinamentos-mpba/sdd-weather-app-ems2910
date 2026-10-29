import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('announces the active unit and reports a change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle onChange={onChange} unit="celsius" />);

    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });
});
