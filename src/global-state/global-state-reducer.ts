import { Dispatch, Reducer, useReducer } from "react";
import { TGlobalStateAction } from "./global-state-actions";
import { TGlobalState } from "./types";

const initialGlobalState: TGlobalState = {
  production: null,
  error: { callErrors: null, globalError: null },
  reloadProductionList: false,
  devices: {
    input: null,
    output: null,
  },
  userSettings: null,
  selectedProductionId: null,
  calls: {},
  callOrder: [],
  apiError: false,
  websocket: null,
};

const globalReducer: Reducer<TGlobalState, TGlobalStateAction> = (
  state,
  action
): TGlobalState => {
  // Simple Debug
  // logger.cyan(
  //   `Global state action: ${action.type}, payload: ${action.payload}`
  // );
  switch (action.type) {
    case "ERROR": {
      const { callId, error } = action.payload;

      if (callId && error) {
        // Call-specific error
        return {
          ...state,
          error: {
            ...state.error,
            callErrors: {
              ...state.error.callErrors,
              [callId]: error,
            },
          },
        };
      }
      // Global error
      return {
        ...state,
        error: {
          ...state.error,
          globalError: error,
        },
      };
    }
    case "PRODUCTION_UPDATED":
      return {
        ...state,
        reloadProductionList: true,
      };
    case "API_NOT_AVAILABLE":
      return {
        ...state,
        apiError: new Error("API not available"),
      };
    case "PRODUCTION_LIST_FETCHED":
      return {
        ...state,
        reloadProductionList: false,
      };
    case "DEVICES_UPDATED":
      return {
        ...state,
        devices: action.payload,
      };
    case "SELECT_PRODUCTION_ID":
      return {
        ...state,
        selectedProductionId: action.payload,
      };
    case "ADD_CALL":
      const id = action.payload.id;
      return {
        ...state,
        calls: {
          ...state.calls,
          [id]: action.payload.callState,
        },
        callOrder: state.callOrder.includes(id) ? state.callOrder : [...state.callOrder, id]
      };
    case "UPDATE_CALL":
      if (
        action.payload.updates.audioLevelAboveThreshold &&
        state.calls[action.payload.id].audioLevelAboveThreshold ===
          action.payload.updates.audioLevelAboveThreshold
      )
        return state;
      return {
        ...state,
        calls: {
          ...state.calls,
          [action.payload.id]: {
            ...state.calls[action.payload.id],
            ...action.payload.updates,
          },
        },
      };
    case "REMOVE_CALL": {
      const id = action.payload.id;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { [id]: _, ...remainingCalls } = state.calls;

      return {
        ...state,
        calls: remainingCalls,
        callOrder: state.callOrder.filter( (callId) => callId !== id), 
        production: null,
      };
    }; 
    case "MOVE_CALL": {
      const callId = action.payload.id; 
      const toIndex = action.payload.toIndex;
      const currentIndex = state.callOrder.findIndex( (id) => id === callId); 
      if (currentIndex === -1 || 
          currentIndex === toIndex || 
          toIndex < 0 || 
          toIndex >= state.callOrder.length) {
        return state;
      }
        
      // Insert att new index, shuffle array
      const newArray = [...state.callOrder];
      const [id] = newArray.splice(currentIndex, 1);
      newArray.splice(toIndex, 0, id);

      return {
        ...state, 
        callOrder: newArray,
      }
    }
    case "UPDATE_USER_SETTINGS":
      return {
        ...state,
        userSettings: action.payload,
      };
    case "SET_WEBSOCKET":
      return {
        ...state,
        websocket: action.payload,
      };
    default:
      return state;
  }
};

export const useInitializeGlobalStateReducer = (): [
  TGlobalState,
  Dispatch<TGlobalStateAction>,
] => useReducer(globalReducer, initialGlobalState);
