import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: {},
		searchParams : {
			checkInOut: [moment(), moment().add(1, 'day')]
		}
	},
	mutations: {
		setDates: (state, newCheckInOut) => {
			state.searchParams.checkInOut = newCheckInOut
		}
	},
	getters: {
		getCheckInOut: (state) => {
			return state.searchParams.checkInOut;
		}
	},
	plugins: [createPersistedState()],
})

export default store