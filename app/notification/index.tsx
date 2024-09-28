import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../appStore/context';
import { IconBell } from '@tabler/icons-react-native';

// Sample notification data
const notifications = [
  {
    id: '1',
    title: 'notificationTitle',
    message: 'notificationDetails',
    read: true,
  },
];

const NotificationItem = ({
  title,
  message,
  t,
  read,
}: {
  title: string;
  message: string;
  read: boolean;
  t: any;
}) => (
  <TouchableOpacity
    style={[styles.notificationItem, read && styles.readNotification]}
  >
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{t('notificationTitle')}</Text>
      <Text style={styles.notificationMessage}>{t('notificationDetails')}</Text>
    </View>
    {!read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

const Notifications = () => {
  const navigation = useNavigation();
  const { t } = useAppContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='light-content' backgroundColor='#16A349' />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name='chevron-back' size={24} color='#fff' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications')}</Text>
        <TouchableOpacity style={styles.optionsButton}>
          {/* <Ionicons name='options-outline' size={24} color='#fff' /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              title={item.title}
              message={item.message}
              read={item.read}
              t={t}
            />
          )}
          contentContainerStyle={styles.notificationList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#16A349',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#16A349',
    height: Platform.OS === 'ios' ? 88 : 56, // Adjusted for iOS notch
    paddingTop: Platform.OS === 'ios' ? 40 : 0, // Adjusted for iOS notch
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  optionsButton: {
    padding: 8,
  },
  notificationList: {
    paddingVertical: 8,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readNotification: {
    opacity: 0.7,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
});

export default Notifications;
