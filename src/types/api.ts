export interface PostAuthBody {
  login: string;
  password: string;
}

export type PostAuthResponse = string;

export interface GetTopicsParams {
  jwt: string;
  login: string;
}

export interface GetTopicsParamsResponse {
  result: {
    topics: {
      [id: string]: string;
    };
  };
}
