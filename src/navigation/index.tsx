/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import Sizes from '../constants/Sizes';

import Login from '../screens/Auth/Login';
import Onboarding from '../screens/Auth/Onboarding';
import Register from '../screens/Auth/Register';
import Accounts from '../screens/Main/Accounts';
import Confirm from '../screens/Main/Confirm';
import EditInventory from '../screens/Main/EditInventory';
import OrderDetails from '../screens/Main/OrderDetails';

import Orders from '../screens/Main/Orders';
import Profile from '../screens/Main/Profile';
import QuickBill from '../screens/Main/QuickBill';
import Store from '../screens/Main/Store';
import StoreEdit from '../screens/Main/StoreEdit';

import NotFoundScreen from '../screens/NotFoundScreen';

import {
  AuthStackParamList,
  RootStackParamList,
  RootTabParamList,
} from '../../types';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const {user} = useSelector((state: any) => state.userReducer);

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {user ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{title: 'Oops!'}}
      />
      <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          initialParams={{
            id: '' || undefined,
          }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Accounts" component={Accounts} />
        <Stack.Screen name="Confirm" component={Confirm} />
        <Stack.Screen name="EditInventory" component={EditInventory} />
        <Stack.Screen name="StoreEdit" component={StoreEdit} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{title: 'Login', headerShown: false}}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{title: 'Register', headerShown: false}}
      />
    </AuthStack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Store"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: Colors.$backgroundDefault,
        tabBarInactiveBackgroundColor: Colors.$backgroundDefault,
      }}>
      <BottomTab.Screen
        name="Store"
        component={Store}
        options={{
          title: 'Store',
          tabBarIcon: ({color}) => (
            <TabBarIcon name="shoppingcart" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Orders"
        component={Orders}
        options={{
          title: 'Orders',
          lazy: false,
          tabBarIcon: ({color}) => <TabBarIcon name="bars" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="QuickBill"
        component={QuickBill}
        options={{
          unmountOnBlur: true,
          tabBarHideOnKeyboard: true,
          title: 'Quick Bill',
          tabBarIcon: ({color}) => <TabBarIcon name="qrcode" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
}) {
  return (
    <AntDesign size={Sizes.icon.header} style={{marginBottom: -3}} {...props} />
  );
}
