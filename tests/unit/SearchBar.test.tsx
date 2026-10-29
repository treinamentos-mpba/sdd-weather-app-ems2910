import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('submits the trimmed query and keeps the field editable', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Buscar cidade' });
    await user.type(input, '  Curitiba  ');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('Curitiba');
    expect(input).toHaveValue('  Curitiba  ');
  });

  it('does not submit an empty query and announces the validation message', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome de uma cidade para buscar.');
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
