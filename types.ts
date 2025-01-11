export interface Task {
    id: number;
    value: string;
    completed: boolean;
    isEditing?: boolean;
    createdAt: Date;
    completedAt?: Date;  // Optional as it only exists when task is completed
    lastEditedAt: Date;
  }