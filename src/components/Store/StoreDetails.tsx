import React, {useEffect, useState} from 'react';
import {Button, Colors, TouchableOpacity, View} from 'react-native-ui-lib';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Alert, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from '@apollo/client';

import {InputText, TextInput} from '../../components/Common/Input';
import {Map} from '../../components/Common/Map';
import {Text} from '../../components/Common/Text';
import Screen from '../../components/Common/Screen';

import {setStore} from '../../redux/Store/actions';

import {EDIT_STORE} from '../../apollo/graphql/Store/store';
import Sizes from '../../constants/Sizes';

interface DetailProps {
  onNext?: any;
}

const StoreDetails = (props: DetailProps): JSX.Element => {
  const dispatch: any = useDispatch();

  const [active, setActive] = useState<boolean>(false);
  const {location: storeLocation} = useSelector(
    (state: any) => state.locationReducer,
  );
  const {store} = useSelector((state: any) => state.storeReducer);
  const {location} = useSelector((state: any) => state.locationReducer);
  const {user} = useSelector((state: any) => state.userReducer);

  const [locationSet, setLocationSet] = useState<boolean>(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [data, setData] = useState({
    edit: true,
    storeInfo: {
      name: store.name,
      contact: user.contact,
      licenseNumber: '',
      upi: '',
      address: {
        line1: store.address.line,
        location: {
          coordinates: store.address.location.coordinates,
        },
      },
    },
  });

  const [editStore, {loading: confirming}] = useMutation(EDIT_STORE, {
    variables: {
      ...data,
    },
    onCompleted(data) {
      if (data.editStore) {
        dispatch(setStore(data.editStore));
        {
          props.onNext && props.onNext();
        }
      }
    },
    onError(error) {
      console.log({
        edit: data.edit,
        storeInfo: {
          name: data.storeInfo.name,
          contact: user.contact,
          address: data.storeInfo.address,
        },
      });
      console.log(location);
      Alert.alert(
        'Request not sucessful',
        'Maybe you forgot to change values or some values were incorrect. Try again in some time!',
      );
      // props.onNext();
    },
  });

  if (confirming) {
    return (
      <Screen>
        <Text text70>
          Confirming store {data.edit ? 'changes' : 'registeration'}...
        </Text>
      </Screen>
    );
  }

  if (locationSet) {
    return (
      <>
        <View flex>
          <Text text70>
            Enter your store address below. Drag marker to point precise store
            location.
          </Text>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: active
                ? Colors.$backgroundDarkElevated
                : Colors.$backgroundDisabled,
            }}>
            <TextInput
              autoFocus={true}
              value={data.storeInfo.address.line1}
              onChangeText={(text: string) =>
                setData({
                  ...data,
                  storeInfo: {
                    ...data.storeInfo,
                    address: {
                      ...data.storeInfo.address,
                      line1: text,
                    },
                  },
                })
              }
              onBlur={() => setActive(false)}
              onFocus={() => setActive(true)}
              style={{flex: 1}}
              placeholder="Store Address"
            />
            {isKeyboardVisible && (
              <TouchableOpacity
                marginL-15
                disabled={data.storeInfo.address.line1.trim().length <= 0}
                onPress={() => Keyboard.dismiss()}>
                <AntDesign
                  name="arrowright"
                  color={
                    data.storeInfo.address.line1.trim().length <= 0
                      ? Colors.$backgroundDisabled
                      : Colors.$backgroundDarkElevated
                  }
                  size={Sizes.icon.normal}
                />
              </TouchableOpacity>
            )}
          </View>
          {!isKeyboardVisible && <Map />}
          {storeLocation && !isKeyboardVisible && (
            <Button
              label={
                confirming
                  ? `${data.edit ? 'Editing' : 'Registering...'}`
                  : `Confirm ${data.edit ? 'Edit' : '& Register'}`
              }
              disabled={confirming}
              size={Button.sizes.large}
              color={Colors.white}
              backgroundColor={Colors.primary}
              disabledBackgroundColor={Colors.$iconDisabled}
              round={false}
              borderRadius={10}
              marginV-10
              onPress={() =>
                editStore({
                  variables: {
                    edit: data.edit,
                    storeInfo: {
                      ...data.storeInfo,
                      address: {
                        ...data.storeInfo.address,
                        location: {
                          coordinates: location,
                        },
                      },
                    },
                  },
                })
              }
            />
          )}
        </View>
      </>
    );
  }

  return (
    <>
      <View flex>
        <Text text70 marginB-10>
          Enter your store details below. Please note you will require your
          Store's license number to edit store everytime.
        </Text>
        {/* <InputText
            value={storeInfo.licenseNumber}
            onChange={(text: string) =>
              setStoreInfo({ ...storeInfo, licenseNumber: text })
            }
            placeholder="Raj Maharaj"
            title="Your Name"
            autoFocus={true}
          />
  
          <View
            style={{
              marginVertical: 10,
              height: 1,
              width: "80%",
              alignSelf: "center",
              backgroundColor: Colors.$backgroundPrimaryHeavy,
            }}
          /> */}

        <InputText
          value={data.storeInfo.name}
          onChange={(text: string) =>
            setData({
              ...data,
              storeInfo: {
                ...data.storeInfo,
                name: text,
              },
            })
          }
          title="Store Name"
          placeholder={data.storeInfo.name}
        />
        <InputText
          value={data.storeInfo.licenseNumber}
          onChange={(text: string) =>
            setData({
              ...data,
              storeInfo: {
                ...data.storeInfo,
                licenseNumber: text,
              },
            })
          }
          title="License Number"
          placeholder={'ISB000999999'}
        />

        <InputText
          value={data.storeInfo.upi}
          placeholder={store.upi.display || '999990000@upiid'}
          onChange={(text: string) =>
            setData({
              ...data,
              storeInfo: {
                ...data.storeInfo,
                upi: text,
              },
            })
          }
          title="Your UPI ID"
        />
      </View>
      <Button
        label={'Select Address'}
        disabled={
          data.storeInfo.name.trim().length <= 0 ||
          data.storeInfo.licenseNumber.trim().length <= 9
        }
        size={Button.sizes.large}
        backgroundColor={Colors.primary}
        color={Colors.white}
        disabledBackgroundColor={Colors.$iconDisabled}
        round={false}
        borderRadius={10}
        marginV-10
        onPress={() => {
          setActive(false);
          setLocationSet(true);
        }}
      />
    </>
  );
};

export default StoreDetails;
