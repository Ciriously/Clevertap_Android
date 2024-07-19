import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, TextInput, View, Text} from 'react-native';
import {Platform} from 'react-native';
import CleverTap from 'clevertap-react-native';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // useEffect hook to trigger 'Product Viewed' event on component mount

  useEffect(() => {
    console.log('Product Viewed event triggered');
    CleverTap.recordEvent('Product Viewed', {});
    CleverTap.initializeInbox();
  }, []);

  // Function to handle login

  const handleLogin = () => {
    console.log(`Logging in with Name: ${name} and Email: ${email}`);
    CleverTap.onUserLogin({Name: name, Identity: email});
  };

  // Function to handle test event

  const handleTestEvent = () => {
    console.log('TEST event triggered');
    CleverTap.recordEvent('TEST', {});
  };

  // Check if the platform is Android because notification channels are only available on Android
  if (Platform.OS === 'android') {
    // Create a notification channel
    CleverTap.createNotificationChannel(
      'testChannel',
      'Test Channel',
      'This is a test channel',
      5,
      true,
    );
  }

  // Create a test notification
  const createTestNotification = () => {
    const notificationData = {
      channelId: 'testChannel',
      channelName: 'Test Channel',
      channelDescription: 'This is a test channel',
      notificationId: 1,
      title: 'Test Notification',
      message: 'This is a test notification',
      mode: 'test',
      color: '#FF0000',
      ledColor: [200, 0, 0, 1],
      customExtras: {foo: 'bar'},
    };

    CleverTap.createNotification(notificationData);
  };



  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CleverTap</Text>
        <Text style={styles.subHeaderText}>
          Unlock Limitless Customer Lifetime Value
        </Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        placeholderTextColor="#aaa"
      />

      <View style={styles.buttonContainer}>
        <Button title="LOGIN" onPress={handleLogin} color="#4CAF50" />
        <Button
          title="Raise TEST Event"
          onPress={handleTestEvent}
          color="#2196F3"
        />
        <Button title="Test Notification" onPress={createTestNotification} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    fontSize: 18,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
