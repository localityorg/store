import {useMutation} from '@apollo/client';
import {format, formatDistanceToNow, parseISO} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useDispatch} from 'react-redux';

import Image from '../Common/Image';
import {Section} from '../Common/Section';
import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';

import {changeState} from '../../redux/Store/actions';

import {ALTER_STATE} from '../../apollo/graphql/Store/orders';
import Sizes from '../../constants/Sizes';
import Tracker from './Tracker';

export interface ProductProps {
  id: string;
  name: string;
  quantity: {
    units: number;
    count: string;
    type: string;
  };
  price: {
    mrp: string;
  };
  url: string;
  totalAmount?: string;
}

export interface OrderProductProps {
  id: string;
  name: string;
  quantity: {
    units: number;
    count: string;
    type: string;
  };
  url: string;
  totalAmount: string;
}

export interface OrderProps {
  id: string;
  linkedAccount?: string;
  state: {
    cancelled: boolean;
    order: {
      cancelled: boolean;
      accepted: boolean;
      date: string;
    };
    delivery: {
      dispatched: boolean;
      delivered: boolean;
      deliverBy: string;
      address: AddressProps;
    };
    payment: {
      grandAmount: string;
      paid: boolean;
    };
    created: {
      date: string;
    };
  };
  products: Array<OrderProductProps>;
  loading: boolean;
  onPress?: any;
  screen?: boolean;
  onBack?: any;
}

export interface AddressProps {
  line: string;
  location: {
    coordinates: [string, string];
  };
}

interface GrandTotalDeliveryProps {
  address: AddressProps;
  grandTotal: string;
  card?: boolean;
}

interface ProductListProps {
  card: boolean;
  products: Array<OrderProductProps>;
}

const ProductList = (props: ProductListProps): JSX.Element => {
  return (
    <FlatList
      data={props.products}
      ItemSeparatorComponent={() => (
        <View style={{height: props.card ? 5 : 10}} />
      )}
      keyExtractor={item => `${item.name}${item.totalAmount}`}
      style={{width: '100%'}}
      renderItem={({item}) => (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              width: '60%',
            }}>
            {!props.card && (
              <View style={{marginRight: 10}}>
                <Image og={true} dimension={40} url={item.url} />
              </View>
            )}
            <Text
              style={{
                fontSize: props.card ? Sizes.font.text : 16,
                width: '90%',
              }}
              numberOfLines={props.card ? 1 : 2}>
              {item.name}
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: props.card ? Sizes.font.text : 16,
              }}>
              x{item.quantity.units.toString()}
            </Text>
            <Text
              style={{
                fontSize: props.card ? Sizes.font.text : 16,
              }}>
              ₹ {item.totalAmount}/-
            </Text>
          </View>
        </View>
      )}
    />
  );
};
export const GrandTotalDeliveryCard = (
  props: GrandTotalDeliveryProps,
): JSX.Element => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        borderRadius: 10,
        padding: 5,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '70%',
          }}>
          <BoldText>Address</BoldText>
          <Text numberOfLines={2}>{props.address?.line || 'In Store'}</Text>
        </View>
        <View
          style={{
            height: '80%',
            width: 2,
            backgroundColor: Colors.$backgroundDisabled,
            marginRight: 10,
          }}
        />
      </View>

      <View
        style={{
          width: '30%',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
        <BoldText>Grand Total</BoldText>
        <Text>Rs. {props.grandTotal}/-</Text>
      </View>
    </View>
  );
};

