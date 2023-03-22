/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  Profile: undefined;
  OrderDetails: {
    id?: string;
  };
  Confirm: undefined;
  EditInventory: undefined;
  Accounts: undefined;
  StoreEdit: undefined;
  NotFound: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, Screen>;

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, Screen>;

export type RootTabParamList = {
  Store: undefined;
  Orders: undefined;
  QuickBill: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    StackScreenProps<RootStackParamList>,
    BottomTabScreenProps<RootTabParamList, Screen>
  >;

export type AppearanceMode = 'light' | 'dark';
export type CurrentAppearance = {
  value: AppearanceMode;
  system: boolean;
};
export type ThemeColors = {
  textColor: string;
  bgColor: string;
  bg2Color: string;
};
export type StatusBarStyle = 'light-content' | 'dark-content' | undefined;
export type DesignSystemColors = Record<string, string>;
