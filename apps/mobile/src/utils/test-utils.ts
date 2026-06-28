interface ScreenState {
  routeName: string;
  params?: Record<string, unknown>;
}

interface NavigationMock {
  navigate: (routeName: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
  getCurrentScreen: () => ScreenState;
}

export function createMockNavigation(initial: ScreenState): NavigationMock {
  let currentScreen = initial;
  return {
    navigate(routeName, params) {
      currentScreen = { routeName, params };
    },
    goBack() {
      currentScreen = initial;
    },
    getCurrentScreen() {
      return currentScreen;
    },
  };
}

export function createMockScreenState(overrides: Partial<ScreenState> = {}): ScreenState {
  return { routeName: "Home", params: {}, ...overrides };
}

export function assertOnScreen(nav: NavigationMock, expectedRoute: string): void {
  const current = nav.getCurrentScreen();
  if (current.routeName !== expectedRoute) {
    throw new Error(`Expected screen "${expectedRoute}", got "${current.routeName}"`);
  }
}
