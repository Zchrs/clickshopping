
import { types } from "../types/types";

const initialState = {
  checking: true,
  user: null,
  isAuthenticated: false,
  currentUser: null,
};

const initialStateAdmin = {
  checking: true,
  admin: null,
  isAuthenticated: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login usuario normal
    case types.authLogin:
      return {
        ...state,
        checking: false,
        user: action.payload,
        isAuthenticated: true,
        currentUser: action.payload,
      };

    // Logout usuario normal
    case types.authLogout:
      return {
        ...initialState,
        checking: false,
      };

    // Finalizar checking
    case types.authCheckingFinish:
      return {
        ...state,
        checking: false,
      };

    // Set guest (invitado)
    case types.authSetGuest:
      return {
        ...state,
        checking: false,
        user: null,
        isAuthenticated: false,
        isGuest: true,
        currentUser: action.payload,
      };

    default:
      return state;
  }
};

export const authReducerAdmin = (state = initialStateAdmin, action) => {
  switch (action.type) {
    case types.authAdminLogin:
      return {
        ...state,
        checking: false,
        admin: action.payload.admin,
        isAuthenticated: true,
      };

    case types.authAdminLogout:
      return {
        ...initialStateAdmin,
        checking: false,
      };

    case types.adminCheckingFinish:
      return {
        ...state,
        checking: false,
      };

    default:
      return state;
  }
};
