import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, TouchableOpacity} from 'react-native-ui-lib';

import {View} from '../Themed';
import {Text} from '../Common/Text';

import Sizes from '../../constants/Sizes';
import {ProductProps} from './OrderCard';

interface CounterProps {
  data: any;
  item: ProductProps;
  onAdd: any;
  onRemove: any;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState<number>(props.item.quantity.units || 0);
  const [changed, setChanged] = useState<boolean>(false);

  useEffect(() => {
    var i = props.data.findIndex((e: ProductProps) => e.id === props.item.id);
    if (i >= 0) {
      setCount(props.data[i].quantity.units);
    }
  }, [props.data]);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: count > 0 ? Colors.primary : 'transparent',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: changed ? Colors.primary + '11' : 'transparent',
      }}
      padding-10
      marginT-5>
      <TouchableOpacity
        onPress={props.onRemove}
        marginR-10
        disabled={count <= 0}>
        <AntDesign
          name="minus"
          size={Sizes.icon.normal}
          color={count <= 0 ? Colors.grey30 : Colors.text}
        />
      </TouchableOpacity>

      <Text style={{paddingHorizontal: 5, fontSize: Sizes.font.text}}>
        {count.toString()}
      </Text>

      <TouchableOpacity onPress={props.onAdd} disabled={count < 0} marginL-10>
        <AntDesign
          name="plus"
          size={Sizes.icon.normal}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
