/*
 * If you change the following items in the config object, you will not see any effect in the local development server
 * as these are stored in the cookie (cookie has the highest priority over the themeConfig):
 * 1. mode
 * 2. skin
 * 3. semiDark
 * 4. layout
 * 5. navbar.contentWidth
 * 6. contentWidth
 * 7. footer.contentWidth
 *
 * To see the effect of the above items, you can click on the reset button from the Customizer
 * which is on the top-right corner of the customizer besides the close button.
 * This will reset the cookie to the values provided in the config object below.
 *
 * Another way is to clear the cookie from the browser's Application/Storage tab and then reload the page.
 */

// Type Imports
import type { Mode, Skin, Layout, LayoutComponentPosition, LayoutComponentWidth } from '@core/types'

type Navbar = {
  type: LayoutComponentPosition
  contentWidth: LayoutComponentWidth
  floating: boolean
  detached: boolean
  blur: boolean
}

type Footer = {
  type: LayoutComponentPosition
  contentWidth: LayoutComponentWidth
  detached: boolean
}

export type Config = {
  templateName: string
  homePageUrl: string
  settingsCookieName: string
  mode: Mode
  skin: Skin
  semiDark: boolean
  layout: Layout
  layoutPadding: number
  navbar: Navbar
  contentWidth: LayoutComponentWidth
  compactContentWidth: number
  footer: Footer
  disableRipple: boolean
  toastPosition: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
}

const themeConfig: Config = {
  templateName: 'Movisat',
  homePageUrl: '/',
  settingsCookieName: 'movisat-checklist-setting',
  mode: 'light', // 'system', 'light', 'dark'
  skin: 'default', // 'default', 'bordered'
  semiDark: false, // true, false
  layout: 'vertical', // 'vertical', 'collapsed', 'horizontal'
  layoutPadding: 24, // Common padding for header, content, footer layout components (in px)
  compactContentWidth: 1440, // in px
  navbar: {
    type: 'fixed', // 'fixed', 'static'
    contentWidth: 'wide', // 'compact', 'wide'
    floating: true, //! true, false (This will not work in the Horizontal Layout)
    detached: true, //! true, false (This will not work in the Horizontal Layout or floating navbar is enabled)
    blur: true // true, false
  },
  contentWidth: 'compact', // 'compact', 'wide'
  footer: {
    type: 'static', // 'fixed', 'static'
    contentWidth: 'compact', // 'compact', 'wide'
    detached: true //! true, false (This will not work in the Horizontal Layout)
  },
  disableRipple: true, // true, false
  toastPosition: 'top-right' // 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'
}

export default themeConfig

export const palette = {
  primary: {
    main: "#3baed6",
    light: "#3baed6",
    dark: "#3baed6",
    contrastText: "#FFFFFF",
    '50': '#eefafd',
    '100': '#d5f1f8',
    '200': '#afe3f2',
    '300': '#78cde8',
    '400': '#3baed6',
    '500': '#1e91bc',
    '600': '#1c759e',
    '700': '#1d5e81',
    '800': '#204f6a',
    '900': '#1f435a',
    'A100': '#0f2a3d',
  },
  secondary: {
    main: '#eb2528',
    light: '#eb2528',
    dark: '#eb2528',
    contrastText: '#FFFFFF',
    '50': '#fff1f1',
    '100': '#ffe0e0',
    '200': '#ffc6c7',
    '300': '#ff9e9f',
    '400': '#ff6769',
    '500': '#fc373a',
    '600': '#eb2528',
    '700': '#c51013',
    '800': '#a31113',
    '900': '#861618',
    'A100': '#490607',
  },
  error: {
    main: '#f62019',
    light: '#f62019',
    dark: '#f62019',
    contrastText: '#FFFFFF',
    50: '#fff0f0',
    100: '#ffdfde',
    200: '#ffc5c3',
    300: '#ff9c99',
    400: '#ff635e',
    500: '#ff332c',
    600: '#f62019',
    700: '#cf0c06',
    800: '#ab0e09',
    900: '#8d130f',
    A100: '#4d0402',
  },
  warning: {
    main: '#fdbd3f',
    contrastText: '#FFF',
    light: '#feda89',
    dark: '#fcaa23',
    '50': '#fff9eb',
    '100': '#feedc7',
    '200': '#feda89',
    '300': '#fdbd3f',
    '400': '#fcaa23',
    '500': '#f78609',
    '600': '#da6105',
    '700': '#b54108',
    '800': '#93320d',
    '900': '#792a0e',
    A100: '#451303',
  },
  success: {
    main: '#45d15c',
    light: '#45d15c',
    dark: '#45d15c',
    contrastText: '#FFFFFF',
    50: '#f1fcf2',
    100: '#defae2',
    200: '#bff3c7',
    300: '#8de89c',
    400: '#45d15c',
    500: '#2cbb44',
    600: '#1f9a33',
    700: '#1c792c',
    800: '#1b6027',
    900: '#184f23',
    A100: '#082b0f',
  },
  info: {
    main: '#5accff',
    light: '#5accff',
    dark: '#5accff',
    contrastText: '#FFFFFF',
    50: '#eefaff',
    100: '#daf3ff',
    200: '#bdebff',
    300: '#8fe0ff',
    400: '#5accff',
    500: '#34b1fd',
    600: '#2196f3',
    700: '#167bdf',
    800: '#1863b5',
    900: '#1a548e',
    A100: '#153456',
  },
  grey: {
    '50': '#f6f6f7',
    '100': '#e1e3e6',
    '200': '#c2c6cd',
    '300': '#9ca1ac',
    '400': '#767d8b',
    '500': '#5c6270',
    '600': '#484d59',
    '700': '#3c3f49',
    '800': '#33353c',
    '900': '#2d2e34',
    A100: '#16171b',
  },
  text: {
    primary: '#272a2a',
    secondary: '#3b3f3f',
    disabled: '#787f7e',
  },
};
