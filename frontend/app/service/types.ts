export type logintype = {
  username: string;
  password: string;
}

export type LogRes = {
  token: string
}

export type visitorType = {
  id: number;
  username: string;
  password: string;
  status: string;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}
