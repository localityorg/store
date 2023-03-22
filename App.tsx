import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';

import {Provider} from 'react-redux';
import {Store} from './src/redux/store';

// handling auth
import {ApolloProvider} from '@apollo/client';
import {client} from './src/apollo/Provider';
import {useEffect} from 'react';

import {Colors} from 'react-native-ui-lib';
import AppColors from './src/constants/Colors';

import {enableLatestRenderer} from 'react-native-maps';

require('react-native-ui-lib/config').setConfig({appScheme: 'default'});
enableLatestRenderer();

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    Colors.loadColors({
      primary: '#1da371',
      text: colorScheme === 'dark' ? '#eee' : '#111',
    });
    Colors.loadSchemes(AppColors);
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <Provider store={Store}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar
            backgroundColor={Colors.$backgroundDefault}
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          />
        </Provider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
