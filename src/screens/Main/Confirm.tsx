import {useMutation} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList} from 'react-native';
import {Button, Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {CREATE_ORDER} from '../../apollo/graphql/Store/orders';
import {Header} from '../../components/Common/Header';
import Image from '../../components/Common/Image';
import Screen from '../../components/Common/Screen';
import {BoldText, Text} from '../../components/Common/Text';
import Counter from '../../components/Store/Counter';
import GrandTotalCard from '../../components/Store/GrandTotal';
import {ProductProps} from '../../components/Store/OrderCard';
import {View} from '../../components/Themed';
import Sizes from '../../constants/Sizes';
import {
  addCartItem,
  emptyCart,
  removeCartItem,
} from '../../redux/Store/actions';

import {RootTabScreenProps} from '../../../types';

const Confirm = ({navigation}: RootTabScreenProps<'QuickBill'>) => {
  const dispatch: any = useDispatch();

  const [products, setProducts] = useState<any>([]);
  const [method, setMethod] = useState<string>('CASH');
  const [accountId, setAccountId] = useState<string | null>(null);
  const [grandTotal, setGrandTotal] = useState<string>('0');
  const [delivery, setDelivery] = useState(false);

  const {cart} = useSelector((state: any) => state.cartReducer);
  const {store} = useSelector((state: any) => state.storeReducer);

  const [createOrder, {loading}] = useMutation(CREATE_ORDER, {
    variables: {
      orderInfo: {
        products: [],
        grandTotal: grandTotal,
        addressId: null,
        storeId: store.id,
        delivery,
        deliverBy: new Date().toISOString(),
        accountId: accountId,
        method,
      },
    },
    onCompleted(data) {
      if (data.createOrder) {
        navigation.navigate('QuickBill');
        dispatch(emptyCart());
      }
    },
    onError(error) {
      console.log({...error});
      console.log({
        products: products,
        grandTotal: grandTotal,
        addressId: null,
        storeId: store.id,
        delivery,
        deliverBy: new Date().toISOString(),
        accountId,
        method,
      });
      Alert.alert(
        'Error occured',
        'We could not register this order. Try again in some time.',
      );
    },
  });

  function handleOrder() {
    createOrder({
      variables: {
        orderInfo: {
          products: products,
          grandTotal: grandTotal,
          addressId: null,
          storeId: store.id,
          delivery,
          deliverBy: new Date().toISOString(),
          accountId,
          method,
        },
      },
    });
  }

  useEffect(() => {
    if (cart.length <= 0) {
      navigation.navigate('QuickBill');
    } else {
      var total = 0;
      cart.forEach((e: any) => {
        // prods.push({
        //   id: e.id,
        //   quantity: parseInt(e.quantity.units),
        //   inStore: false,
        // });

        total += parseInt(e.quantity.units) * parseFloat(e.price.mrp);
      });
      setProducts(cart);
      setGrandTotal(total.toString());
    }
  }, [cart]);

  if (loading) {
    return (
      <View flex center>
        <ActivityIndicator
          size={'large'}
          color={Colors.primary}
          style={{marginBottom: 10}}
        />
        <BoldText $iconPrimary text70>
          Getting order confirmation
        </BoldText>
      </View>
    );
  }

  return (
    <Screen>
      <Header title="Confirm" onBack={() => navigation.navigate('QuickBill')} />
      <View flex>
        <FlatList
          data={cart}
          keyExtractor={(item: ProductProps) => item.id}
          renderItem={({item}) => (
            <View
              style={{
                width: '100%',
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image og={true} url={item.url} dimension={80} />
                <View
                  style={{
                    width: '60%',
                    flexDirection: 'column',
                    marginLeft: 10,
                  }}>
                  <Text style={{fontSize: Sizes.font.text}} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text>
                    {item.quantity.units} x {item.quantity.count}
                    {item.quantity.type}
                  </Text>
                </View>
              </View>
              <Counter
                item={item}
                editCount={true}
                data={cart}
                onAdd={() => dispatch(addCartItem(item))}
                onRemove={() => dispatch(removeCartItem(item))}
              />
            </View>
          )}
        />
      </View>
      <GrandTotalCard
        total={grandTotal}
        setTotal={(total: string) => setGrandTotal(total)}
        m={method}
        setMethod={setMethod}
        setAccountId={(id: string) => setAccountId}
      />
      <Button
        label={'Place Order'}
        disabled={false}
        size={Button.sizes.large}
        color={Colors.white}
        backgroundColor={Colors.primary}
        disabledBackgroundColor={Colors.$iconDisabled}
        round={false}
        borderRadius={10}
        marginV-10
        onPress={handleOrder}
      />
    </Screen>
  );
};

export default Confirm;
