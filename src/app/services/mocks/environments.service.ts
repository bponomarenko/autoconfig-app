import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryEnvironmentsService implements InMemoryDbService {
  createDb() {
    let stacks = ['gembucket-74', 'overhold-98', 'asoka-13', 'zaam-dox-29', 'it-52', 'zathin-5', 'daltfresh-44', 'veribet-73', 'vagram-64', 'regrant-90', 'tres-zap-85', 'holdlamis-81', 'viva-36', 'stronghold-52', 'alpha-37'];
    let environments = [{
      "name": "toughjoyfax-38",
      "owner": {
        "name": "gfox0",
        "email": "dwest0@foxnews.com"
      },
      "expire_at": "2017-03-03T05:28:05Z",
      "stack": "holdlamis-81-35",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "andalax-33",
      "owner": {
        "name": "tortiz1",
        "email": "lwebb1@gnu.org"
      },
      "expire_at": "2017-02-23T14:43:37Z",
      "stack": "vagram-64-36",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "flowdesk-83",
      "owner": {
        "name": "jhowell2",
        "email": "sgreene2@time.com"
      },
      "public": false,
      "expire_at": "2017-03-20T16:22:16Z",
      "stack": "gembucket-74-68",
      "config": {
        "keep": "yes"
      }
    }, {
      "name": "zamit-93",
      "owner": {
        "name": "kgreene3",
        "email": "jmorales3@illinois.edu"
      },
      "expire_at": "2017-03-08T04:12:22Z",
      "stack": "regrant-90-7",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "ronstring-9",
      "owner": {
        "name": "mperry4",
        "email": "bryan4@boston.com"
      },
      "expire_at": "2017-03-27T10:43:21Z",
      "stack": "zathin-5-24",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "keylex-17",
      "owner": {
        "name": "kelliott5",
        "email": "kdiaz5@unc.edu"
      },
      "expire_at": "2017-03-23T14:42:34Z",
      "stack": "tres-zap-85-87",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "tampflex-2",
      "owner": {
        "name": "jgrant6",
        "email": "jford6@nytimes.com"
      },
      "expire_at": "2017-03-05T18:11:28Z",
      "stack": "regrant-90-77",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "konklux-61",
      "owner": {
        "name": "apatterson7",
        "email": "aspencer7@theatlantic.com"
      },
      "public": false,
      "expire_at": "2017-03-19T14:40:49Z",
      "stack": "stronghold-52-18",
      "config": {
        "keep": "yes"
      }
    }, {
      "name": "bigtax-26",
      "owner": {
        "name": "eevans8",
        "email": "smurphy8@cbsnews.com"
      },
      "public": false,
      "expire_at": "2017-03-22T13:44:17Z",
      "stack": "asoka-13-31",
      "config": {
        "keep": "no"
      }
    }, {
      "name": "zaam-dox-32",
      "owner": {
        "name": "wstanley9",
        "email": "jcunningham9@cpanel.net"
      },
      "public": true,
      "expire_at": "2017-02-27T16:09:05Z",
      "stack": "regrant-90-79",
      "config": {
        "keep": "no"
      }
    }];

    return { stacks, environments };
  }
}
