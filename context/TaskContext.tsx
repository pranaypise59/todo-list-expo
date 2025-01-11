import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types';

interface TaskContextType {
  tasks: Task[];
  addTask: (value: string) => void;
  deleteTask: (id: number) => void;
  toggleComplete: (id: number) => void;
  updateTask: (id: number, value: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'taskManager:tasks';

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from storage on app start
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          lastEditedAt: new Date(task.lastEditedAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (value: string) => {
    const now = new Date();
    const newTask: Task = {
      id: Date.now(),
      value,
      completed: false,
      createdAt: now,
      lastEditedAt: now,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: number) => {
    const now = new Date();
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? now : undefined,
              lastEditedAt: now,
            }
          : task
      )
    );
  };

  const updateTask = (id: number, value: string) => {
    const now = new Date();
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              value,
              lastEditedAt: now,
            }
          : task
      )
    );
  };

  const contextValue = useMemo(() => ({
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
  }), [tasks, addTask, deleteTask, toggleComplete, updateTask]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
