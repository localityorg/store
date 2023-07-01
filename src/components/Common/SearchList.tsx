import {FlatList, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from 'react-native-ui-lib';
import {useEffect, useState} from 'react';

import {View} from '../Themed';
import {Text} from './Text';
import {TextInput} from './Input';

import Sizes from '../../constants/Sizes';

interface SearchButtonProps {
  onPress: any;
  placeholder: string;
}

export function SearchButton(props: SearchButtonProps) {
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: Colors.$backgroundDisabled + '77',
        marginVertical: 10,
        marginTop: 0,
      }}
      onPress={props.onPress}
      activeOpacity={Sizes.opacity.thumbnail}>
      <Text style={{fontSize: Sizes.font.text}}>{props.placeholder}</Text>
    </TouchableOpacity>
  );
}

interface SearchListProps {
  data: Array<any>;
  doSomething: any;
  placeholder: string;
  elem: any;
  columns?: number;
}

export function RenderSearchList(props: SearchListProps) {
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (search.trim().length > 0) {
      props.doSomething(search);
    }
  }, [search]);

  return (
    <View flex>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          borderRadius: 10,
          padding: 10,
          backgroundColor: Colors.$backgroundDisabled + '77',
          marginBottom: 10,
        }}>
        <TextInput
          autoFocus={true}
          value={search}
          placeholder={props.placeholder}
          onChangeText={text => setSearch(text)}
          selectionColor={Colors.primary}
          style={{
            flex: 1,
            fontSize: Sizes.font.text,
          }}
        />
        {search.trim().length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <AntDesign name="close" size={Sizes.icon.normal} />
          </TouchableOpacity>
        )}
      </View>
      {props.columns ? (
        <FlatList
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          data={props.data}
          keyExtractor={e => e.id}
          renderItem={item => props.elem(item)}
        />
      ) : (
        <FlatList
          data={props.data}
          keyExtractor={e => e.id}
          renderItem={item => props.elem(item)}
        />
      )}
    </View>
  );
}
