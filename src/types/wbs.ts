export interface WBSTask {
  task_id: string;          // backend identifier
  id: string;               // short display ID
  title: string;
  description: string;
  status: string;
  type: string;
  responsible_party: string;
  start_date: string;
  due_date: string;
  duration_days: number;
  progress: number;
  is_critical: boolean;
  is_milestone: boolean;
  milestone_type: string | null;
  reasoning: string | null;
  is_external_dependency: boolean;
  requires_approval_from: string | null;
  dependencies: {
    relationship_type: string;
    lag_days: number;
    lead_days: number;
  }[];
}

export interface IWP {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  start_date: string;
  due_date: string;
  tasks: WBSTask[];
}

export interface CWP {
  id: string; // This might be cwp_id or similar from backend, using id for consistency
  title: string;
  description: string;
  progress: number; // 0-100
  start_date: string;
  due_date: string;
  iwps: IWP[];
  site_id?: string;
  site_name?: string;
}

export interface Site {
  site_id: string;
  site_name: string;
}

export interface WBSResult {
  cwps: CWP[];
  sites: Site[];
}
