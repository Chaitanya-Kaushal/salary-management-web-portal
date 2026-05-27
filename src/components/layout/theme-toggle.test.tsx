import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './theme-toggle';

let mockResolvedTheme = 'light';
const setThemeMock = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme, setTheme: setThemeMock }),
}));

describe('theme toggle', () => {
  beforeEach(() => {
    setThemeMock.mockClear();
    mockResolvedTheme = 'light';
  });

  it('switches to dark when current theme is light', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('switches to light when current theme is dark', async () => {
    mockResolvedTheme = 'dark';
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
