import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Button from '../../components/Common/Button';
import {Header} from '../../components/Common/Header';
import Screen from '../../components/Common/Screen';
import {Section} from '../../components/Common/Section';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';
import {removeUser} from '../../redux/Common/actions';
import {setInventory, setStore} from '../../redux/Store/actions';

import {RootStackScreenProps} from '../../../types';

export default function Profile({navigation}: RootStackScreenProps<'Profile'>) {
  const dispatch: any = useDispatch();

  const {store} = useSelector((state: any) => state.storeReducer);
  const {user} = useSelector((state: any) => state.userReducer);

  function handleLogout() {
    dispatch(removeUser());
    dispatch(setStore(null));
    dispatch(setInventory({id: '', products: []}));
  }

  if ((store || user) === null) {
    setTimeout(() => {
      navigation.navigate('Root');
    }, 2000);
    return (
      <View flex center>
        <ActivityIndicator color={Colors.primary} size="large" />
        <BoldText text70 marginT-10>
          Redirecting you...
        </BoldText>
      </View>
    );
  }

  return (
    <Screen>
      <Header title="Profile" onBack={() => navigation.navigate('Root')} />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 15,
        }}>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 5,
            backgroundColor: Colors.$backgroundDisabled,
            marginRight: 10,
          }}
          center>
          <AntDesign name="user" color={Colors.$textDefault + '66'} size={60} />
        </View>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            height: 100,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <BoldText text50>{store.name || 'Store Name'}</BoldText>
            <Text text70>
              {user.contact.ISD} {user.contact.number}
            </Text>
          </View>
          <Text text70>
            Account Status: <BoldText green30>Active</BoldText>
          </Text>
        </View>
      </View>
      <Section
        title="Store Settings"
        body={
          <View style={{flexDirection: 'column'}}>
            <Button
              label="Store Details"
              icon
              name="edit"
              fullWidth
              onPress={() => navigation.navigate('StoreEdit')}
            />
          </View>
        }
      />

      <Section
        title="App Settings"
        body={
          <View style={{flexDirection: 'column'}}>
            {/* <Button
              label={colorScheme == "light" ? "Dark Theme" : "Light Theme"}
              icon
              name="bulb1"
              fullWidth
              transparent
              onPress={() => {}}
            /> */}
            <Button
              label="Logout"
              icon
              name="logout"
              fullWidth
              transparent
              onPress={() => handleLogout()}
            />
          </View>
        }
      />
    </Screen>
  );
}
