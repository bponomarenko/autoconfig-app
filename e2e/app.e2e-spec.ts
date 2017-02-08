import { AutoconfigAppPage } from './app.po';

describe('autoconfig-app App', function() {
  let page: AutoconfigAppPage;

  beforeEach(() => {
    page = new AutoconfigAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
