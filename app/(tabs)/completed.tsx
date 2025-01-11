import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useTaskContext } from "@/context/TaskContext";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Task {
  id: number;
  value: string;
  completed: boolean;
  isEditing?: boolean;
  createdAt: Date;
  completedAt?: Date;
  lastEditedAt: Date;
}

export const CompletedTasksScreen = () => {
  const { tasks, deleteTask, addTask, toggleComplete } = useTaskContext();

  const groupedTasks = useMemo(() => {
    const completed = tasks.filter(task => task.completed && task.completedAt);
    const groups: { [key: string]: Task[] } = {};
    
    completed.forEach(task => {
      const dateKey = format(task.completedAt!, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, tasks]) => ({
        date,
        tasks: tasks.sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
      }));
  }, [tasks]);

  const handleRecreateTask = (task: Task) => {
    Alert.alert(
      "Recreate Task",
      "Do you want to recreate this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Recreate",
          onPress: () => {
            addTask(task.value);
          }
        }
      ]
    );
  };

  const handleDeleteTask = (taskId: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteTask(taskId),
          style: "destructive"
        }
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.completedTaskItem}>
      <View style={styles.checkbox}>
        <Feather name="check" size={16} color="white" />
      </View>
      <View style={styles.taskContent}>
        <Text style={styles.completedTaskText}>{item.value}</Text>
        <Text style={styles.dateText}>
          Completed: {format(item.completedAt!, 'HH:mm')}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleRecreateTask(item)}
          style={styles.actionButton}
        >
          <Feather name="refresh-ccw" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteTask(item.id)}
          style={styles.actionButton}
        >
          <Feather name="trash-2" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDateGroup = ({ item }: { item: { date: string; tasks: Task[] } }) => (
    <SafeAreaView style={styles.dateGroup}>
      <Text style={styles.dateHeader}>
        {format(new Date(item.date), 'dd MMM yyyy')}
      </Text>
      <FlatList
        data={item.tasks}
        renderItem={renderTask}
        keyExtractor={task => task.id.toString()}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      
      <FlatList
        data={groupedTasks}
        renderItem={renderDateGroup}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No completed tasks yet!</Text>
        )}
      />
    </SafeAreaView>
  );
}

export default CompletedTasksScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 10,
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    padding: 12,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: 'white',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    padding: 12,
    textAlign: 'center',
  },
  taskList: {
    gap: 10,
    paddingBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#007AFF',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  editInput: {
    fontSize: 16,
    padding: 0,
    color: '#007AFF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
  },
  completedTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    marginBottom: 8,
  },
  completedTaskText: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  }
})