import {useQuery} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {GET_NEW_ORDER, GET_ORDERS} from '../../apollo/graphql/Store/orders';
import {client} from '../../apollo/Provider';
import Screen from '../../components/Common/Screen';
import OrderCard from '../../components/Store/OrderCard';
import TabHeader from '../../components/Store/TabHeader';
import {View} from '../../components/Themed';
import {setOrders} from '../../redux/Store/actions';

import {RootTabScreenProps} from '../../../types';

const filters = [
  {
    id: 0,
    name: "Today's Orders",
  },
  {
    id: 1,
    name: 'Pending',
  },
  {
    id: 2,
    name: 'Accepted',
  },
];

export default function Orders({navigation}: RootTabScreenProps<'Orders'>) {
  const dispatch: any = useDispatch();

  const [render, setRender] = useState(false);
  const [filter, setFilter] = useState(0);

  const [list, setList] = useState<any>();

  const {user} = useSelector((state: any) => state.userReducer);

  const {
    loading: fetchingOrders,
    refetch,
    subscribeToMore,
  } = useQuery(GET_ORDERS, {
    variables: {
      limit: 20,
      offset: 0,
    },
    onCompleted(data) {
      if (data.getOrders) {
        setList(data.getOrders);
        dispatch(setOrders(data.getOrders));
      }
    },
    onError(error) {
      console.log({...error});
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_NEW_ORDER,
      variables: {id: user?.id},
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;

        const updatedQueryData = subscriptionData.data.orderUpdate;

        const index = prev.getOrders.findIndex(
          (e: any) => e.id === updatedQueryData.id,
        );

        if (index <= -1) {
          dispatch(setOrders([updatedQueryData, ...prev.getOrders]));
          setRender(!render);
          return Object.assign({}, prev, {
            getOrders: [updatedQueryData, ...prev.getOrders],
          });
        } else {
          var updatedOrders = [...prev.getOrders];
          updatedOrders.splice(index, 1);
          dispatch(setOrders([updatedQueryData, ...updatedOrders]));
          setRender(!render);
          return Object.assign({}, prev, {
            getOrders: [updatedQueryData, ...updatedOrders],
          });
        }
      },
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (list) {
      const {getOrders} = client.readQuery({
        query: GET_ORDERS,
        variables: {
          limit: 20,
          offset: 0,
        },
      });
      var filtered;
      if (filter === 1) {
        filtered = getOrders.filter(
          (order: any) => order.state.order.accepted === false,
        );
        setList(filtered);
      } else if (filter === 2) {
        var filtered = getOrders.filter(
          (order: any) => order.state.order.accepted === true,
        );
        setList(filtered);
      } else {
        setList(getOrders);
      }
    }
  }, [filter]);

  return (
    <Screen>
      <TabHeader
        icon="reload1"
        name="Orders"
        logo={false}
        iconPress={() => refetch()}
        namePress={() => {}}
      />
      <View style={{width: '100%', marginBottom: 15}}>
        <ScrollView horizontal>
          {filters.map(obj => (
            <Button
              backgroundColor={Colors.primary}
              color={filter === obj.id ? Colors.white : Colors.text}
              outlineColor={Colors.primary}
              key={obj.id.toString()}
              label={obj.name}
              size={Button.sizes.medium}
              outline={filter !== obj.id}
              onPress={() => setFilter(obj.id)}
              style={{marginRight: 10}}
            />
          ))}
        </ScrollView>
      </View>
      {list && (
        <View flex>
          <FlatList
            data={list}
            extraData={render}
            onRefresh={() => refetch()}
            refreshing={fetchingOrders}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({item}) => (
              <OrderCard
                onPress={() =>
                  navigation.navigate('OrderDetails', {
                    id: item.id,
                  })
                }
                id={item.id}
                products={item.products}
                state={item.state}
                loading={false}
                screen={false}
              />
            )}
          />
        </View>
      )}
    </Screen>
  );
}
