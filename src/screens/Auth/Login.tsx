import React, {useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';

import Screen from '../../components/Common/Screen';
import ContactInput from '../../components/Auth/ContactInput';
import {Header} from '../../components/Common/Header';
import {BoldText, Text} from '../../components/Common/Text';
import {OTPInput} from '../../components/Auth/OTPInput';

import {setUser} from '../../redux/Common/actions';
import {setStore} from '../../redux/Store/actions';

import {TWOFACTOR_AUTH} from '../../apollo/graphql/Common/auth';
import {LOGIN_USER} from '../../apollo/graphql/Common/user';
import {AuthStackScreenProps} from '../../../types';
import {View} from '../../components/Themed';
import {Colors} from 'react-native-ui-lib';

export default function Login({navigation}: AuthStackScreenProps<'Login'>) {
  const [contact, setContact] = useState({
    ISD: '+91',
    number: '',
  });
  const [meta, setMeta] = useState({
    tfScreen: false,
    date: '',
  });
  const [error, setError] = useState({
    error: false,
    message: '',
  });

  const dispatch: any = useDispatch();

  const [login, {loading}] = useMutation(LOGIN_USER, {
    variables: {
      contact,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.login) {
        dispatch(setStore(null));
        dispatch(setUser(data.login));
      } else {
        Alert.alert('Error occured.', 'Some error occured. Please try again.');
      }
    },
  });

  const [tfAuth, {loading: tfAuthing}] = useLazyQuery(TWOFACTOR_AUTH, {
    variables: {
      contact: contact,
      newAcc: false,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.twoFactorAuth.error) {
        setError({
          error: data.twoFactorAuth.error,
          message: data.twoFactorAuth.message,
        });
      } else {
        setMeta({...meta, tfScreen: true, date: data.twoFactorAuth.date});
      }
    },
  });

  if (meta.tfScreen) {
    return (
      <Screen>
        <Header
          title="Login"
          onBack={() => {
            setMeta({...meta, tfScreen: false});
          }}
        />
        <Text text70>Enter 6 digit code sent to your registered number.</Text>
        <OTPInput
          date={meta.date}
          contact={contact}
          onNew={() =>
            tfAuth({
              variables: {
                contact,
                newAcc: false,
              },
            })
          }
          onNext={() =>
            login({
              variables: {
                contact,
              },
            })
          }
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Login" onBack={() => navigation.navigate('Onboarding')} />
      <Text text70>
        Welcome back! Login to your store with registered number.
      </Text>
      <ContactInput
        contact={contact}
        loading={tfAuthing}
        onNext={() => {
          setError({...error, error: false});
          tfAuth({
            variables: {
              contact: contact,
              newAcc: false,
            },
          });
        }}
        setContact={(text: string) => {
          if (error.error) {
            setError({error: false, message: ''});
          }
          setContact({...contact, number: text});
        }}
      />
      <View flex></View>
      {error.error && (
        <View marginV-10 center>
          <BoldText text70 style={{color: Colors.red30}}>
            {error.message}
          </BoldText>
        </View>
      )}
    </Screen>
  );
}
