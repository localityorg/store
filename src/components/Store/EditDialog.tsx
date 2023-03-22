import { useMutation } from "@apollo/client";
import {
  Button,
  Colors,
  Constants,
  PanningProvider,
} from "react-native-ui-lib";
import { Dialog } from "react-native-ui-lib/src/incubator";
import { useDispatch } from "react-redux";
import { EDIT_PRODUCT } from "../../apollo/graphql/Store/products";
import { addCartItem } from "../../redux/Store/actions";
import { Text } from "../Common/Text";
import { View } from "../Themed";

interface EditDialogProps {
  editProduct: {
    id: string | null;
    name: string;
  };
  code: string;
  visible: boolean;
  setVisible: any;
  onDismiss: any;
}

export default function (props: EditDialogProps) {
  const dispatch: any = useDispatch();

  const [edit, { loading: editing }] = useMutation(EDIT_PRODUCT, {
    variables: {
      id: props.editProduct.id,
      barcode: props.code,
      url: "",
    },
    onCompleted(data) {
      if (data.editProduct) {
        var product = data.editProduct;
        dispatch(addCartItem(product));
      }
    },
  });

  return (
    <Dialog
      bottom={true}
      visible={props.visible}
      onDismiss={props.onDismiss}
      panDirection={PanningProvider.Directions.DOWN}
      containerStyle={{
        width: "100%",
        backgroundColor: Colors.$backgroundDefault,
        marginBottom: Constants.isIphoneX ? 0 : 20,
        borderRadius: 12,
      }}
      ignoreBackgroundPress={false}
    >
      <View spread>
        <View marginT-20 marginH-20>
          <Text $textDefault text60>
            Confirm
          </Text>
          <View
            center
            marginT-10
            style={{
              height: 1,
              width: "100%",
              backgroundColor: Colors.$backgroundDarkElevated,
            }}
          />
          <Text text70 $textDefault marginT-10>
            Assign barcode {props.code} to {props.editProduct.name}?
          </Text>
          <View margin-15 marginH-0 right w-100 spread row>
            <Button
              label={editing ? "Editing" : "Confirm"}
              size={Button.sizes.small}
              backgroundColor={Colors.$backgroundDarkElevated}
              disabledBackgroundColor={Colors.$iconDisabled}
              disabled={editing}
              round={false}
              padding-5
              text70
              borderRadius={5}
              onPress={() =>
                edit({
                  variables: {
                    id: props.editProduct.id,
                    barcode: props.code,
                    url: "",
                  },
                })
              }
            />
          </View>
        </View>
      </View>
    </Dialog>
  );
}
