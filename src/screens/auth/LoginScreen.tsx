import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';


export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login Error', error);
      // Optional: Add basic alert for user feedback
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Back Button */}
        {/* Removed Back Button to prevent navigation confusion during auth flow */}
        
        {/* Title Section */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../../assets/images/Alfred.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.title}>Welcome to Alfred</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to securely access your account and manage your services.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <InputField 
            placeholder="Work-Email" 
            iconName="mail-outline" 
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <InputField 
            placeholder="Password" 
            iconName="lock-closed-outline" 
            isPassword 
            value={password}
            onChangeText={setPassword}
          />

          {/* Remember Me */}
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text style={styles.optionText}>Remember me</Text>
            </TouchableOpacity>
          </View>

          <Button title="Login" onPress={handleLogin} />
        </View>

        <SocialLoginButtons />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 24,
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  forgotText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signupText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderColor,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
