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

export type newVisitorType = {
  username: string;
  password: string;
  status: string;
}

export type Serie = {
	title: string;
	ep_list:string[];
	episode_count: number;
}

export type SerieResponse = {
	list: Serie[]
}
