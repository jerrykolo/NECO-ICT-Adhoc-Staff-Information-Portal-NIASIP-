export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresIn: number;
  staffId: string;
  fullName: string;
  role: string;
  firstLogin: boolean;
  passportPhoto: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
