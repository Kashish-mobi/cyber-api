export type User = {
  id: number;
  name: string;
  email: string;
  username?: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  username: string;
  password: string;
};