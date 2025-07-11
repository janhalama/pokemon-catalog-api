import { App } from './app';

describe('App', () => {
  let app: App;

  beforeEach(() => {
    app = new App();
  });

  afterEach(async () => {
    await app.stop();
  });

  it('should create an App instance', () => {
    expect(app).toBeInstanceOf(App);
  });
}); 