export class UserAuth {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class UserStackAuth {
  status: number;
  data: {
    id: string;
    primary_email_verified: boolean;
    primary_email_auth_enabled: boolean;
    signed_up_at_millis: number;
    last_active_at_millis: number;
    primary_email: string;
    display_name: string;
    selected_team?: { created_at_millis: number; id: string; display_name: string; server_metadata?: Record<string, any>; profile_image_url?: string; client_metadata?: Record<string, any>; client_read_only_metadata?: Record<string, any>; };
    selected_team_id?: string;
    profile_image_url?: string;
    client_metadata?: Record<string, any>;
    client_read_only_metadata?: Record<string, any>;
    server_metadata?: Record<string, any>;
  };
}

export class UserListAllStackAuth {
  items: UserItem[];
  pagination?: Pagination;
}

export class UserItem {
  id: string;
  primary_email_verified: boolean;
  primary_email_auth_enabled: boolean;
  signed_up_at_millis: number;
  last_active_at_millis: number;
  primary_email: string;
  display_name: string;
  selected_team: SelectedTeam;
  selected_team_id: string;
  profile_image_url: string;
  client_metadata: Record<string, any>;
  client_read_only_metadata: Record<string, any>;
  server_metadata: Record<string, any>;
}

export class SelectedTeam {
  created_at_millis: number;
  id: string;
  display_name: string;
  profile_image_url: string;
  server_metadata: Record<string, any>;
  client_metadata: Record<string, any>;
  client_read_only_metadata: Record<string, any>;
}

export class Pagination {
  next_cursor: string;
}
