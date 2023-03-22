import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';
import {useEffect, useState} from 'react';
import {PermissionsAndroid, TouchableOpacity} from 'react-native';

import {useDispatch} from 'react-redux';
import {Colors} from 'react-native-ui-lib';

import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';

import {setLocation} from '../../redux/Common/actions';
import Geolocation from '@react-native-community/geolocation';

interface TrackerProps {
  deliverBy: string;
}

const Tracker = (props: TrackerProps): JSX.Element => {
  const dispatch: any = useDispatch();
  const [timer, setTimer] = useState({
    over: false,
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
  });
  const [confirmTimer, setConfirmTimer] = useState<number>(1);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [timerView, setTimerView] = useState(false);

  useEffect(() => {
    confirmTimer > 0 &&
      setTimeout(() => setConfirmTimer(confirmTimer + 1), 1000);

    let currentTime = new Date();
    let expireTime = new Date(props.deliverBy || new Date().toISOString());

    setTimer({
      over: currentTime > expireTime ? true : false,
      day: Math.abs(differenceInDays(expireTime, currentTime) % 1),
      hour: Math.abs(differenceInHours(expireTime, currentTime) % 24),
      min: Math.abs(differenceInMinutes(expireTime, currentTime) % 60),
      sec: Math.abs(differenceInSeconds(expireTime, currentTime) % 60),
    });

    askForLocationPermission();
  }, [confirmTimer]);

  const askForLocationPermission = () => {
    (async () => {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission',
          message:
            'Locality Store needs access to your location to locate your store.',
          buttonPositive: 'Allow Access',
          buttonNegative: 'Cancel',
        },
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        setLocationPermission(true);
        Geolocation.getCurrentPosition(location => {
          dispatch(
            setLocation([
              location.coords.latitude.toString(),
              location.coords.longitude.toString(),
            ]),
          );
        });
      }
    })();
  };
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'column',
        width: '100%',
        marginBottom: 5,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.$iconPrimary + '44',
      }}
      disabled={true}
      onPress={() => setTimerView(false)}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <BoldText text70>
          {timer.over ? 'Order late by' : 'Delivering in'}
        </BoldText>
        {/* <Text
          style={{
            textDecorationLine: "underline",
            color: Colors.$textNeutralLight,
          }}
          text80
        >
          Change to Map View
        </Text> */}
      </View>
      <BoldText
        style={{
          color: timer.over ? Colors.$textDanger : Colors.$textDefault,
          marginBottom: 0,
        }}
        text20>
        {timer.hour > 0 && (
          <>
            {timer.hour} <Text style={{}}>hr</Text>{' '}
          </>
        )}
        {timer.min} <Text style={{}}>m</Text> {timer.sec}{' '}
        <Text style={{}}>s</Text>
      </BoldText>
    </TouchableOpacity>
  );
};

export default Tracker;
