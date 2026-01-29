export type TaskStatus = 'Open' | 'In Progress' | 'Blocked' | 'Done';

export interface Interaction {
  id: string;
  type: 'update' | 'check_in' | 'issue';
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  attachments?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Task {
  id: string;
  projectId: string; // Link to project
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  plannedDate: string;
  actualDate?: string;
  updatedAt: string;
  timeline: Interaction[];
}

export interface TaskUpdatePayload {
  taskId: string;
  image: any; // We'll refine this type for multipart upload
  comment?: string;
  status?: TaskStatus;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
