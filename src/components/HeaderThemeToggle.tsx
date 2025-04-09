import React from 'react';
import { ThemeToggleButton } from './ThemeToggle';

const HeaderThemeToggle = () => {
  // This component is no longer needed as we've moved the toggle directly into the Header
  // Keeping this file to avoid breaking imports elsewhere, but it just re-exports ThemeToggleButton
  return (
    <div className="flex items-center">
      <ThemeToggleButton />
    </div>
  );
};

export default HeaderThemeToggle;
