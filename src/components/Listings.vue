<template>
	<div v-if="listings">
		<div class="columns box">
			<form class="column is-one-third">
				<b-field label="Select a date">
					<b-datepicker
						placeholder="Click to select..."
						v-model="checkInOut"
						range>
					</b-datepicker>

					<button class="button is-primary" style="margin:0 auto 0 auto" @click="getListings()" >Search</button>
				</b-field>

				
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
			:totalPrice="calculatePrice(listingToBook)"
			:checkIn="checkInOut[0]"
			:checkOut="checkInOut[1]"
			@cancel="cancelBooking()"
		/>

	</div>



</template>

<script>
import axios from 'axios';
import BookingDialog from './BookingDialog';

export default {
	name:'Listings',
	data() {
		return {
			listings: null,
			dates: [],
			bookingDialog: false,
			listingToBook: {}
		}
	},
	components: { BookingDialog },
	methods: {
		async getListings() {
			try {

				const { data } = await axios.get('http://localhost:3000/api/room/listings', {
					params: {
						checkIn: this.checkInOut[0].toISOString().split('T')[0],
						checkOut: this.checkInOut[1].toISOString().split('T')[0]
					}
				});

				this.listings = data;
				this.listingToBook = data[0];

				console.log(this.listingToBook);




			} catch(error) {
				console.log(error);
			}
		},
		calculatePrice(room) {

			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const diffDays = Math.round(Math.abs((this.checkInOut[0] - this.checkInOut[1]) / oneDay));

			console.log(diffDays)

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
		checkInOut: {
			get() {
				return [new Date(this.$store.state.searchParams.checkInOut[0]), new Date(this.$store.state.searchParams.checkInOut[1])]
			},
			set( newDates ) {

				return this.$store.commit('setDates', newDates );
			}
		}
	},
	created() {
		this.getListings();
	}
}
</script>

<style>

</style>