import {ActivityIndicator, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Constants, Dialog, PanningProvider} from 'react-native-ui-lib';

import {View} from '../Themed';
import {Text} from './Text';

import Sizes from '../../constants/Sizes';

interface ButtonProps {
  onPress: any;
  label: string;
  name?: React.ComponentProps<typeof AntDesign>['name'];
  icon?: boolean;
  fullWidth?: boolean;
  transparent?: boolean;
  disabled?: boolean;
  loading?: boolean;
  info?: {
    title: string;
    message: string;
  };
}

export default function Button(props: ButtonProps) {
  return (
    <>
      <Dialog
        bottom={true}
        visible={false}
        onDismiss={() => {}}
        panDirection={PanningProvider.Directions.DOWN}
        containerStyle={{
          backgroundColor: Colors.$backgroundDefault,
          marginBottom: Constants.isIphoneX ? 0 : 20,
          borderRadius: 12,
        }}
        ignoreBackgroundPress={false}>
        <View spread>
          <View marginT-20 marginH-20>
            <Text $textDefault text60>
              {props.info?.title}
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
            <Text text70 $textDefault marginT-10>
              {props.info?.message}
            </Text>
          </View>
        </View>
      </Dialog>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          padding: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          width: props.fullWidth ? '100%' : '50%',
          alignSelf: props.fullWidth ? 'baseline' : 'auto',
          backgroundColor: props.transparent
            ? 'transparent'
            : Colors.$backgroundDisabled + '99',
        }}
        activeOpacity={Sizes.opacity.active}
        disabled={props.disabled || false}>
        {props.loading ? (
          <ActivityIndicator color={Colors.tint} />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: props.icon ? 'flex-start' : 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            {props.icon && props.name && (
              <AntDesign
                name={props.name}
                color={Colors.text}
                size={Sizes.icon.normal}
                style={{marginRight: 10}}
              />
            )}
            <Text text70>{props.label}</Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}
