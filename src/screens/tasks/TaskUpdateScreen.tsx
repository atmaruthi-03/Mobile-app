import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { uploadTaskUpdate } from '../../services/tasks.service';

export default function TaskUpdateScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number, address?: string } | null>(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // 📷 Camera-only + Geo-tagging
  const pickImage = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();

      if (!cameraPermission.granted) {
        Alert.alert('Permission needed', 'Camera access is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        
        // Start fetching location immediately after photo
        if (locationPermission.granted) {
          setIsLocating(true);
          try {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            
            // Optional: Get formatted address
            const [address] = await Location.reverseGeocodeAsync({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });

            setLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              address: address ? `${address.name || address.street}, ${address.city}` : undefined
            });
          } catch (locError) {
            console.warn('Failed to get location:', locError);
          } finally {
            setIsLocating(false);
          }
        }
      }
    } catch (e) {
      console.error('Task update error:', e);
      Alert.alert('Error', 'Failed to capture update');
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Evidence Required', 'Please take a photo to submit an update.');
      return;
    }

    setUploading(true);
    try {
      const success = await uploadTaskUpdate({
        taskId: id as string,
        image: image,
        comment: comment,
        location: location || undefined
      });

      if (success) {
        Alert.alert('Success', 'Update submitted successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to submit update. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} disabled={uploading}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Progress</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={uploading || !image}>
            {uploading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={[styles.submitText, !image && styles.submitDisabled]}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            {image ? (
              <View style={{ width: '100%' }}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton} 
                  onPress={() => {
                    setImage(null);
                    setLocation(null);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="white" />
                </TouchableOpacity>

                {/* Location Badge */}
                <View style={styles.locationBadge}>
                  {isLocating ? (
                    <>
                      <ActivityIndicator size="small" color={Colors.primary} style={{ marginRight: 6 }} />
                      <Text style={styles.locationText}>Capturing location...</Text>
                    </>
                  ) : location ? (
                    <>
                      <Ionicons name="location" size={16} color={Colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.locationText, { color: '#ffcc00' }]}>
                      Location not available
                    </Text>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <TouchableOpacity 
                  style={styles.cameraButton} 
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={32} color="white" />
                  <Text style={styles.cameraText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Comment Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Comment (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Add details about this update..."
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              editable={!uploading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  submitDisabled: {
    color: '#ccc',
  },
  content: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 12,
    color: '#0056b3',
    fontWeight: '500',
  },
  placeholderContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F5F9FF',
    borderWidth: 2,
    borderColor: '#D0E4FF',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 12,
  },
  cameraText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
});
