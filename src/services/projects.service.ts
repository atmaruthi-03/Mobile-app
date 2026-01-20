import api from './api';

export interface BackendProject {
  _id: string;
  name: string;
  status: string;
  location: string;
  domain: string;
}

export interface ProjectsResponse {
  projects: BackendProject[];
}

export async function fetchProjects(): Promise<BackendProject[]> {
  const response = await api.get<ProjectsResponse>('/alfred/projects');
  return response.data.projects;
}
