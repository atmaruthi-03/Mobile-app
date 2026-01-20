import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Project, ProjectStatus } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case 'In Progress': return '#E8F5E9'; // Light Green
    case 'Completed': return '#E3F2FD'; // Light Blue
    case 'Pending': return '#FFF3E0'; // Light Orange
    default: return '#F5F5F5';
  }
};

const getStatusTextColor = (status: ProjectStatus) => {
  switch (status) {
    case 'In Progress': return '#2E7D32'; // Dark Green
    case 'Completed': return '#1565C0'; // Dark Blue
    case 'Pending': return '#EF6C00'; // Dark Orange
    default: return '#757575';
  }
};

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
            <Ionicons name="folder-open-outline" size={24} color={Colors.primary} />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
          <Text style={[styles.statusText, { color: getStatusTextColor(project.status) }]}>
            {project.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.client}>{project.client}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.date}>Updated {project.updatedAt}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F9F6', // Very light green
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  client: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 15,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
