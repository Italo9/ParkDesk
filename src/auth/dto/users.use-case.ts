export class CreateUserStackDto {
  display_name: string;
  profile_image_url?: string;
  client_metadata?: Record<string, any>;
  client_read_only_metadata?: Record<string, any>;
  server_metadata?: Record<string, any>;
  primary_email: string;
  primary_email_verified?: boolean;
  primary_email_auth_enabled?: boolean;
  password: string;
  totp_secret_base64?: string;
}
export class UpdateUserStackDto {
  display_name?: string;
  profile_image_url?: string;
  client_metadata?: Record<string, any>;
  client_read_only_metadata?: Record<string, any>;
  server_metadata?: Record<string, any>;
  primary_email?: string;
  primary_email_verified?: boolean;
  primary_email_auth_enabled?: boolean;
  password?: string;
  totp_secret_base64?: string;
  selected_team_id?: string;
}
