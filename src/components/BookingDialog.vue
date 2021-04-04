<template>
  <div class="modal" :class="{'is-active': true}">
		<div class="modal-background">				
		</div>
		
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title"> {{ listingToBook.name }} - {{ listingToBook.subtitle }}</p>
				<button class="delete" aria-label="close" @click="cancelBooking()"></button>
			</header>
			<section class="modal-card-body">
				

				<div >
					{{ listingToBook.numberOfNights }} Nights, 
				</div>


				<div class="box">
					{{ listingToBook.description }}
				</div>

				<span style="font-weight:600">Add-ons</span>
				<div v-for="addOn in listingToBook.addOns" :key="addOn.uuid">
					<div>
						<b-checkbox 
							v-model="addOns"
							:native-value="addOn"
						>
							{{ addOn.name}}
							${{ addOn.cost}}
						</b-checkbox>
					</div>
				</div>
				


			</section>

			<footer class="modal-card-foot">
				<button 
					class="button is-success"
					@click="confirmBooking()"
				>
					Confirm Booking
				</button>
				<button 
					class="button"
					@click="cancelBooking()"
					:loading="bookingLoading"
				>
					Cancel
				</button>

			</footer>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
	data() {
		return {
			addOns: [],
			addOnCosts: 0,
			bookingLoading: false
		}
	},
	props: [ 'listingToBook', 'roomPrice', 'checkIn', 'checkOut' ],
	methods: {
		cancelBooking() {
			this.$emit('cancel');
		},
		async confirmBooking() {
			try {
				this.bookingLoading = true;

				let lastDay = this.moment(new Date(this.checkOut));

				await axios.post('http://localhost:3000/api/booking/create',
					{
						roomTypeUuid: this.listingToBook.uuid,
						checkIn: this.checkIn,
						checkOut: this.checkOut,
						numberOfNights: this.numDays(this.checkIn, lastDay),
						roomPrice: this.roomPrice,
						addOnPrice: this.addOnCosts,
						totalPrice: this.addOnCosts + this.roomPrice,
						numberOfGuests: 1, // not set up yet,
						addOns: this.addOns,
						customerDetails: {
							name: 'Thomas Dourgarian',
							email: 'blahblahj@gmail.com',
							phoneNumber: 1234567890,
						}, 
					}
				)	

				this.bookingLoading = false;
				this.$emit('cancel');
			} catch(error) {
				console.log(error)
				this.bookingLoading = false;
			}
		},
		moment: function (date) {
			return moment(date);
		},
		numDays(day1, day2) {

			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const diffDays = Math.round(Math.abs((day1 - day2) / oneDay));


			return diffDays + 1;
		},
	},
	watch: {
		addOns() {
			this.addOnCosts = 0;

			this.addOns.forEach(addOn => {
				this.addOnCosts += addOn.cost
			});

			this.addOnCosts.toFixed(2);
		}
	},
	created() {
		console.log(this.listingToBook)
	}
}
</script>

<style>

</style>