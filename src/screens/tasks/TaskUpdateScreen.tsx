import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);

  // 📷 Camera-first (gallery secondary)
  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission needed', 'Camera access is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7, // Optimize upload
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });
      }

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (e) {
      console.error('Image picker error:', e);
      Alert.alert('Error', 'Failed to pick image');
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
              <View>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton} 
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <TouchableOpacity 
                  style={styles.cameraButton} 
                  onPress={() => pickImage(true)}
                >
                  <Ionicons name="camera" size={32} color="white" />
                  <Text style={styles.cameraText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => pickImage(false)}
                  style={styles.galleryLink}
                >
                  <Text style={styles.galleryText}>or choose from gallery</Text>
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
  galleryLink: {
    padding: 8,
  },
  galleryText: {
    color: Colors.primary,
    fontSize: 14,
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
