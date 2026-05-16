import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    isGetterRouter: false,
    isCollapsed: false,
    userInfo: {}
  },
  mutations: {
    changeGetterRouter(state, value) {
      state.isGetterRouter = value
    },
    changeCollapsed(state) {
      state.isCollapsed = !state.isCollapsed;
    },
    changeUserInfo(state, value) {
      state.userInfo = {
        ...state.userInfo,
        ...value
      }
    },
    clearUserInfo(state) {
      state.userInfo = {}
    }
  },
  plugins: [createPersistedState({
    paths: ["isCollapsed", "userInfo"]
  })],
})
