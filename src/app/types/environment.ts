export interface Environment {
  name: string;
  origin: string;
  owner: any;
}

type YesNo = 'yes' | 'no';

export interface CreateEnvironmentFormData {
  stack: string;
  dbs?: YesNo;
  async?: YesNo;
  onebb_mock_mode?: YesNo;
}
