import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { httpModule } from '../helpers/HttpModule';
import history from '../helpers/History';

interface AuthState {
  user: User | null;
  error: string | null;
}

interface User {
  // Define the structure of the user object here
  // Example:
  id: number;
  username: string;
  token: string | null;
  // Add other properties as needed
}

// create slice
const name = 'auth';
const initialState: AuthState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers, extraReducers: (builder) => createExtraReducers(builder) });

// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState(): AuthState {
  return {
    // initialize state from local storage to enable the user to stay logged in
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    error: null,
  };
}

function createReducers() {
  return {
    logout,
  };

  function logout(state: AuthState) {
    state.user = null;
    localStorage.removeItem('user');
    history.navigate('/login');
  }
}

function createExtraActions() {
  return {
    login: createAsyncThunk<User, { username: string; password: string }>(
      `${name}/login`,
      async ({ username, password }) => await httpModule.post(`/Auth/login`, { username, password })
    ),
  } as any;
}

function createExtraReducers(builder: any) {
  const { pending, fulfilled, rejected } = extraActions.login;

  builder
    .addCase(pending, (state: AuthState) => {
      state.error = null;
    })
    .addCase(fulfilled, (state: AuthState, action: PayloadAction<User>) => {
      const user = action.payload;

      // store user details and jwt token in local storage to keep the user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;

      // get return url from location state or default to the home page
      const { from } = history.location.state || { from: { pathname: '/' } };
      history.navigate(from);
    })
    .addCase(rejected, (state: AuthState, action: any) => {
      state.error = action.error;
    });
}