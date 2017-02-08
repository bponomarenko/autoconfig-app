import { InMemoryDbService, HttpMethodInterceptorArgs } from 'angular-in-memory-web-api';

export class InMemoryEnvironmentsService implements InMemoryDbService {
  createDb() {
    let environments = [];
    return { environments };
  }
}
