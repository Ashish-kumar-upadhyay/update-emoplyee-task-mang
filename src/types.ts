export interface Task {
  id: string;
  title: string;
  description: string;
  timeSpent: number;
  priority: 'low' | 'medium' | 'high';
  type: 'BAU' | 'Ad Hoc' | 'Project';
  completed: boolean;
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  points: number;
  badges: Badge[];
  completedTasks: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'alert';
  createdAt: Date;
  read: boolean;
}