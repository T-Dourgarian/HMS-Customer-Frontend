<template>
  <div class="modal" :class="{'is-active': true}">
		<div class="modal-background">				
		</div>
		
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title"> {{ listingToBook.room[0].name }} - {{ listingToBook.room[0].subtitle }}</p>
				<button class="delete" aria-label="close" @click="cancelBooking()"></button>
			</header>
			<section class="modal-card-body">
				

				<div >
					{{ listingToBook.numberOfNights }} Nights, 
				</div>


				<div class="box">
					{{ listingToBook.room[0].description }}
				</div>

				<span style="font-weight:600">Add-ons</span>
				<div v-for="addOn in listingToBook.room[0].addOns" :key="addOn.uuid">
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
					:bookingLoading="bookingLoading"
				>
					Cancel
				</button>

			</footer>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			addOns: [],
			totalPrice: this.listingToBook.totalPrice,
			addOnCosts: 0,
			bookingLoading: false
		}
	},
	props: [ 'listingToBook' ],
	methods: {
		cancelBooking() {
			this.$emit('cancel');
		},
		async confirmBooking() {
			try {
				this.bookingLoading = true;

				

				let lastNight = new Date(this.listingToBook.allDates[this.listingToBook.allDates.length - 1]);
				let checkOut = new Date(this.listingToBook.allDates[this.listingToBook.allDates.length - 1])

				await axios.post('http://localhost:3000/api/booking/create',
					{
						roomUuid: this.listingToBook.roomUuid,
						lastNight: lastNight,
						checkIn: this.listingToBook.checkIn,
						checkOut: checkOut.setDate(lastNight.getDate() + 1),
						numberOfNights: this.listingToBook.allDates.length,
						listingsBooked: this.listingToBook.listingUuids,
						roomPrice: this.listingToBook.totalPrice,
						addOnPrice: this.addOnCosts,
						totalPrice: this.addOnCosts + this.listingToBook.totalPrice,
						numberOfGuests: 1, // not set up yet,
						customerDetails: {} // not setup yet
					}
				)	


				this.bookingLoading = false;
				this.$emit('cancel');
			} catch(error) {
				console.log(error)
				this.bookingLoading = false;
			}
		}
	},
	watch: {
		addOns() {
			this.addOnCosts = 0;

			this.addOns.forEach(addOn => {
				this.addOnCosts += addOn.cost
			});

		}
	},
	created() {
		console.log(this.listingToBook)
	}
}
</script>

<style>

</style>