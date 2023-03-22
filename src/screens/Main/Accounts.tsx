import React, {useState} from 'react';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import {Header} from '../../components/Common/Header';
import Screen from '../../components/Common/Screen';
import {BoldText, Text} from '../../components/Common/Text';
import {View} from '../../components/Themed';
import {parseISO} from 'date-fns';

import {RootStackScreenProps} from '../../../types';

import Sizes from '../../constants/Sizes';
import {useQuery} from '@apollo/client';
import {GET_STORE_ACCOUNTS} from '../../apollo/graphql/Store/store';

interface StatsProps {
  amount: string;
  count: number;
}

const Stats = (props: StatsProps): JSX.Element => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20,
      }}>
      <Text text70>Pending accounts: {props.count.toString()}</Text>
      <Text
        text50
        style={{
          color: props.count > 0 ? Colors.$iconPrimary : Colors.$textDefault,
        }}>
        Total Amount: Rs. {props.amount.toString()}
      </Text>
    </View>
  );
};

export interface AccountDataProps {
  id: string;
  name: string;
  lastUpdated: string;
  closed: boolean;
  pending: {
    status: boolean;
    amount: string;
  };
  screen?: boolean;
  onPress?: any;
  disabled?: boolean;
}

export interface AccountScreenProps {
  data: Array<[AccountDataProps]>;
  totalPending: {
    count: number;
    amount: string;
  };
}

export const AccountTile = (props: AccountDataProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
      disabled={props.disabled}
      activeOpacity={0.6}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            height: props.screen ? 45 : 42,
            width: props.screen ? 45 : 42,
            borderRadius: 5,
            backgroundColor: Colors.$backgroundDisabled,
            marginRight: 10,
          }}
          center>
          <BoldText style={{color: Colors.$textDefault}} text60>
            {props.name.slice(0, 1).toString()}
          </BoldText>
        </View>

        <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <BoldText
            style={{
              fontSize: props.screen ? 16 : Sizes.font.text,
            }}>
            {props.name}
          </BoldText>
          <Text
            style={{
              fontSize: props.screen ? 16 : Sizes.font.text,
            }}>
            Last updated: {parseISO(props.lastUpdated).getDate()}-
            {parseISO(props.lastUpdated).getMonth()}-
            {parseISO(props.lastUpdated).getFullYear()}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}>
        {!props.closed && (
          <Text
            style={{
              fontSize: props.screen ? 16 : Sizes.font.text,
            }}>
            Rs. {props.pending.amount}/-
          </Text>
        )}
        <BoldText
          style={{
            fontSize: props.screen ? 16 : Sizes.font.text,
            color: !props.closed ? Colors.$iconSuccess : Colors.$iconDefault,
          }}>
          {props.closed ? 'closed' : 'open'}
        </BoldText>
      </View>
    </TouchableOpacity>
  );
};

export default function Accounts({
  navigation,
}: RootStackScreenProps<'Accounts'>) {
  const dispatch: any = useDispatch();

  const [active, setActive] = useState<AccountDataProps | null>(null);
  const [accounts, setAccounts] = useState([]);

  const {totalPending} = useSelector((state: any) => state.accountsReducer);

  const {loading: fetchingAccounts} = useQuery(GET_STORE_ACCOUNTS, {
    onCompleted(data) {
      if (data.getStore) {
        setAccounts(data.getStore.accounts);
        var pending = {
          total: 0,
          count: 0,
        };
        data.getStore.accounts.forEach((item: any) => {
          if (!item.closed) {
            pending.total += parseFloat(item.pending.amount);
            pending.count += 1;
          }
        });
      }
    },
  });

  if (active) {
    return (
      <Screen>
        <Header title={active.name} onBack={() => setActive(null)} />
      </Screen>
    );
  }

  if (fetchingAccounts) {
    return (
      <Screen>
        <Header
          title="Accounts"
          onBack={() => navigation.navigate('Profile')}
        />
        <View center flex row>
          <ActivityIndicator color={Colors.primary} size="large" />
          <BoldText marginL-20 text70 style={{color: Colors.$iconPrimary}}>
            Loading store accounts
          </BoldText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Accounts" onBack={() => navigation.navigate('Profile')} />
      <Stats amount={totalPending.amount} count={totalPending.count} />
      <View flex>
        <FlatList
          data={accounts}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({item}) => (
            <AccountTile
              {...item}
              onPress={() => setActive(item)}
              disabled={false}
            />
          )}
        />
      </View>
    </Screen>
  );
}
