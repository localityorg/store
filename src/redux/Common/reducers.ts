import {SET_LOCATION} from './actions';

var locationState = {
  location: null,
};

export function locationReducer(state: any = locationState, action: any) {
  switch (action.type) {
    case SET_LOCATION:
      return {...state, location: action.payload};
    default:
      return state;
  }
}

import {SET_USER, REMOVE_USER, removeFromStorage} from './actions';

import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

var userState = {
  user: null,
};

async function getValueFor(key: string) {
  let result = await AsyncStorage.getItem(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

getValueFor('jwtToken').then(data => {
  if (data) {
    const decodedToken: any = jwtDecode(data);
    if (decodedToken.exp * 1000 < Date.now()) {
      removeFromStorage('jwtToken');
      removeFromStorage('refreshToken');
    } else {
      userState.user = {...decodedToken, data};
    }
  }
});

export function userReducer(state = userState, action: any) {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.payload};
    case REMOVE_USER:
      return {...state, user: null};
    default:
      return state;
  }
}
