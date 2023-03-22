import {Colors} from 'react-native-ui-lib';
import {Text} from '../Common/Text';
import {View} from '../Themed';

interface StatsProps {
  amount: string;
  count: number;
  pending: number;
}

const Stats = (props: StatsProps): JSX.Element => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
      }}>
      <Text text70 style={{color: Colors.white}}>
        Todays Orders: {props.count.toString()}
      </Text>
      <Text text50 style={{color: Colors.white}}>
        Total Amount: Rs. {props.amount.toString()}
      </Text>
    </View>
  );
};

export default Stats;
