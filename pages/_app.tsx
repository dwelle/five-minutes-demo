import React from 'react';
import App from 'next/app';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.StrictMode>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
      </React.StrictMode>
    );
  }
}

export default MyApp;
