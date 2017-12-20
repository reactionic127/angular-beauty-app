import en from './translations/en';
import fr from './translations/fr';

/** @ngInject */
export function translationsConfig($translateProvider) {
  $translateProvider.useSanitizeValueStrategy(null);
  $translateProvider.translations('us', en);

  $translateProvider.translations('fr', fr);

  $translateProvider.preferredLanguage('us');
}

