export type YesNo = 'yes' | 'no';

export interface Environment {
  name: string;
  origin: string;
  owner: any;
}

export interface CreateEnvironmentOptions {
  stackName: string;
  username: string;
  password: string;
  data: {
    async: YesNo;
    version?: string;
    keep?: YesNo;
    dbs?: YesNo;
    enable_demo?: YesNo;
    onebb_mock_mode?: YesNo;
  };
}

export interface RemoveEnvironmentOptions {
  environmentName: string;
  username: string;
  password: string;
}