const OrderCard = (props: OrderProps): JSX.Element => {
  const dispatch: any = useDispatch();
  const [accept, setAccept] = useState<boolean>();

  const [acceptMutation, {loading: fetchingDecision}] = useMutation(
    ALTER_STATE,
    {
      variables: {
        id: props.id,
        accepted: accept,
      },
      onCompleted(data) {
        if (data.alterOrderState) {
          if (!accept) {
            dispatch(changeState(accept, props.id));
          }
        }
      },
      onError(error) {
        console.log({...error});
        console.log({
          id: props.id,
          accepted: accept,
        });
      },
    },
  );

  useEffect(() => {
    if (accept !== undefined) {
      acceptMutation({
        variables: {
          id: props.id,
          accepted: accept,
        },
      });
    }
  }, [accept]);

  if (props.state.cancelled) {
    return (
      <View
        style={{
          width: '100%',
          padding: 5,
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomColor: Colors.$textDisabled,
        }}>
        <Text>Id: {'loc' + props.id.slice(15, -1)}</Text>
        <BoldText red10>cancelled</BoldText>
      </View>
    );
  }

  if (props.screen) {
    return (
      <View flex>
        {!props.state.delivery.delivered && (
          <Tracker deliverBy={props.state.delivery.deliverBy} />
        )}
        <Section
          title="Address"
          body={
            <Text
              style={{
                fontSize: 16,
              }}>
              {props.state.delivery.address.line ||
                `Registered in store on ${format(
                  parseISO(props.state.created.date),
                  'dd-MM hh:mm aa',
                )}`}
            </Text>
          }
        />
        <Section
          title="Products"
          body={
            <View marginT-5>
              <ProductList products={props.products} card={false} />
            </View>
          }
        />

        <Section
          title="Payment"
          body={
            <View style={{flexDirection: 'column'}}>
              <View
                row
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                  }}>
                  Grand Total{' '}
                </Text>
                <View
                  style={{
                    width: '40%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    —
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    Rs. {props.state.payment.grandAmount}/-
                  </Text>
                </View>
              </View>
              <View
                row
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                  }}>
                  Payment Status{' '}
                </Text>
                <View
                  style={{
                    width: '40%',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    —
                  </Text>
                  <BoldText
                    style={{
                      fontSize: 16,
                    }}>
                    {props.state.payment.paid ? 'Paid' : 'Unpaid'}
                  </BoldText>
                </View>
              </View>
            </View>
          }
        />
        {/* {!props.payment.paid && (
          <Section
            title="Account requesting"
            body={
              <View marginT-5>
                <AccountTile
                  name="Vatsal Pandya"
                  closed={false}
                  lastUpdated={new Date().toISOString()}
                  id="44329342"
                  pending={{
                    status: true,
                    amount: "110",
                  }}
                  screen={true}
                  disabled={true}
                />
              </View>
            }
          />
        )} */}
      </View>
    );
  }

  if (fetchingDecision) {
    return (
      <View
        style={{
          minHeight: 185,
          width: '100%',
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 10,
          overflow: 'hidden',
          flexDirection: 'column',
          borderColor: Colors.$textDisabled,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View row center>
          <ActivityIndicator color={Colors.primary} size="large" />
          <BoldText marginL-20 text70 style={{color: Colors.primary}}>
            Please Wait ...
          </BoldText>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={{
        minHeight: 140,
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
        flexDirection: 'column',
        borderColor: Colors.$textDisabled,
      }}
      disabled={!props.state.order.accepted}
      activeOpacity={0.6}
      onPress={props.onPress}>
      <View
        style={{
          width: '100%',
          padding: 5,
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomColor: Colors.$textDisabled,
        }}>
        <Text>Id: {'loc' + props.id.slice(15, -1)}</Text>
        {!props.state.delivery.delivered && (
          <BoldText>
            {formatDistanceToNow(parseISO(props.state.delivery.deliverBy))} to
            go
          </BoldText>
        )}
      </View>
      <View
        style={{
          padding: 5,
          flexDirection: 'column',
          alignItems: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: Colors.$textDisabled,
        }}>
        <BoldText>Product{props.products.length > 0 && 's'}</BoldText>
        <ProductList card={true} products={props.products} />
      </View>
      <GrandTotalDeliveryCard
        address={props.state.delivery?.address}
        grandTotal={props.state.payment.grandAmount}
      />
      {!props.state.order.accepted && (
        <View
          style={{
            marginTop: 5,
            height: 50,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setAccept(false)}
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.$backgroundDangerLight,
            }}>
            <BoldText style={{color: Colors.$textDanger}}>Reject</BoldText>
          </TouchableOpacity>
          <View style={{width: 5}} />
          <TouchableOpacity
            onPress={() => setAccept(true)}
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.$backgroundSuccessLight,
            }}>
            <BoldText style={{color: Colors.$textSuccess}}>Accept</BoldText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrderCard;
