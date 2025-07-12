export type CreateUserRequest = {
  email: string;
  password: string;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string;
};

export type JwtPayload = {
  userId: number;
  email: string;
  name: string;
  iat: number;
  exp: number;
}; 