type YesNo = 'yes' | 'no';

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
    async: boolean;
    version?: string;
    keep?: YesNo;
  };
}

export interface RemoveEnvironmentOptions {
  environmentName: string;
  username: string;
  password: string;
}
