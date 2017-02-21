const pckg = require('../../package.json');

export class AppSettings {
  static VERSION: string = `v${pckg.version}`;
}
