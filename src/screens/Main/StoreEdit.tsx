import React, {useState} from 'react';
import {Header} from '../../components/Common/Header';
import Screen from '../../components/Common/Screen';
import {Text} from '../../components/Common/Text';
import StoreDetails from '../../components/Store/StoreDetails';
import {RootStackScreenProps} from '../../../types';

export default function StoreEdit({
  navigation,
}: RootStackScreenProps<'StoreEdit'>) {
  const [editing, setEditing] = useState(true);
  const [changed, setChanged] = useState(false);

  if (editing) {
    return (
      <Screen>
        <Header
          title="Edit Details"
          onBack={() => {
            setEditing(false);
            if (!changed) {
              navigation.navigate('Profile');
            }
          }}
        />
        <StoreDetails
          onNext={() => {
            navigation.navigate('Profile');
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Confim Details"
        onBack={() => navigation.navigate('Profile')}
      />
      <Text text70>Confirm details before saving.</Text>
    </Screen>
  );
}
