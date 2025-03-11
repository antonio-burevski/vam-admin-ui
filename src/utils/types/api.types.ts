 export interface IUserProfile {
  id: number;
  username: string;
  email: string;
  profile: { phone_number: string; address: string } | null;
  groups: string[];
  permissions: string[];
}
