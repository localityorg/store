import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {BoldText} from '../Common/Text';
import {View} from '../Themed';

import {RNCamera} from 'react-native-camera';

interface ScannerProps {
  code: string | undefined;
  setCode: any;
}

export default function Scanner(props: ScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (props.code !== undefined) {
      setScanned(false);
    }
  }, [props.code]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera permission',
          message:
            'Locality Store needs access to your camera to start scanning barcodes.',
          buttonPositive: 'Allow Access',
          buttonNegative: 'Cancel',
        },
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({data}: {data: string}) => {
    props.setCode(data);
    // console.log(data);
  };

  if (hasPermission === null) {
    return (
      <View flex center>
        <BoldText>Requesting for camera permission</BoldText>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View flex center>
        <BoldText>No access to camera</BoldText>
      </View>
    );
  }

  return (
    <RNCamera
      focusable
      captureAudio={false}
      type="back"
      zoom={0}
      onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
      style={{
        height: 900,
        width: 680,
      }}
    />
  );
}
