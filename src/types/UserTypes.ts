
export type AdminUserTypes = {
  email: string;
}

export type ClientUserTypes = {
  cpf: string;
}

export type UserDataUserPoolType = {
  Username: string;
  Password?: string;
  UserPoolId: string | undefined;
  ClientId: string | undefined;
  IdentityPoolId: string | undefined;
}

export type UserConfirmationData = {
  Username: string;
  UserPoolId: string | undefined;
}

