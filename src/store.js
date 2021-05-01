import Vue from 'vue'
import Vuex from 'vuex'
// import moment from 'moment';
import createPersistedState from "vuex-persistedstate";


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: {},
		searchParams : {
			arrival: null,
			departure:  null
		}
	},
	mutations: {
		setArrival: (state, newArrival) => {
			state.searchParams.arrival = newArrival
		},
		setDeparture: (state, newDeparture) => {
			state.searchParams.departure = newDeparture
		},
	},
	getters: {
		getArrival: (state) => {
			return state.searchParams.arrival;
		},
		getDeparture: (state) => {
			return state.searchParams.departure;
		}
	},
	plugins: [createPersistedState()],
})

export default store;