import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Initial check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Perform initial check
    checkMobile();

    // Set up event listener for resize
    window.addEventListener('resize', checkMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fallback to desktop on server-side rendering
  if (isMobile === undefined) {
    return false;
  }

  return !!isMobile;
}

// Helper hook to get specific breakpoints
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState({
    isXs: false, // < 480px
    isSm: false, // >= 480px
    isMd: false, // >= 768px
    isLg: false, // >= 1024px
    isXl: false, // >= 1280px
  });

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isXs: width < 480,
        isSm: width >= 480 && width < 768,
        isMd: width >= 768 && width < 1024,
        isLg: width >= 1024 && width < 1280,
        isXl: width >= 1280,
      });
    };

    // Initial check
    updateBreakpoint();

    // Update on resize
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Extra helper for smaller screens
export function useIsSmallScreen() {
  const [isSmall, setIsSmall] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkSmallScreen = () => {
      setIsSmall(window.innerWidth < 640);
    };

    // Initial check
    checkSmallScreen();

    // Update on resize
    window.addEventListener('resize', checkSmallScreen);

    return () => window.removeEventListener('resize', checkSmallScreen);
  }, []);

  // Fallback to desktop on server-side rendering
  if (isSmall === undefined) {
    return false;
  }

  return !!isSmall;
}
