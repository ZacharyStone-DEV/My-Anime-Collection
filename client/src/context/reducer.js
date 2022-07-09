import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  DELETE_USER_BEGIN,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_ANIME_BEGIN,
  CREATE_ANIME_SUCCESS,
  CREATE_ANIME_ERROR,
  GET_ANIMES_BEGIN,
  GET_ANIMES_SUCCESS,
  GET_PLAYLIST_BEGIN,
  GET_PLAYLIST_SUCCESS,
  CREATE_PLAYLIST_BEGIN,
  CREATE_PLAYLIST_SUCCESS,
  CREATE_PLAYLIST_ERROR,
  UPDATE_PLAYLIST_BEGIN,
  UPDATE_PLAYLIST_SUCCESS,
  UPDATE_PLAYLIST_ERROR,
  DELETE_ANIME_BEGIN,
  DELETE_ANIME_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  CHANGE_SITE_LANGUAGE,
  HANDLE_PLAYLIST_CHANGE_BEGIN,
  HANDLE_PLAYLIST_CHANGE_SUCCESS,
  HANDLE_PLAYLIST_CHANGE_ERROR,
  DELETE_PLAYLIST_BEGIN,
  DELETE_PLAYLIST_SUCCESS,
  DELETE_PLAYLIST_ERROR,
} from "./actions";

import { initialState } from "./appContext";

const reducer = (state, action) => {
  if (action.type === CHANGE_SITE_LANGUAGE) {
    return {
      ...state,
      siteLanguage: action.payload,
    };
  }

  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please provide all values!",
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }

  if (action.type === SETUP_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: true,
      token: action.payload.token,
      theme: action.payload.theme,
      user: action.payload.user,
      showAlert: true,
      alertType: "success",
      alertText: action.payload.alertText,
    };
  }
  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
    };
  }
  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      theme: action.payload.theme,
      user: action.payload.user,
      playlist: action.payload.playlist,
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
    };
  }
  if (action.type === DELETE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === DELETE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }
  if (action.type === DELETE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }

  if (action.type === HANDLE_PLAYLIST_CHANGE_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === HANDLE_PLAYLIST_CHANGE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      currentPlaylist: action.payload.playlist,
    };
  }

  if (action.type === HANDLE_PLAYLIST_CHANGE_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      id: "",
      title: "",
    };

    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === CREATE_ANIME_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === CREATE_ANIME_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }
  if (action.type === CREATE_ANIME_ERROR) {
    return {
      ...state,
      isLoading: false,
    };
  }
  if (action.type === GET_ANIMES_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_ANIMES_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      animes: action.payload.animes,
      totalAnimes: action.payload.totalAnimes,
      numOfPages: action.payload.numOfPages,
    };
  }

  if (action.type === GET_PLAYLIST_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === GET_PLAYLIST_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userPlaylists: action.payload.playlists,
    };
  }

  if (action.type === DELETE_ANIME_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === DELETE_ANIME_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      search: "",
      searchStatus: "all",
      searchType: "all",
      sort: "latest",
    };
  }
  if (action.type === CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }

  if (action.type === CREATE_PLAYLIST_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userPlaylists: action.payload.playlists,
      currentPlaylist: {
        title: action.payload.playlist.title,
        id: action.payload.playlist.id,
      },
    };
  }

  if (action.type === CREATE_PLAYLIST_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === CREATE_PLAYLIST_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === HANDLE_PLAYLIST_CHANGE_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === HANDLE_PLAYLIST_CHANGE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userPlaylists: action.payload.playlists,
      currentPlaylist: {
        title: action.payload.playlist.title,
        id: action.payload.playlist.id,
      },
    };
  }

  if (action.type === DELETE_PLAYLIST_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === DELETE_PLAYLIST_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userPlaylists: action.payload.playlists,
    };
  }

  if (action.type === DELETE_PLAYLIST_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  if (action.type === HANDLE_PLAYLIST_CHANGE_ERROR) {
    return {
      ...state,
      isLoading: false,
    };
  }

  if (action.type === UPDATE_PLAYLIST_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === UPDATE_PLAYLIST_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      userPlaylists: action.payload.playlists,
      currentPlaylist: {
        title: action.payload.playlist.title,
        id: action.payload.playlist.id,
      },
    };
  }

  if (action.type === UPDATE_PLAYLIST_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
