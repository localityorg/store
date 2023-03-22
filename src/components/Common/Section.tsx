import {ActivityIndicator, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from 'react-native-ui-lib';

import {View} from '../Themed';
import {BoldText, Text} from './Text';

import Sizes from '../../constants/Sizes';

interface SectionProps {
  title: string;
  subtitle?: string;
  body: any;
  horizontal?: boolean;
  onPressIcon?: any;
  loading?: boolean;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
}

export function Section(props: SectionProps) {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}>
        <BoldText text70>{props.title}</BoldText>
        {props.icon && (
          <TouchableOpacity onPress={props.onPressIcon}>
            <AntDesign
              name={props.icon}
              color={Colors.text}
              size={Sizes.icon.normal}
            />
          </TouchableOpacity>
        )}
        {props.loading && (
          <ActivityIndicator color={Colors.primary} size="small" />
        )}
      </View>
      {props.subtitle && (
        <Text marginB-5 text70>
          {props.subtitle}
        </Text>
      )}
      <View
        marginT-5
        style={{
          flexDirection: props.horizontal ? 'row' : 'column',
          backgroundColor: 'transparent',
        }}>
        {props.body}
      </View>
    </View>
  );
}
