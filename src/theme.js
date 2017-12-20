export default themeConfig;

/** @ngInject */
function themeConfig($mdThemingProvider) {

  $mdThemingProvider.definePalette('primary', {
    '50': '#d3c8ee',
    '100': '#a38edc',
    '200': '#8163cf',
    '300': '#5938b3',
    '400': '#4e309b',
    '500': '#422984',
    '600': '#36226d',
    '700': '#2b1a55',
    '800': '#1f133e',
    '900': '#130c27',
    'A100': '#d3c8ee',
    'A200': '#a38edc',
    'A400': '#4e309b',
    'A700': '#2b1a55',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 A100 A200'
  });

  $mdThemingProvider.definePalette('mcgpalette1', {
    '50': '#e8eaf6',
    '100': '#c5cae9',
    '200': '#9fa8da',
    '300': '#7986cb',
    '400': '#5c6bc0',
    '500': '#3f51b5',
    '600': '#3949ab',
    '700': '#303f9f',
    '800': '#283593',
    '900': '#1a237e',
    'A100': '#8c9eff',
    'A200': '#536dfe',
    'A400': '#3d5afe',
    'A700': '#304ffe',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100'
  });

  $mdThemingProvider.theme('default')

    .primaryPalette('primary')

    .accentPalette('mcgpalette1');


}
