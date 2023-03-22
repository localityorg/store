import {useState} from 'react';
import {
  Colors,
  Constants,
  Dialog,
  PanningProvider,
  TouchableOpacity,
} from 'react-native-ui-lib';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Sizes from '../../constants/Sizes';
import {TextInput} from '../Common/Input';
import {BoldText, Text} from '../Common/Text';
import {View} from '../Themed';

interface IGrandTotalCard {
  total: string;
  setTotal: any;
  m: string;
  setMethod: any;
  setAccountId: any;
}

export default function GrandTotalCard(props: IGrandTotalCard) {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Dialog
        bottom={true}
        visible={visible}
        onDismiss={() => setVisible(false)}
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
              Edit Total Amount
            </Text>
            {/* <View
              center
              marginT-10
              style={{
                height: 1,
                width: "100%",
                backgroundColor: Colors.$backgroundDarkElevated,
              }}
            /> */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
                marginBottom: 20,
              }}>
              <View
                style={{
                  // flex: 1,
                  width: '80%',
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: Colors.$backgroundDisabled,
                }}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Grand Total"
                  autoFocus={true}
                  value={props.total}
                  onChangeText={(text: string) => props.setTotal(text)}
                />
              </View>
              <TouchableOpacity
                style={{
                  padding: 10,
                  marginLeft: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.$backgroundDarkActive,
                }}
                onPress={() => setVisible(false)}>
                <AntDesign
                  name="check"
                  size={Sizes.icon.normal}
                  color={Colors.$backgroundDarkActive}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Dialog>
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          marginVertical: 10,
          padding: 10,
          paddingTop: 20,
          borderRadius: 10,
          borderTopWidth: 1,
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text text70>Order payment</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => props.setMethod('CASH')}>
              <Text
                text70
                style={{
                  color:
                    props.m.toLowerCase() === 'cash'
                      ? Colors.primary
                      : Colors.$textDefault,
                }}>
                Cash
              </Text>
            </TouchableOpacity>
            <Text marginH-10>/</Text>
            <TouchableOpacity onPress={() => props.setMethod('UPI')}>
              <Text
                text70
                style={{
                  color:
                    props.m.toLowerCase() === 'upi'
                      ? Colors.primary
                      : Colors.$textDefault,
                }}>
                UPI
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text text70>Add to Account</Text>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.$backgroundDisabled,
              borderRadius: 10,
              padding: 5,
            }}
          >
            <Text text70>Choose Account</Text>
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => setVisible(true)}>
          <Text text60>Grand Total</Text>
          <BoldText text60>₹ {props.total}/-</BoldText>
        </TouchableOpacity>
      </View>
    </>
  );
}
