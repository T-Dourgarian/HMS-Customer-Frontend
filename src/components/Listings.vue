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

			<div v-if="listings[0]">
				{{ listings[0].numberOfNights }} Nights, starting at ${{ listings[0].totalPrice }}
			</div>
		</div>

		<div v-for="listing in listings" :key="listing.uuid">
			<div class="card" style="margin: 0 20% 20px 20%; border: 3px solid grey">
				<div class="card-content">
					<div class="title" >
						{{ listing.room[0].name }}
					</div>

					<div class="subtitle">
						{{ listing.room[0].subtitle }}
					</div>

					<div class="content">
						{{ listing.room[0].description }}
					</div>

				</div>

				<footer class="card-footer">
					<div class="card-footer-item">
						<b-button type="is-primary" 
							outlined
							icon-pack="fas"
							icon-left="star"
							@click="bookListing(listing)"
						><b>${{ listing.totalPrice }} Book</b></b-button>
					</div>
				</footer>
			</div>
		</div>

		<div class="modal" :class="{'is-active': bookingDialog }" >
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
							<b-checkbox >
								{{ addOn.name}}
								${{ addOn.cost}}
							</b-checkbox>
						</div>
					</div>
					


				</section>

				<footer class="modal-card-foot">
					<button 
						class="button is-success"
						@click="saveEdit()"
					>
						Confirm Booking
					</button>
					<button 
						class="button"
						@click="cancelBooking()"
					>
						Cancel
					</button>

				</footer>
			</div>
		</div>
		
	</div>


</template>

<script>
import axios from 'axios';

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
	methods: {
		async getListings() {
			try {
				const { data } = await axios.get('http://localhost:3000/api/listing', {
					params: {
						checkIn: this.checkInOut[0].toISOString().split('T')[0],
						checkOut: this.checkInOut[1].toISOString().split('T')[0]
					}
				});

				this.listings = data;
				this.listingToBook = data[0];

			} catch(error) {
				console.log(error);
			}
		},
		async bookListing(listing) {

			this.listingToBook = listing;
			this.bookingDialog = true;

			console.log(this.listingToBook)
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

		console.log(this.checkInOut)
	}
}
</script>

<style>

</style>