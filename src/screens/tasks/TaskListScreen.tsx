import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { fetchTasks } from '../../services/tasks.service';
import { Task, TaskStatus } from '../../types/task';

export default function TaskListScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      if (typeof id === 'string') {
        const data = await fetchTasks(id);
        setTasks(data);
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done': return '#4CAF50';
      case 'In Progress': return '#2196F3';
      case 'Blocked': return '#F44336';
      default: return '#757575';
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/task/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.dateText}>
        Last updated: {new Date(item.updatedAt).toLocaleDateString()}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => router.push(`/task/${item.id}/update`)}
        >
          <Ionicons name="camera-outline" size={16} color="white" />
          <Text style={styles.updateButtonText}>Quick Update</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks found for this project.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#757575',
    fontSize: 16,
  }
});
