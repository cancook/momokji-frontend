import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    screen: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
      phone: string;
      monitor: string;
    };
    colors: {
      primary: string;
      secondary: string;
      white: string;
      black: string;
    };
  }
}