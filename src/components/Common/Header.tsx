import {StatusBar, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from 'react-native-ui-lib';

import {View} from '../Themed';
import {BoldText} from './Text';

import Sizes from '../../constants/Sizes';

interface HeaderProps {
  onBack?: any;
  onNext?: any;
  title: string;
  focused?: boolean;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
}

export function Header(props: HeaderProps) {
  return (
    <View
      style={{
        width: '100%',
        marginBottom: 10,
        height: 40,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {props.onBack && (
        <TouchableOpacity
          onPress={props.onBack}
          style={{
            backgroundColor: props.focused ? Colors.background : 'transparent',
            padding: props.focused ? 10 : 0,
            borderRadius: props.focused ? Sizes.icon.header : 0,
          }}>
          <AntDesign name="back" size={Sizes.icon.header} color={Colors.text} />
        </TouchableOpacity>
      )}
      <View
        style={{
          maxWidth: '75%',
          backgroundColor: props.focused ? Colors.background : 'transparent',
          padding: props.focused ? 2 : 0,
          paddingHorizontal: props.focused ? 10 : 0,
          borderRadius: props.focused ? Sizes.icon.normal : 0,
        }}>
        <BoldText
          numberOfLines={1}
          style={{
            fontSize: Sizes.font.header,
            lineHeight: Sizes.font.header + 5,
          }}>
          {props.title}
        </BoldText>
      </View>

      {props.onNext && props.icon && (
        <TouchableOpacity
          onPress={props.onNext}
          style={{
            backgroundColor: props.focused ? Colors.background : 'transparent',
            padding: props.focused ? 5 : 0,
            borderRadius: props.focused ? Sizes.icon.header : 0,
          }}>
          <AntDesign
            name={props.icon}
            size={Sizes.icon.header}
            color={Colors.text}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
