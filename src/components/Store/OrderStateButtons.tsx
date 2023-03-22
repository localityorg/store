import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {Alert} from 'react-native';
import {
  Button,
  Colors,
  Constants,
  Dialog,
  PanningProvider,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {
  DELIVER_ORDER,
  DISPATCH_ORDER,
  ORDER_PAID,
} from '../../apollo/graphql/Store/orders';
import {Text} from '../Common/Text';
import {View} from '../Themed';
import {OrderProps} from './OrderCard';

interface StateButtonProps {
  order: OrderProps;
}

export default function OrderStateButtons(props: StateButtonProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [method, setMethod] = useState<string>('UPI');

  const {location} = useSelector((state: any) => state.locationReducer);

  const [deliverOrder, {loading: confirmingDelivery}] = useMutation(
    DELIVER_ORDER,
    {
      variables: {
        id: props.order.id,
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
        id: props.order.id,
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

  const [orderPaid, {loading: payConfirming}] = useMutation(ORDER_PAID, {
    variables: {
      id: props.order.id,
      method: '',
    },
    onCompleted(data) {
      if (data.paymentStatus) {
        setVisible(false);
      }
    },
    onError(error) {
      Alert.alert('Cannot change status', `${error.graphQLErrors[0].message}`);
    },
  });

  return (
    <>
      <Dialog
        bottom={true}
        visible={visible}
        onDismiss={() => setVisible(false)}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={{
          width: '100%',
          backgroundColor: Colors.$backgroundDefault,
          marginBottom: Constants.isIphoneX ? 0 : 20,
          borderRadius: 12,
        }}
        ignoreBackgroundPress={false}>
        <View spread>
          <View marginT-20 marginH-20>
            <Text $textDefault text60>
              Confirm Payment
            </Text>
            <View
              center
              marginT-10
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.$backgroundDarkElevated,
              }}
            />
            <Text text70 marginT-10>
              How was the order paid?
            </Text>
            <View
              row
              centerV
              marginT-10
              padding-3
              style={{
                height: 50,
                backgroundColor: Colors.$backgroundDisabled,
                width: '100%',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <TouchableOpacity
                center
                style={{
                  backgroundColor:
                    method === 'UPI'
                      ? Colors.$backgroundDefault
                      : 'transparent',
                  padding: 10,
                  width: '50%',
                  borderRadius: 10,
                }}
                onPress={() => setMethod('UPI')}>
                <Text text70 $textDefault>
                  via UPI
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                center
                style={{
                  backgroundColor:
                    method === 'CASH'
                      ? Colors.$backgroundDefault
                      : 'transparent',
                  padding: 10,
                  width: '50%',
                  borderRadius: 10,
                }}
                onPress={() => setMethod('CASH')}>
                <Text text70 $textDefault>
                  via Cash
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              label={'Confirm'}
              size={Button.sizes.large}
              backgroundColor={Colors.$backgroundDarkElevated}
              disabledBackgroundColor={Colors.$iconDisabled}
              disabled={payConfirming}
              round={false}
              padding-5
              marginV-10
              text70
              borderRadius={10}
              onPress={() =>
                orderPaid({
                  variables: {
                    id: props.order.id,
                    method: method,
                  },
                })
              }
            />
          </View>
        </View>
      </Dialog>
      <View height-50 row centerV spread marginV-10>
        {!props.order.state.delivery.delivered && (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding: 10,
              borderRadius: 10,
              flex: 1,
            }}
            center
            disabled={confirmingDelivery || confirmingDispatch}
            onPress={() =>
              props.order.state.delivery.dispatched
                ? deliverOrder({
                    variables: {
                      id: props.order.id,
                      coordinates: location,
                    },
                  })
                : dispatchOrder({
                    variables: {
                      id: props.order.id,
                    },
                  })
            }>
            <Text style={{color: Colors.white}} text70>
              {props.order.state.delivery.dispatched
                ? 'Deliver Order'
                : 'Dispatch Order'}
            </Text>
          </TouchableOpacity>
        )}
        {!props.order.state.payment.paid &&
          props.order.state.delivery.dispatched && (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.$backgroundNeutralMedium,
                padding: 10,
                borderRadius: 10,
                flex: 1,
              }}
              center
              flex
              marginL-10
              padding-10
              width-50
              onPress={() => setVisible(true)}>
              <Text text70>Order Paid</Text>
            </TouchableOpacity>
          )}
      </View>
    </>
  );
}
