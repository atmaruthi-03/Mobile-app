export type ProjectStatus = 'In Progress' | 'Completed' | 'Pending';

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  updatedAt: string;
  thumbnail?: any; // For now, we'll use a local image or color
}
