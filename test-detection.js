import { access, constants } from 'fs';

access('./next-intl.config.mjs', constants.F_OK, (err) => {
  if (err) {
    console.error('Fichier NON détecté');
  } else {
    console.log('Fichier détecté !');
  }
}); 