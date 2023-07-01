import {useLazyQuery, useMutation} from '@apollo/client';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Keyboard} from 'react-native';
import {
  Button,
  Colors,
  Constants,
  Dialog,
  View,
  PanningProvider,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';

import Image from '../../components/Common/Image';
import {InputText, TextInput} from '../../components/Common/Input';
import Screen from '../../components/Common/Screen';
import {BoldText, Text} from '../../components/Common/Text';
import Counter from '../../components/Store/Counter';
import Scanner from '../../components/Store/Scanner';

import {
  addCartItem,
  emptyCart,
  removeCartItem,
} from '../../redux/Store/actions';

import Sizes from '../../constants/Sizes';
import {
  EDIT_PRODUCT,
  GET_PRODUCT,
  SEARCH_PRODUCTS,
} from '../../apollo/graphql/Store/products';
import {RootTabScreenProps} from '../../../types';

const base = {
  id: null,
  name: '',
  price: {mrp: ''},
  quantity: {count: '', type: ''},
  barcode: '',
};

export default function QuickBill({
  navigation,
}: RootTabScreenProps<'QuickBill'>) {
  const dispatch: any = useDispatch();

  const [assignerScreen, setAssignerScreen] = useState<boolean>(false);

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<{
    id: string | null;
    name: string;
    price: {
      mrp: string;
    };
    quantity: {
      count: string;
      type: string;
    };
    barcode: string;
  }>(base);
  const [editDialog, setEditDialog] = useState<boolean>(true);

  const [search, setSearch] = useState<string>('');
  const [products, setProducts] = useState<any>({
    data: [],
    error: true,
  });

  const [code, setCode] = useState<string>('');
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const {cart} = useSelector((state: any) => state.cartReducer);
  const {store} = useSelector((state: any) => state.storeReducer);

  const [searchProduct, {loading}] = useLazyQuery(GET_PRODUCT, {
    variables: {
      storeId: store?.id,
      barcode: code,
    },
    onCompleted(data) {
      if (data.getProduct.product) {
        dispatch(addCartItem(data.getProduct.product));
      }
    },
    onError(error) {
      console.log(error);
      if (error.graphQLErrors[0]) {
        setAssignerScreen(true);
        if (!dialogVisible) {
          setDialogVisible(true);
        }
      }
    },
  });

  const [lookUpProducts, {loading: loadingProducts}] = useLazyQuery(
    SEARCH_PRODUCTS,
    {
      variables: {
        name: search,
        limit: 10,
      },
      fetchPolicy: 'no-cache',
      onCompleted(data) {
        Keyboard.dismiss();
        setProducts({data: data.getProducts || [], error: ''});
      },
    },
  );

  const [edit, {loading: editing}] = useMutation(EDIT_PRODUCT, {
    variables: {
      product: editProduct,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.editProduct) {
        var product = data.editProduct;
        dispatch(addCartItem(product));
        setAssignerScreen(false);
        setEditProduct(base);
        setEditDialog(true);
      }
    },
    onError(error) {
      console.log(editProduct);
      console.log({...error});
    },
  });

  useEffect(() => {
    if (code?.length > 0) {
      setEditProduct({...editProduct, barcode: code});
      searchProduct({
        variables: {
          storeId: store?.id,
          barcode: code,
        },
      });
      setCode('');
      // console.log(code);
    }
  }, [code]);

  useEffect(() => {
    editProduct.id && setDialogVisible(true);
  }, [editProduct]);

  if (assignerScreen) {
    return (
      <>
        <Dialog
          bottom={true}
          visible={dialogVisible}
          onDismiss={() => {
            setEditProduct(base);
            setDialogVisible(false);
          }}
          panDirection={PanningProvider.Directions.DOWN}
          containerStyle={{
            backgroundColor: Colors.$backgroundDefault,
            marginBottom: Constants.isIphoneX ? 0 : 20,
            borderRadius: 12,
          }}
          ignoreBackgroundPress={false}>
          {editDialog ? (
            <View spread>
              {editProduct && (
                <View marginT-20 marginH-20>
                  {showScanner && (
                    <View
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 10,
                        overflow: 'hidden',
                        backgroundColor: Colors.$backgroundNeutralIdle,
                      }}
                      marginB-10>
                      <Scanner
                        code={editProduct.barcode}
                        setCode={(unicode: string) => {
                          setEditProduct({...editProduct, barcode: unicode});
                          setShowScanner(false);
                        }}
                      />
                    </View>
                  )}
                  <Text $textDefault text60>
                    Edit Product
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
                  {/* Edit Name */}
                  <InputText
                    value={editProduct.name}
                    onChange={(text: string) =>
                      setEditProduct({...editProduct, name: text})
                    }
                    lines={2}
                    placeholder="Type product's name.."
                    title="Product Name"
                  />
                  {/* Edit Quanitity Count */}
                  <View row centerH marginL-5>
                    <View
                      style={{
                        marginTop: -8,
                        width: '50%',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <BoldText text70 marginR-10>
                          Quantity
                        </BoldText>
                        <TextInput
                          style={{width: 100}}
                          placeholder="Eg. L"
                          value={editProduct.quantity.type}
                          onChangeText={(text: string) =>
                            setEditProduct({
                              ...editProduct,
                              quantity: {...editProduct.quantity, type: text},
                            })
                          }
                        />
                      </View>
                      <TextInput
                        style={{marginTop: 5, width: 100}}
                        placeholder="Eg. 200"
                        value={editProduct.quantity.count}
                        onChangeText={(text: string) =>
                          setEditProduct({
                            ...editProduct,
                            quantity: {...editProduct.quantity, count: text},
                          })
                        }
                        keyboardType="numeric"
                      />
                    </View>
                    {/* Edit Price type */}
                    <InputText
                      title="Price"
                      placeholder="Eg. 50.00"
                      value={editProduct.price.mrp}
                      onChange={(text: string) =>
                        setEditProduct({
                          ...editProduct,
                          price: {...editProduct.price, mrp: text},
                        })
                      }
                      mini={true}
                      keyboardType="numeric"
                    />
                  </View>
                  <View
                    row
                    style={{
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '70%'}}>
                      <InputText
                        title="Barcode"
                        placeholder="9984045240534"
                        value={editProduct.barcode}
                        onChange={(text: string) =>
                          setEditProduct({
                            ...editProduct,
                            barcode: text,
                          })
                        }
                        mini={false}
                        keyboardType="numeric"
                      />
                    </View>
                    <TouchableOpacity
                      center
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        borderWidth: 1,
                        backgroundColor: showScanner
                          ? Colors.$backgroundDarkActive
                          : 'transparent',
                      }}
                      onPress={() => setShowScanner(!showScanner)}>
                      <AntDesign
                        name="camerao"
                        size={20}
                        color={
                          showScanner
                            ? Colors.white
                            : Colors.$backgroundDarkActive
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <View margin-15 marginH-0 row spread>
                    <Button
                      label={`${editProduct.id ? 'Edit & Add' : 'Add'} Product`}
                      size={Button.sizes.small}
                      backgroundColor={Colors.$backgroundDarkElevated}
                      disabledBackgroundColor={Colors.$iconDisabled}
                      color={Colors.text}
                      disabled={editing}
                      round={false}
                      padding-5
                      text70
                      borderRadius={5}
                      onPress={() => setEditDialog(false)}
                    />
                    <Button
                      label={'Add to Cart'}
                      backgroundColor={Colors.primary}
                      outlineColor={Colors.primary}
                      color={Colors.white}
                      padding-5
                      borderRadius={5}
                      text70
                      onPress={() => {
                        dispatch(addCartItem(editProduct));
                        setAssignerScreen(false);
                        setEditProduct(base);
                        setEditDialog(true);
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
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
                    width: '100%',
                    backgroundColor: Colors.$backgroundDarkElevated,
                  }}
                />
                <Text text70 $textDefault marginT-10>
                  Submit changes made to product {editProduct.name}?
                </Text>
                <View margin-15 marginH-0 spread>
                  <Button
                    label={
                      editing
                        ? `${editProduct.id ? 'Editing' : 'Adding'}`
                        : 'Confirm'
                    }
                    size={Button.sizes.small}
                    backgroundColor={Colors.$backgroundDarkElevated}
                    color={Colors.text}
                    disabledBackgroundColor={Colors.$iconDisabled}
                    disabled={editing}
                    round={false}
                    padding-5
                    text70
                    borderRadius={5}
                    onPress={() =>
                      edit({
                        variables: {
                          product: {
                            ...editProduct,
                          },
                        },
                      })
                    }
                  />
                </View>
              </View>
            </View>
          )}
        </Dialog>
        <Screen>
          <View flex marginT-10>
            <View row centerH>
              <TouchableOpacity
                paddingR-15
                center
                marginB-15
                onPress={() => {
                  setEditProduct(base);
                  setAssignerScreen(false);
                }}>
                <AntDesign
                  name="back"
                  size={Sizes.icon.header}
                  color={Colors.$textDefault}
                />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  backgroundColor: Colors.$backgroundDisabled + '77',
                  marginBottom: 15,
                }}>
                <TextInput
                  autoFocus={true}
                  value={search}
                  placeholder={'Search and assign code to a product'}
                  onChangeText={text => setSearch(text)}
                  selectionColor={Colors.$iconPrimary}
                  style={{
                    flex: 1,
                    fontSize: Sizes.font.text,
                  }}
                />
                {search.trim().length > 0 && (
                  <View row center style={{backgroundColor: 'transparent'}}>
                    <TouchableOpacity onPress={() => setSearch('')}>
                      <AntDesign name="close" size={Sizes.icon.normal} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {search.trim().length > 0 && (
                <View row centerH>
                  <TouchableOpacity
                    onPress={() => {
                      lookUpProducts({
                        variables: {
                          name: search,
                          limit: 10,
                        },
                      });
                    }}
                    style={{
                      justifyContent: 'center',
                      backgroundColor: Colors.primary,
                      paddingHorizontal: 15,
                      marginBottom: 15,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}
                    disabled={search.trim().length > 0 ? false : true}>
                    <AntDesign
                      name="search1"
                      size={Sizes.icon.normal}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <FlatList
              data={products.data}
              keyExtractor={e => e.id}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    width: '80%',
                    alignSelf: 'center',
                    marginBottom: 5,
                  }}
                />
              )}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      borderRadius: 5,
                      alignItems: 'flex-start',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: Colors.$backgroundNeutralMedium,
                    }}
                    row
                    padding-5
                    onPress={() => {
                      setEditProduct(item);
                    }}>
                    <Text text70 flex numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text marginL-10 text70>
                      {item.quantity.count}
                      {item.quantity.type}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          {search.length <= 0 && (
            <Button
              label={'Add New Product'}
              disabled={false}
              size={Button.sizes.large}
              color={Colors.white}
              backgroundColor={Colors.$backgroundDarkActive}
              disabledBackgroundColor={Colors.$iconDisabled}
              round={false}
              borderRadius={10}
              marginV-10
              onPress={() => setDialogVisible(true)}
            />
          )}
        </Screen>
      </>
    );
  }

  return (
    <Screen>
      <View
        row
        centerH
        marginB-10
        style={{
          width: '100%',
          height: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <BoldText text40>Quickbill</BoldText>

        <View row centerH>
          <TouchableOpacity padding-10 onPress={() => dispatch(emptyCart())}>
            <AntDesign
              size={Sizes.icon.normal}
              name="delete"
              color={
                cart.length > 0 ? Colors.$textDanger : Colors.$textDisabled
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            marginL-15
            padding-10
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.primary,
            }}
            onPress={() => {
              setSearch('');
              setProducts({data: [], error: false});
              setAssignerScreen(true);
            }}>
            <AntDesign
              size={Sizes.icon.normal}
              name="search1"
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: 200,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: Colors.$backgroundNeutralIdle,
        }}
        marginB-10>
        {loading ? (
          <View flex>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <Scanner
            code={code}
            setCode={(unicode: string) => setCode(unicode)}
          />
        )}
      </View>
      <View flex>
        {cart?.length > 0 ? (
          <FlatList
            data={cart}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginBottom: 10,
                  height: 1,
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: Colors.$backgroundDisabled,
                }}
              />
            )}
            keyExtractor={(e: any) => e.id.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  width: '100%',
                  marginBottom: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image og={true} url={item.url} dimension={80} />
                  <View
                    style={{
                      width: '60%',
                      flexDirection: 'column',
                      marginLeft: 10,
                    }}>
                    <Text style={{fontSize: Sizes.font.text}} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text>
                      {item.quantity.units} x {item.quantity.count}
                      {item.quantity.type}
                    </Text>
                  </View>
                </View>
                <Counter
                  item={item}
                  data={cart}
                  onAdd={() => dispatch(addCartItem(item))}
                  onRemove={() => dispatch(removeCartItem(item))}
                />
              </View>
            )}
          />
        ) : (
          <View flex center>
            <View width-50 centerH>
              <BoldText center style={{fontSize: Sizes.font.text}}>
                Your cart is empty!
              </BoldText>
            </View>
          </View>
        )}

        {cart?.length > 0 && (
          <Button
            label={'Confirm'}
            disabled={false}
            size={Button.sizes.large}
            backgroundColor={Colors.primary}
            color={Colors.white}
            disabledBackgroundColor={Colors.$iconDisabled}
            round={false}
            borderRadius={10}
            onPress={() => navigation.navigate('Confirm')}
          />
        )}
      </View>
    </Screen>
  );
}
