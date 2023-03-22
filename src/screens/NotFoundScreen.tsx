import React from 'react';

import {Text} from '../components/Common/Text';
import {View} from '../components/Themed';

import {RootStackScreenProps} from '../../types';

const NotFoundScreen = ({navigation}: RootStackScreenProps<'NotFound'>) => {
  setTimeout(() => {
    navigation.navigate('Root');
  }, 2000);
  return (
    <View flex center>
      <Text text70>This screen doesn't exist. Redirecting you...</Text>
    </View>
  );
};

export default NotFoundScreen;
