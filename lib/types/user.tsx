export type User = {
  id: number;
  name: string;
  email: string;
  username?: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};