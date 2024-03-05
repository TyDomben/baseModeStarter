import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_DOG_PROFILE" actions
function* fetchDog() {
  try {
  //get the dogs:
  const dogResponse = yield axios.get('/api/dog')
    yield put({ type: 'SET_DOG_PROFILE', payload: dogResponse.data });
  } catch (error) {
    console.log('dog get request failed', error);
  }
}


function* dogSaga() {
  yield takeLatest('FETCH_DOG_PROFILE', fetchDog);
}

export default dogSaga;
