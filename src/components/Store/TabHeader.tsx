import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';

import {BoldText} from '../Common/Text';
import {View} from '../Themed';

import Sizes from '../../constants/Sizes';

interface TabHeaderProps {
  icon: React.ComponentProps<typeof AntDesign>['name'];
  name: string;
  color?: string;
  namePress: any;
  iconPress: any;
  logo: boolean;
}
const TabHeader = (props: TabHeaderProps): JSX.Element => {
  return (
    <View
      style={{
        marginBottom: 10,
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        style={{flexDirection: 'column', alignItems: 'flex-start'}}
        activeOpacity={0.7}
        onPress={props.iconPress}>
        {props.logo && (
          <BoldText text80 style={{color: Colors.primary}}>
            locality
          </BoldText>
        )}
        <BoldText text40>{props.name}</BoldText>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.iconPress}>
        <AntDesign
          name={props.icon}
          size={Sizes.icon.normal}
          color={props.color || Colors.$textDefault}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TabHeader;
