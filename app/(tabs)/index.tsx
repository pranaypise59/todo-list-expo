import { StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useTaskContext } from '@/context/TaskContext'
import { Task } from '@/types'

const EmptyListContent = () => (
  <Text style={styles.emptyText}>No active tasks. Add your first task!</Text>
)

const HomeScreen = () => {
  const { tasks, addTask, deleteTask, toggleComplete, updateTask } = useTaskContext();
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTask, setEditingTask] = useState<{ id: number; value: string } | null>(null);

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  const handleDeleteTask = (id: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteTask(id),
          style: "destructive"
        }
      ]
    );
  };

  const startEditing = (id: number, value: string) => {
    setEditingTask({ id, value });
  };

  const handleUpdateTask = () => {
    if (editingTask && editingTask.value.trim() !== '') {
      updateTask(editingTask.id, editingTask.value);
      setEditingTask(null);
    }
  };

  // Filter tasks for HomeScreen
  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => 
      !task.completed || 
      (task.completedAt && task.completedAt >= today)
    ).sort((a, b) => b.lastEditedAt.getTime() - a.lastEditedAt.getTime());
  }, [tasks]);

  const renderItem: React.FC<{ item: Task }> = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => toggleComplete(item.id)}
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
      >
        {item.completed && <Feather name="check" size={16} color="white" />}
      </TouchableOpacity>

      <View style={styles.taskContent}>
        {editingTask?.id === item.id ? (
          <TextInput
            style={styles.editInput}
            value={editingTask?.value}
            onChangeText={(text) => setEditingTask({ ...editingTask, value: text })}
            onBlur={handleUpdateTask}
            onSubmitEditing={handleUpdateTask}
            autoFocus
          />
        ) : (
          <>
            <Text style={[styles.taskText, item.completed && styles.completedTask]}>
              {item.value}
            </Text>
            <Text style={styles.dateText}>
              Created: {format(new Date(item.createdAt), 'dd MMM yyyy')}
            </Text>
          </>
        )}
      </View>

      <View style={styles.actionButtons}>
        {!item.completed && (
          <TouchableOpacity
            onPress={() => startEditing(item.id, item.value)}
            style={styles.actionButton}
          >
            <Feather name="edit-2" size={18} color="#666" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => handleDeleteTask(item.id)}
          style={styles.actionButton}
        >
          <Feather name="trash-2" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );



  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Today's Tasks</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Add your Task'
          style={styles.textInput}
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderItem as any}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListContent}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

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
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
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
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  }
});