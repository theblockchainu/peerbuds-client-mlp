import { PeerbudsClientPage } from './app.po';

describe('peerbuds-client App', () => {
  let page: PeerbudsClientPage;

  beforeEach(() => {
    page = new PeerbudsClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
