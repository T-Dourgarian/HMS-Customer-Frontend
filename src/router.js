import VueRouter from 'vue-router';

//components

import Listings from './components/Listings.vue'
// import Room from './components/Room.vue'


const routes = [
	{ 
		path: '/listings', 
		component: Listings 
	},
	{ 
		path: '/', 
		redirect: '/listings' 
	},
    // { 
	// 	path: '/balances', 
	// 	component: Balances,
	// 	meta: {
	// 		requiresAuth: true
	// 	} 
	// },
	
]


const router = new VueRouter({
	routes // short for `routes: routes`
})

export default router;