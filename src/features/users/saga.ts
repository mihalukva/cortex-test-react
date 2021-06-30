import { put, takeLatest, all } from "redux-saga/effects";
import { usersApiService } from "../../services/users-api.service";
import { add, loading, error, setPage } from "./usersSlice";
import { TableData, UserInfo } from "../../services/users-api.service";

function* fetchUsers(action: any) {
  try {
    yield put(loading());
    yield put(setPage(action.payload.page));
    const users: TableData<UserInfo> = yield usersApiService.getUsers(
      action.payload.page,
      action.payload.sort
    );
    yield put(add(users));
  } catch (e) {
    yield put(error());
  }
}

function* mySaga() {
  yield takeLatest("USERS_FETCH_REQUESTED", fetchUsers);
}

export default function* rootSaga() {
  yield all([mySaga()]);
}
