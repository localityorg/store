import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {
  DELIVER_ORDER,
  DISPATCH_ORDER,
  GET_ORDER,
} from '../../apollo/graphql/Store/orders';

import {Header} from '../../components/Common/Header';
import Screen from '../../components/Common/Screen';
import {BoldText} from '../../components/Common/Text';
import OrderCard, {OrderProps} from '../../components/Store/OrderCard';
import OrderStateButtons from '../../components/Store/OrderStateButtons';
import {View} from '../../components/Themed';
import {setLocation} from '../../redux/Common/actions';

import {RootStackScreenProps} from '../../../types';

export default function OrderDetails({
  route,
  navigation,
}: RootStackScreenProps<'OrderDetails'>) {
  const {id} = route.params;

  const dispatch: any = useDispatch();

  const {location} = useSelector((state: any) => state.locationReducer);

  const [permission, setPermission] = useState<boolean>(false);
  const [order, setOrder] = useState<OrderProps | undefined>();

  const {orders} = useSelector((state: any) => state.ordersReducer);

  const [fetch, {loading}] = useLazyQuery(GET_ORDER, {
    variables: {
      id: id,
    },
    onCompleted(data) {
      setOrder(data.getOrder);
    },
    onError(error) {
      console.log({...error});
    },
  });

  useEffect(() => {
    if (orders) {
      setOrder(orders.find((order: OrderProps) => order.id === id));
    }
  }, [orders, id]);

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
        setPermission(true);
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

  useEffect(() => {
    if (location === null) {
      askForLocationPermission();
    }
  }, [location]);

  const [deliverOrder, {loading: confirmingDelivery}] = useMutation(
    DELIVER_ORDER,
    {
      variables: {
        id: id,
        coordinates: location,
      },
      onCompleted(data) {
        if (data.deliverOrder) {
        }
      },
      onError(error) {
        Alert.alert(
          'Cannot change status',
          `${error.graphQLErrors[0].message}`,
        );
      },
    },
  );

  const [dispatchOrder, {loading: confirmingDispatch}] = useMutation(
    DISPATCH_ORDER,
    {
      variables: {
        id: id,
      },
      onCompleted(data) {
        if (data.dispatchOrder) {
        }
      },
      onError(error) {
        Alert.alert(
          'Cannot change status',
          `${error.graphQLErrors[0].message}`,
        );
      },
    },
  );

  if (!permission) {
    return (
      <View flex center>
        <View style={{width: '80%'}} centerH>
          <BoldText center text70 marginB-10>
            You need to give location access in order to view Order Details
          </BoldText>
          <Button
            label={'Refresh'}
            disabled={false}
            size={Button.sizes.large}
            backgroundColor={Colors.$backgroundDarkActive}
            color={Colors.text}
            round={false}
            marginT-10
            borderRadius={10}
            onPress={askForLocationPermission}
          />
        </View>
      </View>
    );
  }

  if (loading || order === undefined) {
    return (
      <View center flex>
        <ActivityIndicator size={'large'} color={Colors.primary} />
        <BoldText text70>Fetching order details...</BoldText>
      </View>
    );
  }

  if (order?.state.cancelled) {
    setTimeout(() => {
      navigation.navigate('Root');
    }, 2000);
    return (
      <View center flex>
        <BoldText text70>Order cancelled by user. Redirecting you...</BoldText>
      </View>
    );
  }

  return (
    <Screen>
      <Header title="Detail" onBack={() => navigation.navigate('Root')} />
      <FlatList
        style={{flex: 1}}
        data={[1]}
        extraData={order}
        renderItem={() => (
          <OrderCard
            onPress={() => {}}
            id={order.id}
            products={order.products}
            state={order.state}
            loading={loading}
            screen={true}
          />
        )}
      />
      <OrderStateButtons order={order} />
    </Screen>
  );
}
