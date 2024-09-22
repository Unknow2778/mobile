import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POST } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconX } from '@tabler/icons-react-native';
import { useAppContext } from '../appStore/context';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { language, setLanguage, t } = useAppContext();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('name').then((storedName) => {
      if (storedName) setUserName(storedName);
    });

    AsyncStorage.getItem('lang').then((storedLang) => {
      if (storedLang) setLanguage(storedLang);
    });
  }, []);

  const handleLogin = async () => {
    const result = await POST('/users/login', { name, password });
    if (result.success) {
      const { token, name: userName, email, phone } = result.data;
      AsyncStorage.setItem('token', token);
      AsyncStorage.setItem('name', userName);
      AsyncStorage.setItem('email', email);
      AsyncStorage.setItem('phone', phone);

      setUserName(userName);
      setEmail(email);
      setPhone(phone);
      setModalVisible(false);
      setErrorMessage('');
    } else {
      setErrorMessage(result.error);
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleRegister = async () => {
    const result = await POST('/users/register', { name, password });
    if (result.success) {
      Alert.alert(
        'Registration Successful',
        'Please login with your new account'
      );
      setModalVisible(false);
    } else {
      setErrorMessage(result.error);
      Alert.alert('Registration Failed', result.error);
    }
  };

  const handleLoginLogout = () => {
    if (userName) {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('name');
      AsyncStorage.removeItem('email');
      AsyncStorage.removeItem('phone');
      AsyncStorage.removeItem('lang');
      AsyncStorage.removeItem('hasSeenOnboarding');
      setUserName(null);
      setEmail('');
      setPhone('');
    } else {
      setModalVisible(true);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    AsyncStorage.setItem('lang', lang).then(() => {
      forceUpdate({}); // Force a re-render
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' />
      <View style={styles.loginContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/avatar.jpg')}
            style={styles.avatar}
          />
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>{t('name')} </Text>
            <Text
              style={[styles.value, { color: userName ? 'black' : 'gray' }]}
            >
              {userName ? userName : t('unverified')}
            </Text>
          </View>
          {/* <View style={styles.profileItem}>
            <Text style={styles.label}>Email </Text>
            <Text style={[styles.value, { color: email ? 'black' : 'gray' }]}>
              {email ? email : 'verify your email'}
            </Text>
          </View> */}
          {/* <View style={styles.profileItem}>
            <Text style={styles.label}>Phone </Text>
            <Text style={[styles.value, { color: phone ? 'black' : 'gray' }]}>
              {phone ? phone : 'verify your phone'}
            </Text>
          </View> */}
        </View>
      </View>
      <View style={styles.logoutContainer}>
        {userName !== null ? (
          // <TouchableOpacity style={styles.editButton}>
          //   <Text style={styles.logoutText}>Edit</Text>
          // </TouchableOpacity>
          <></>
        ) : null}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: userName !== null ? '#DB3A3A' : '#16A34A' },
          ]}
          onPress={handleLoginLogout}
        >
          <Text style={styles.logoutText}>
            {userName ? t('logout') : t('login')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>{t('language')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={language ?? 'en'}
            onValueChange={handleLanguageChange}
            style={styles.picker}
          >
            <Picker.Item label='English' value='en' />
            <Picker.Item label='ಕನ್ನಡ (Kannada)' value='kn' />
          </Picker>
        </View>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <IconX size={20} color='black' />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>{t('login')}</Text>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder={t('name')}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {!isLoggedIn && (
              <TextInput
                style={styles.input}
                placeholder={t('confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={isLoggedIn ? handleLogin : handleRegister}
            >
              <Text style={styles.loginButtonText}>
                {isLoggedIn ? t('login') : t('register')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => setIsLoggedIn(!isLoggedIn)}
            >
              <Text style={styles.registerButtonText}>
                {isLoggedIn ? t('register') : t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
    gap: 10,
    backgroundColor: '#F0FDF4',
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    gap: 5,
  },
  profileItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },
  value: {
    fontSize: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  editButton: {
    backgroundColor: '#16A34A',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '95%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#16A34A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
  registerButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    color: '#16A34A',
  },
  registerButtonText: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  languageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
