import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from 'src/types/auth';
import { User } from 'src/entities/User';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

// Extending the Action type to allow any action
interface AuthAction {
  type: string;
  payload?: User | string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null
};

const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload as User,
        error: null
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload as string
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;
