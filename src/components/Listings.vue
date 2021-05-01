<template>
	<div v-if="listings">
		<div class="columns box">
			<form class="column is-one-third">
			
				<div class="dateLabel">Arrival</div>
				<b-datepicker
					placeholder="Arrival..."
					custom-class="datePicker"
					v-model="arrival"
					:min-date="minArrival"
				>
				</b-datepicker>


				<b-field label="Departure">
					<b-datepicker
						placeholder="Departure..."
						v-model="departure"
						:min-date="minDeparture"
					>
					</b-datepicker>
				</b-field>

				<button class="button is-primary" style="margin:0 auto 0 auto" @click="getListings()" >Search</button>
			</form>

			<!-- <div v-if="listings[0]">
				{{ listings[0].numberOfNights }} Nights, starting at ${{ listings[0].totalPrice }}
			</div> -->
		</div>

		<div v-for="listing in listings" :key="listing.uuid">
			<div class="card" style="margin: 0 20% 20px 20%; border: 3px solid grey">
				<div class="card-content">
					<div class="title" >
						{{ listing.name }}
					</div>

					<div class="subtitle">
						{{ listing.subtitle }}
					</div>

					<div class="content">
						{{ listing.description }}
					</div>

				</div>

				<footer class="card-footer">
					<div class="card-footer-item">
						<b-button type="is-primary" 
							outlined
							icon-pack="fas"
							icon-left="star"
							@click="bookListing(listing)"
						><b>${{ calculatePrice(listing) }} Book</b></b-button>
					</div>
				</footer>
			</div>
		</div>

		<BookingDialog 
			v-if="bookingDialog"
			:listingToBook="listingToBook"
			:roomPrice="calculatePrice(listingToBook)"
			:checkIn="arrival"
			:checkOut="departure"
			@cancel="cancelBooking()"
		/>

	</div>



</template>

<script>
import axios from 'axios';
import BookingDialog from './BookingDialog';
import moment from 'moment';

export default {
	name:'Listings',
	data() {
		return {
			listings: null,
			dates: [],
			bookingDialog: false,
			listingToBook: {},
			minArrival: moment().subtract(1,'day').toDate(),
			minDeparture: moment().toDate()
		}
	},
	components: { BookingDialog },
	methods: {
		async getListings() {
			try {


				const { data } = await axios.get('http://localhost:3000/api/room/listings', {
					// params: {
					// 	checkIn: this.checkInOut[0],
					// 	checkOut: this.checkInOut[1],
					// }
				});

				console.log(this.departure)

				this.listings = data;
				this.listingToBook = data[0];





			} catch(error) {
				console.log(error);
			}
		},
		calculatePrice(room) {

			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const diffDays = Math.round(Math.abs((this.checkInOut[0] - this.checkInOut[1]) / oneDay));


			return room.basePrice * diffDays;
		},
		async bookListing(listing) {

			this.listingToBook = listing;
			this.bookingDialog = true;
		},
		cancelBooking() {
			this.bookingDialog = false;
		}
	},
	computed: {
		arrival: {
			get() {
				return new Date(this.$store.state.searchParams.arrival) < new Date() ? new Date() : new Date(this.$store.state.searchParams.arrival)
			},
			set( newArrival ) {
				return this.$store.commit('setArrival', newArrival );
			}
		},
		departure: {
			get() {

				let tomorrow = moment().add(1,'day');

				return new Date(this.$store.state.searchParams.departure) < tomorrow.toDate() ? tomorrow.toDate() : new Date(this.$store.state.searchParams.departure)
			},
			set( newDeparture ) {
				return this.$store.commit('setDeparture', newDeparture );
			}
		}
	},
	created() {
		this.getListings();
	}
}
</script>

<style>

.dateLabel {
	font-family: 'Roboto', sans-serif; 
	font-weight: 300;
	letter-spacing: 2px;
	font-size: 19px;
}

.datePicker {
	color:black !important;
	box-shadow: none !important;
}


</style>