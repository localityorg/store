import LinearGradient from 'react-native-linear-gradient';
import {Colors} from 'react-native-ui-lib';

import Image from '../Common/Image';

import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';

interface ProductTileProps {
  id: string;
  url: string;
  count: number;
  amount: string;
  dimension: number;
}

const ProductTile = (props: ProductTileProps): JSX.Element => {
  return (
    <View
      style={{
        height: 110,
        width: 110,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.$backgroundDisabled + '55',
      }}>
      <Image og={false} url={props.url} dimension={props.dimension} />
      <LinearGradient
        colors={[
          Colors.$backgroundDefault + '00',
          Colors.$backgroundDefault + 'aa',
          Colors.$backgroundDefault + 'cc',
          Colors.$backgroundDefault + 'cc',
          Colors.$backgroundDefault,
        ]}
        style={{
          bottom: 0,
          position: 'absolute',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: 5,
          height: 60,
        }}>
        <BoldText>x{props.count}</BoldText>
        <Text>Rs. {props.amount}/-</Text>
      </LinearGradient>
    </View>
  );
};

export default ProductTile;
