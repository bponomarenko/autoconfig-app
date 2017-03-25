import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryEnvironmentsService implements InMemoryDbService {
  createDb() {
    let stacks = ['gembucket-74', 'overhold-98', 'asoka-13', 'zaam-dox-29', 'it-52', 'zathin-5', 'daltfresh-44', 'veribet-73', 'vagram-64', 'regrant-90', 'tres-zap-85', 'holdlamis-81', 'viva-36', 'stronghold-52', 'alpha-37'];
    let environments = [{
  "name": "treeflex-67",
  "owner": {
    "name": "sscott0",
    "email": "jmorris0@techcrunch.com"
  },
  "public": false,
  "expire_at": "2017-03-17T18:29:53Z",
  "stack": "alpha-37-27",
  "status": 4,
  "config": {
    "keep": "no",
    "version": "8.8",
    "server": "rutrum",
    "db": "morbi",
    "java": 9,
    "ttl": "4h"
  }
}, {
  "name": "regrant-49",
  "owner": {
    "name": "rmyers1",
    "email": "jowens1@bloomberg.com"
  },
  "public": true,
  "expire_at": "2017-02-25T06:08:59Z",
  "stack": "zathin-5-52",
  "status": 3,
  "config": {
    "keep": "yes",
    "version": "0.9.6",
    "server": "ultrices",
    "db": "in",
    "java": 4,
    "ttl": "0h"
  }
}, {
  "name": "alphazap-42",
  "owner": {
    "name": "bpatterson2",
    "email": "aray2@simplemachines.org"
  },
  "public": false,
  "expire_at": "2017-03-13T17:21:41Z",
  "stack": "holdlamis-81-35",
  "status": -1,
  "config": {
    "keep": "no",
    "version": "1.3",
    "server": "posuere",
    "db": "maecenas",
    "java": 10,
    "ttl": "2h"
  }
}, {
  "name": "y-solowarm-58",
  "owner": {
    "name": "jcarter3",
    "email": "dturner3@furl.net"
  },
  "public": false,
  "expire_at": "2017-03-09T12:22:02Z",
  "stack": "viva-36-13",
  "status": 5,
  "config": {
    "keep": "no",
    "version": "0.8.8",
    "server": "accumsan",
    "db": "arcu",
    "java": 6,
    "ttl": "5h"
  }
}, {
  "name": "redhold-18",
  "owner": {
    "name": "rjohnson4",
    "email": "hwest4@technorati.com"
  },
  "expire_at": "2017-03-13T21:56:06Z",
  "stack": "zathin-5-82",
  "status": 3,
  "config": {
    "keep": "yes",
    "version": "0.7.4",
    "server": "interdum",
    "db": "id",
    "java": 7,
    "ttl": "50d"
  }
}, {
  "name": "vagram-81",
  "owner": {
    "name": "rsims5",
    "email": "jwoods5@loc.gov"
  },
  "public": true,
  "expire_at": "2017-03-26T19:50:06Z",
  "stack": "veribet-73-47",
  "status": 2,
  "config": {
    "keep": "no",
    "version": "0.14",
    "server": "dictumst",
    "db": "semper",
    "java": 5,
    "ttl": "00d"
  }
}, {
  "name": "opela-65",
  "owner": {
    "name": "rford6",
    "email": "fcruz6@tiny.cc"
  },
  "expire_at": "2017-03-15T10:46:15Z",
  "stack": "viva-36-16",
  "status": 2,
  "config": {
    "keep": "no",
    "version": "0.2.3",
    "server": "consequat",
    "db": "etiam",
    "java": 4,
    "ttl": "45d"
  }
}, {
  "name": "ventosanzap-60",
  "owner": {
    "name": "wmartin7",
    "email": "sbishop7@macromedia.com"
  },
  "public": true,
  "expire_at": "2017-02-22T04:36:40Z",
  "stack": "vagram-64-56",
  "status": 1,
  "config": {
    "keep": "no",
    "version": "0.2.6",
    "server": "id",
    "db": "vehicula",
    "java": 7,
    "ttl": "65h"
  }
}, {
  "name": "it-90",
  "owner": {
    "name": "avasquez8",
    "email": "ihall8@sphinn.com"
  },
  "public": true,
  "expire_at": "2017-03-16T12:51:55Z",
  "stack": "daltfresh-44-89",
  "status": 3,
  "config": {
    "keep": "no",
    "version": "9.7",
    "server": "cursus",
    "db": "tempus",
    "java": 4,
    "ttl": "8d"
  }
}, {
  "name": "wrapsafe-71",
  "owner": {
    "name": "pmartinez9",
    "email": "bkennedy9@guardian.co.uk"
  },
  "public": true,
  "expire_at": "2017-03-02T05:52:26Z",
  "stack": "asoka-13-42",
  "status": 2,
  "config": {
    "keep": "no",
    "version": "8.02",
    "server": "quam",
    "db": "quis",
    "java": 4,
    "ttl": "74h"
  }
}];

    return { stacks, environments };
  }
}
