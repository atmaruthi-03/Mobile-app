import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { fetchWBS } from '../../services/wbs.service';
import { CWP, IWP, Site } from '../../types/wbs';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function ProjectWorkspaceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cwps, setCwps] = useState<CWP[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedCwp, setExpandedCwp] = useState<string | null>(null);

  useEffect(() => {
    loadWBS();
  }, [id]);

  const loadWBS = async () => {
    if (typeof id !== 'string') return;
    setLoading(true);
    try {
      const data = await fetchWBS(id);
      setCwps(data.cwps || []);
      setSites(data.sites || []);
    } catch (error) {
      console.error('Failed to load WBS', error);
      // Optional: Show alert
    } finally {
      setLoading(false);
    }
  };

  const filteredCwps = selectedSite 
    ? cwps.filter(c => c.site_id === selectedSite)
    : cwps;

  const toggleExpand = (cwpId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCwp(expandedCwp === cwpId ? null : cwpId);
  };

  const handleIwpPress = (iwp: IWP) => {
     // Navigate to IWP Detail, passing the IWP ID. 
     // Note: In a real large app, we might pass just ID and refetch, 
     // but since we have the tree here, we might want to pass data or store it in context/state.
     // For simplicity and performance with large trees, passing ID and having the next screen 
     // find it or passing the object (if small enough) is okay.
     // To keep navigation clean, let's pass the IWP object as a param string or just ID if we mock-fetch.
     // Since we don't have a "fetchIWP" individual endpoint documented, 
     // we will pass the data via params or a temporary store. 
     // expo-router params are string-only.
     
     // PROPOSED: Navigate to a new route and pass the IWP content via params 
     // (serialized) OR specific ID if we can route it.
     // Constraint: "Minimize taps, Fast updates".
     
     // Let's assume we pass the serialized object for now to avoid re-fetching the whole tree 
     // just for one node, since we don't have a specific getIWP endpoint documented.
     
     router.push({
        pathname: `/project/${id}/iwp/${iwp.id}`,
        params: { iwpData: JSON.stringify(iwp) }
     });
  };

  const renderIwpItem = (iwp: IWP) => (
    <TouchableOpacity 
      key={iwp.id} 
      style={styles.iwpItem}
      onPress={() => handleIwpPress(iwp)}
    >
      <View style={styles.iwpHeader}>
        <Ionicons name="layers-outline" size={20} color={Colors.primary} />
        <Text style={styles.iwpTitle}>{iwp.title}</Text>
      </View>
      <View style={styles.iwpMeta}>
        <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${iwp.progress || 0}%` }]} />
        </View>
        <Text style={styles.iwpProgressText}>{iwp.progress || 0}%</Text>
      </View>
      <Text style={styles.iwpDate}>Due: {iwp.due_date ? new Date(iwp.due_date).toLocaleDateString() : 'TBD'}</Text>
    </TouchableOpacity>
  );

  const renderCwpItem = ({ item }: { item: CWP }) => {
    const isExpanded = expandedCwp === item.id;
    return (
      <View style={styles.cwpCard}>
        <TouchableOpacity 
          style={styles.cwpHeader} 
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cwpInfo}>
            <Text style={styles.cwpTitle}>{item.title}</Text>
            <View style={styles.cwpMeta}>
               <Text style={styles.cwpProgress}>{item.progress || 0}% Complete</Text>
               <Text style={styles.cwpDate}>
                   {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'TBD'} - {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'TBD'}
               </Text>
            </View>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={Colors.textSecondary} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.iwpList}>
            {item.iwps && item.iwps.map(renderIwpItem)}
            {(!item.iwps || item.iwps.length === 0) && (
                <Text style={styles.emptyText}>No packages found.</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Work Packages</Text>
        <TouchableOpacity onPress={loadWBS}>
             <Ionicons name="refresh" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Site Filter - Dropdown Style */}
      {!loading && sites.length > 0 && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownHeaderText}>
              {selectedSite 
                ? sites.find(s => s.site_id === selectedSite)?.site_name || 'Unknown Site'
                : 'All Sites'}
            </Text>
            <Ionicons 
              name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.textSecondary} 
            />
          </TouchableOpacity>
          
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled style={{maxHeight: 250}}>
                <TouchableOpacity 
                  style={[styles.dropdownItem, selectedSite === null && styles.dropdownItemActive]}
                  onPress={() => {
                    setSelectedSite(null);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, selectedSite === null && styles.dropdownItemTextActive]}>All Sites</Text>
                  {selectedSite === null && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                </TouchableOpacity>
                
                {sites.map(site => (
                  <TouchableOpacity 
                    key={site.site_id} 
                    style={[styles.dropdownItem, selectedSite === site.site_id && styles.dropdownItemActive]}
                    onPress={() => {
                      setSelectedSite(site.site_id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, selectedSite === site.site_id && styles.dropdownItemTextActive]}>
                      {site.site_name}
                    </Text>
                    {selectedSite === site.site_id && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredCwps}
          keyExtractor={(item) => item.id}
          renderItem={renderCwpItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
                <Text style={styles.emptyText}>No work packages available.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  cwpCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cwpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  cwpInfo: {
    flex: 1,
  },
  cwpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cwpMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cwpProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 10,
  },
  cwpDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  iwpList: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    padding: 8,
  },
  iwpItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iwpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iwpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  iwpMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  iwpProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    width: 32,
    textAlign: 'right',
  },
  iwpDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  emptyText: {
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    zIndex: 10,
    elevation: 5, // Elevation triggers shadow and layering on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    maxHeight: 250, // Limit height if many sites
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemActive: {
    backgroundColor: '#F0F9FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#4B5563',
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
