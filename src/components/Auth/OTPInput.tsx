import {useLazyQuery} from '@apollo/client';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useEffect, useState} from 'react';
import {Button, Colors, View} from 'react-native-ui-lib';
import {CHECK_AUTH} from '../../apollo/graphql/Common/auth';
import Sizes from '../../constants/Sizes';
import {BoldText} from '../Common/Text';
import ResendOTP from './ResendOTP';

interface OTPProps {
  contact: {
    ISD: string;
    number: string;
  };
  date: string;
  onNext: any;
  onNew: any;
}

export function OTPInput(props: OTPProps) {
  const [date, setDate] = useState(props.date);
  const [secureCode, setSecureCode] = useState('');

  const [checkAuth, {loading: checkingAuth}] = useLazyQuery(CHECK_AUTH, {
    variables: {
      contact: props.contact,
      secureCode,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (!data.checkAuth.error) {
        props.onNext();
      }
    },
  });

  useEffect(() => {
    setDate(props.date);
  }, [props.date]);

  return (
    <View flex>
      <View
        style={{
          backgroundColor: 'transparent',
          flexDirection: 'column',
          width: '100%',
          marginVertical: 10,
          height: 70,
        }}
        flex>
        <BoldText text70>One Time Paassword</BoldText>
        <OTPInputView
          style={{width: '100%', height: 90}}
          pinCount={6}
          code={secureCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={code => setSecureCode(code)}
          autoFocusOnLoad={false}
          codeInputFieldStyle={{
            width: 45,
            height: 60,
            borderWidth: 2,
            fontFamily: 'Inter-Regular',
            fontSize: Sizes.font.header,
            color: Colors.text,
          }}
          codeInputHighlightStyle={{
            borderColor: Colors.primary,
            color: Colors.primary,
          }}
          selectionColor={Colors.primary}
        />
        <ResendOTP
          date={date}
          onNew={() => {
            setSecureCode('');
            props.onNew();
          }}
        />
      </View>
      <Button
        label={checkingAuth ? 'Confirming' : 'Verify'}
        disabled={checkingAuth || secureCode.length < 6}
        size={Button.sizes.large}
        color={Colors.white}
        backgroundColor={Colors.primary}
        disabledBackgroundColor={Colors.$iconDisabled}
        round={false}
        borderRadius={10}
        marginT-50
        marginB-10
        onPress={() =>
          checkAuth({
            variables: {
              contact: props.contact,
              secureCode,
            },
          })
        }
      />
    </View>
  );
}
