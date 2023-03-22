// set inventory
export const SET_LOCATION = 'SET_LOCATION';

export const setLocation = (location: [string, string]) => (dispatch: any) => {
  dispatch({
    type: SET_LOCATION,
    payload: location,
  });
};

// all user
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToStorage(key: string, value: any) {
  await AsyncStorage.setItem(key, value);
}

export async function removeFromStorage(key: string) {
  await AsyncStorage.removeItem(key);
}

export const setUser = (user: any) => (dispatch: any) => {
  saveToStorage('jwtToken', user.token).then(() => {
    saveToStorage('refreshToken', user.refreshToken);
  });
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const removeUser = () => (dispatch: any) => {
  removeFromStorage('jwtToken').then(() => {
    removeFromStorage('refreshToken');
  });
  dispatch({
    type: REMOVE_USER,
  });
};
