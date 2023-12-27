import { Dispatch } from 'redux';
import { User } from 'src/entities/User';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from 'src/types/auth';
import { mockLogin } from 'src/api/mockApi';

// Mock login function
export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
    try {
      const user: User = await mockLogin(email, password); // Using mock API call
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user
      });
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch({
        type: LOGIN_FAIL,
        payload: errorMessage
      });
    }
  };
  

// Logout action
export const logout = () => (dispatch: Dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

// Mock Toggle Authentication Action
export const toggleAuth = (isAuthenticated: boolean) => (dispatch: Dispatch) => {
  if (isAuthenticated) {
    // Mocking a user object for the sake of testing
    const mockUser: User = { email: 'test@example.com', token: 'mockToken' };
    dispatch({
      type: LOGIN_SUCCESS,
      payload: mockUser
    });
  } else {
    dispatch({
      type: LOGOUT
    });
  }
};