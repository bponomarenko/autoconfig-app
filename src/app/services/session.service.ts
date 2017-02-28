const Key = {
  LOGS_ENVIRONMENT: 'logs.environmentName'
};

export class SessionService {
  private session = sessionStorage;

  get logsEnvironmentName() {
    return this.session.getItem(Key.LOGS_ENVIRONMENT);
  }

  set logsEnvironmentName(environmentName: string) {
    this.session.setItem(Key.LOGS_ENVIRONMENT, environmentName);
  }
}
