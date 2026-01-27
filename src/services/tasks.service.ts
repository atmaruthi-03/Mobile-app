import { Task, TaskUpdatePayload } from '../types/task';

// MOCK DATA
const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Site Survey & Marking',
    description: 'Verify site boundaries and mark foundation layout according to blueprint V2.',
    status: 'Done',
    assignedTo: { id: 'u1', name: 'John A.' },
    plannedDate: '2026-01-10',
    actualDate: '2026-01-11',
    updatedAt: '2026-01-11T14:30:00Z',
    timeline: [
      {
        id: 'i1',
        type: 'update',
        timestamp: '2026-01-11T14:30:00Z',
        user: { id: 'u1', name: 'John A.' },
        content: 'Survey complete. Markers placed.',
        attachments: ['https://via.placeholder.com/300']
      }
    ]
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Excavation Phase 1',
    description: 'Digging for main foundation block using excavator. Ensure depth check.',
    status: 'In Progress',
    assignedTo: { id: 'u2', name: 'Mike T.' },
    plannedDate: '2026-01-15',
    updatedAt: '2026-01-20T09:15:00Z',
    timeline: []
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Rebar Installation',
    description: 'Install steel reinforcement grid as per structural drawings.',
    status: 'Blocked',
    assignedTo: { id: 'u3', name: 'Sarah L.' },
    plannedDate: '2026-01-22',
    updatedAt: '2026-01-21T16:45:00Z',
    timeline: [
      {
        id: 'i2',
        type: 'issue',
        timestamp: '2026-01-21T16:45:00Z',
        user: { id: 'u3', name: 'Sarah L.' },
        content: 'Waiting for steel delivery. Supplier delayed.',
      }
    ]
  },
  {
    id: 't4',
    projectId: 'p1',
    title: 'Concrete Pouring',
    description: 'Pour M25 grade concrete. Requires curing period of 7 days.',
    status: 'Open',
    plannedDate: '2026-01-25',
    updatedAt: '2026-01-10T08:00:00Z',
    timeline: []
  }
];

export const fetchTasks = async (projectId: string): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  // Return all mock tasks for now, logically filtering in a real app
  return MOCK_TASKS; 
};

export const fetchTaskDetails = async (taskId: string): Promise<Task | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_TASKS.find(t => t.id === taskId) || null;
};

export const uploadTaskUpdate = async (payload: TaskUpdatePayload): Promise<boolean> => {
  console.log('[Mock API] Uploading update:', payload);
  
  // Simulate multipart upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation:
  // const formData = new FormData();
  // formData.append('image', { uri: payload.image.uri, name: 'photo.jpg', type: 'image/jpeg' });
  // if (payload.comment) formData.append('comment', payload.comment);
  // await api.post(`/tasks/${payload.taskId}/updates`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return true;
};
