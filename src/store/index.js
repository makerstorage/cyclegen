import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedAxis: "extruder",
    //selectedIndex: 1,
    page: 1,
    gcodes: [
      { id: 0, gcode: "G90", description: "apsolute position" },
      { id: 1, gcode: "M17", description: "enable steppers" }
    ],
    listCount: 2 // gcode list index
  },
  getters: {
    getselectedAxis(state) {
      return state.selectedAxis;
    },
    getpage(state) {
      return state.page;
    },
    getgcodes(state) {
      return state.gcodes;
    },
    getlistCount(state) {
      return state.listCount;
    }
    // getselectedIndex(state) {
    //   return state.selectedIndex;
    // }
  },
  mutations: {
    setselectedAxis(state, payload) {
      state.selectedAxis = payload;
    },
    setpage(state, payload) {
      state.page = payload;
    },
    addGcode(state, payload) {
      state.gcodes.push(payload);
      state.listCount++;
    },
    setlistCount(state, payload) {
      state.listCount = payload;
    },
    deletegcode(state, index) {
      state.gcodes = state.gcodes.filter(item => item.id !== index);
      state.listCount--;
    }
  },
  actions: {},
  modules: {}
});
