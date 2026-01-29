import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { IWP, WBSTask } from '../../types/wbs';

export default function IWPDetailScreen() {
  const { iwpData, id } = useLocalSearchParams();
  const router = useRouter();

  const iwp: IWP | null = useMemo(() => {
    if (typeof iwpData === 'string') {
        try {
            return JSON.parse(iwpData);
        } catch (e) {
            console.error("Failed to parse IWP data", e);
            return null;
        }
    }
    return null;
  }, [iwpData]);

  const tasks = iwp?.tasks || [];

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('done') || s.includes('complete')) return '#10B981'; // Green
    if (s.includes('progress')) return '#3B82F6'; // Blue
    if (s.includes('blocked')) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const renderTaskItem = ({ item }: { item: WBSTask }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: `/task/${item.task_id}`,
        params: { taskData: JSON.stringify(item) }
      })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
            {item.is_critical && (
                <Ionicons name="flame" size={16} color="#EF4444" style={{marginRight: 4}} />
            )}
            {item.is_milestone && (
                <Ionicons name="flag" size={16} color="#F59E0B" style={{marginRight: 4}} />
            )}
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.metaRow}>
         <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>
                {new Date(item.start_date).toLocaleDateString()} - {new Date(item.due_date).toLocaleDateString()}
            </Text>
         </View>
         {item.progress > 0 && (
             <View style={styles.metaItem}>
                <Ionicons name="pie-chart-outline" size={14} color={Colors.primary} />
                <Text style={[styles.metaText, { color: Colors.primary, fontWeight: '600' }]}>
                    {item.progress}%
                </Text>
             </View>
         )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
            <Text style={styles.headerTitle} numberOfLines={1}>{iwp ? iwp.title : 'Work Package'}</Text>
            {iwp && <Text style={styles.headerSubtitle}>Project ID: {id}</Text>}
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.task_id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
             <Ionicons name="checkmark-circle-outline" size={48} color="#D1D5DB" />
             <Text style={styles.emptyText}>No tasks found in this package.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  center: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  emptyText: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 16,
  },
});
