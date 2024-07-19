import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  Platform,
} from 'react-native';
import CleverTap from 'clevertap-react-native';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inboxInitialized, setInboxInitialized] = useState(false);

  useEffect(() => {
    // Trigger 'Product Viewed' event on component mount
    console.log('Product Viewed event triggered');
    CleverTap.recordEvent('Product Viewed', {});

    // Initialize CleverTap and setup listeners
    CleverTap.initializeInbox();

    // Listener for when the inbox is initialized
    const inboxInitializedListener = CleverTap.addListener(
      CleverTap.CleverTapInboxDidInitialize,
      () => {
        console.log('CleverTap App Inbox is initialized');
        setInboxInitialized(true);
      },
    );

    // Listener for when the inbox messages are updated
    const inboxMessagesUpdatedListener = CleverTap.addListener(
      CleverTap.CleverTapInboxMessagesDidUpdate,
      () => {
        console.log('CleverTap App Inbox messages did update');
        // Handle the inbox messages update. You can update UI or manage state as needed.
      },
    );

    // Listener for when an inbox message is tapped
    interface InboxMessageTappedEvent {
      contentPageIndex: number;
      buttonIndex: number;
      data: {
        msg: {
          content: {
            action: {
              links: {
                type: string;
              }[];
            };
          }[];
          type: string;
        };
      };
    }

    const inboxMessageTappedListener =
      CleverTap.addListener<InboxMessageTappedEvent>(
        CleverTap.CleverTapInboxMessageTapped,
        (event: {contentPageIndex: any; buttonIndex: any; data: any}) => {
          let contentPageIndex = event.contentPageIndex;
          let buttonIndex = event.buttonIndex;
          console.log(
            'App Inbox ->',
            'InboxItemClicked at page-index ' +
              contentPageIndex +
              ' with button-index ' +
              buttonIndex,
          );

          var data = event.data;
          let inboxMessageClicked = data.msg;

          let messageContentObject =
            inboxMessageClicked.content[contentPageIndex];

          if (buttonIndex !== -1) {
            let buttonObject = messageContentObject.action.links[buttonIndex];
            let buttonType = buttonObject.type;
            console.log(
              'App Inbox ->',
              'type of button clicked: ' + buttonType,
            );
          } else {
            console.log(
              'App Inbox ->',
              'type/template of App Inbox item: ' + inboxMessageClicked.type,
            );
          }
        },
      );

    // Clean up listeners when component unmounts
    return () => {
      inboxInitializedListener.remove();
      inboxMessagesUpdatedListener.remove();
      inboxMessageTappedListener.remove();
    };
  }, []);

  const handleLogin = () => {
    console.log(`Logging in with Name: ${name} and Email: ${email}`);
    CleverTap.onUserLogin({Name: name, Identity: email});
  };

  const handleTestEvent = () => {
    console.log('TEST event triggered');
    CleverTap.recordEvent('TEST', {});
  };

  const handleOpenInbox = () => {
    if (inboxInitialized) {
      console.log('Opening CleverTap Inbox');
      CleverTap.showInbox({
        tabs: ['Offers', 'Promotions'],
        navBarTitle: 'My App Inbox',
        navBarTitleColor: '#FF0000',
        navBarColor: '#FFFFFF',
        inboxBackgroundColor: '#AED6F1',
        backButtonColor: '#00FF00',
        unselectedTabColor: '#0000FF',
        selectedTabColor: '#FF0000',
        selectedTabIndicatorColor: '#000000',
        noMessageText: 'No message(s)',
        noMessageTextColor: '#FF0000',
      });
    } else {
      console.log('CleverTap Inbox is not initialized yet');
    }
  };

  const handleCallInboxMessageEvent = () => {
    console.log('Call Inbox Message event triggered');
    CleverTap.recordEvent('Call Inbox Message', {});
  };

  if (Platform.OS === 'android') {
    CleverTap.createNotificationChannel(
      'testChannel',
      'Test Channel',
      'This is a test channel',
      5,
      true,
    );
  }

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
      <Text style={styles.headerText}>CleverTap</Text>
      <Text style={styles.subHeaderText}>
        Unlock Limitless Customer Lifetime Value
      </Text>

      <View style={styles.formContainer}>
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
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Raise TEST Event"
            onPress={handleTestEvent}
            color="#2196F3"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Test Notification" onPress={createTestNotification} />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Call Inbox Message Event"
            onPress={handleCallInboxMessageEvent}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Open Inbox" onPress={handleOpenInbox} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

export default App;
