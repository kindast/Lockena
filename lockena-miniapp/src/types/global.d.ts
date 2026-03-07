export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        colorScheme: "light" | "dark";
        themeParams: Record<string, string>;
        ready: () => void;
        expand: () => void;
        close: () => void;
        onEvent: (event: string, cb: () => void) => void;
        initDataUnsafe?: {
          user?: {
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
      };
    };
  }
}
