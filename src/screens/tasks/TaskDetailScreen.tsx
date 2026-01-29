import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { WBSTask } from '../../types/wbs';

export default function TaskDetailScreen() {
  const { id, taskData } = useLocalSearchParams();
  const router = useRouter();
  
  const task: WBSTask | null = useMemo(() => {
    if (typeof taskData === 'string') {
        try {
            return JSON.parse(taskData);
        } catch (e) {
            console.error("Failed to parse Task data", e);
            return null;
        }
    }
    return null;
  }, [taskData]);

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Task data not available. Please navigate from the project list.</Text>
        <TouchableOpacity style={styles.backButtonCenter} onPress={() => router.back()}>
            <Text style={{color: Colors.primary}}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Task {task.id}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={[styles.statusBadge, { alignSelf: 'flex-start', backgroundColor: '#F3F4F6' }]}>
            <Text style={styles.statusValue}>{task.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.bodyText}>{task.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Details</Text>
          
          <DetailRow label="Responsible Party" value={task.responsible_party} />
          <DetailRow label="Planned Start" value={new Date(task.start_date).toLocaleDateString()} />
          <DetailRow label="Due Date" value={new Date(task.due_date).toLocaleDateString()} />
          <DetailRow label="Duration" value={`${task.duration_days} days`} />
          <DetailRow label="Progress" value={`${task.progress}%`} />
          
          {task.is_critical && (
             <View style={styles.tagRow}>
                <Ionicons name="flame" size={16} color="#EF4444" />
                <Text style={[styles.tagText, { color: '#EF4444' }]}>Critical Path</Text>
             </View>
          )}
          {task.is_milestone && (
             <View style={styles.tagRow}>
                <Ionicons name="flag" size={16} color="#F59E0B" />
                <Text style={[styles.tagText, { color: '#F59E0B' }]}>Milestone</Text>
             </View>
          )}
        </View>

        {task.is_external_dependency && (
          <View style={styles.warningBox}>
            <Ionicons name="alert-circle" size={20} color="#B45309" />
            <Text style={styles.warningText}>
                Requires approval from: {task.requires_approval_from}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => router.push(`/task/${task.task_id}/update`)}
        >
          <Ionicons name="camera" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const DetailRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonCenter: {
    marginTop: 16,
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusValue: {
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  statusLabel: {
    color: '#6B7280',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tagText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  warningBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  warningText: {
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
