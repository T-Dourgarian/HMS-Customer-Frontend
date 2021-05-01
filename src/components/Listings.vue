<template>
	<div v-if="listings">
		
		<v-row style="margin: 0!important" class="dateSearchRow" justify="center" align="center">
			<v-col cols="3">
				<div class="dateLabel">Arrival</div>
				<b-datepicker
					placeholder="Arrival..."
					custom-class="datePicker"
					v-model="arrival"
					:min-date="minArrival"
					icon="fas fa-calendar"
				>
				</b-datepicker>
			</v-col>


			<v-col cols="3">
				<div class="dateLabel">Departure</div>
				<b-datepicker
					placeholder="Departure..."
					v-model="departure"
					:min-date="minDeparture"
					icon="fas fa-calendar"
					class="datePicker"
				>
				</b-datepicker>
			</v-col>

			<v-col cols="3" align-self="end">
				<button class="searchButton" @click="getListings()"> 
					<v-icon v-if="searchLoading" color="rgb(219, 219, 219)">fas fa-circle-notch fa-spin</v-icon>	
					
					<div v-else  class="searchIcon">Check Availability</div>
				</button>
			</v-col>
		</v-row>

			<!-- <div v-if="listings[0]">
				{{ listings[0].numberOfNights }} Nights, starting at ${{ listings[0].totalPrice }}
			</div> -->

		<v-row class="ma-0">
			<v-col>
				<v-row v-for="listing in listings" :key="listing.uuid" class="listingContainer">
					<v-col cols="4" class="pa-0">
						<b-carousel
							:pause-hover="false"
							:autoplay="false"
							style="height:250px"
						>
							<b-carousel-item v-for="(image, i) in listing.images" :key="i" >
								
									
								<img style="height:250px; width:100%" :src="'http://localhost:3000' + image.path" alt="">
									
								
							</b-carousel-item>
						</b-carousel>
					</v-col>
					<v-col cols="8" style="position: relative;">
						<v-row>
							<v-col class="pb-0">
								<v-row class="ma-0">
									<v-col cols="3" class=" pl-0 pt-0">
										<div class="roomTitle">
											{{ listing.name }}
										</div>

										<div class="roomSubtitle">
											{{ listing.subtitle }}
										</div>
									</v-col>
									<v-col class="pr-0">
										<v-row class="ma-0 pa-0">
											<v-col cols="3" class="amenityContainer" v-for="(amenityPair, i) in formatAmenityArray(listing.amenities)" :key="i">
												<div class="amenity" v-for="(amenity, i) in amenityPair" :key="i">
													<v-icon x-small color="rgb(131, 114, 84)">fas fa-{{ amenity.icon }}</v-icon>
													<span> {{ amenity.name }} </span>
												</div>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</v-col>
							<v-col class="pt-0" cols="12">
								<div class="roomDescription">
									{{ listing.description }}
								</div>
							</v-col>
						</v-row>
						<button class="bookButton">
							Book
							<v-icon color="#e0e0e0" small> fas fa-chevron-right</v-icon> 
						</button>

						<div class="price">
							${{ listing.basePrice }} <span class="perNight"> / Night </span>
						</div>
					</v-col>
				</v-row>
			</v-col>
		</v-row>




		<!-- <div v-for="listing in listings" :key="listing.uuid">
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
		</div> -->

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
			minDeparture: moment().toDate(),
			searchLoading: false,
		}
	},
	components: { BookingDialog },
	methods: {
		async getListings() {
			try {
				this.searchLoading = true;

				const { data } = await axios.get('http://localhost:3000/api/room/listings', {
					params: {
						checkIn: this.arrival,
						checkOut: this.departure,
						companyUuid: 'f8899d40-9a0e-11eb-8cc7-f50a8fca0685'
					}
				});

				console.log(data)

				this.listings = data;
				this.listingToBook = data[0];




			} catch(error) {
				console.log(error);
			}


			this.searchLoading = false;

		},
		calculatePrice(room) {

			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const diffDays = Math.round(Math.abs((this.arrival - this.departure) / oneDay));


			return room.basePrice * diffDays;
		},
		async bookListing(listing) {

			this.listingToBook = listing;
			this.bookingDialog = true;
		},
		cancelBooking() {
			this.bookingDialog = false;
		},
		formatAmenityArray(amenities) { // formats array to have each element be another array of max length 2 to format amentities  
			let mainArray = [];
			let tempArray = []
			for (let i = 0; i < amenities.length; i++) {
				if ( i % 2 === 0) {
					tempArray = [ amenities[i] ];

					if (i === amenities.length - 1) {
						mainArray.push(tempArray);
					}

				} else {
					tempArray.push(amenities[i])
					mainArray.push(tempArray);
					tempArray = [];
				}
			}


			return mainArray;
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

.dateSearchRow {
	background: rgb(216, 216, 216);
}

.searchButton {
	font-family: 'Roboto', sans-serif; 
	font-weight: 300;
	letter-spacing: 2px;
	font-size: 19px;
	background-color:#837254;
	padding: 10px 13px 10px 13px;
	color:rgb(219, 219, 219);
	width:100%;

}

.searchButton:hover {
	background-color: rgb(151, 151, 151);
}

.listingContainer {
	margin: 20px !important;
	background-color: rgb(240, 240, 240);
	height:250px;
}

.roomTitle {
	color: #837254;
	font-family: 'Libre Baskerville', serif;
	font-size: 25px;
	letter-spacing: 1px;
}

.roomSubtitle {
	font-family: 'Libre Baskerville', serif;
	color: #837254;
	font-size: 18px;
}


.roomDescription {
	font-family: 'Open Sans', sans-serif;
	color: rgb(109, 109, 109);
}

.amenityContainer {
	padding: 0 !important;
}

.amenity {
	font-family: 'Libre Baskerville', serif;
	color: #837254;
	font-size: 13px;
}

.bookButton {
	position: absolute;
	bottom:0;
	right:0;
	height:45px;
	width:125px;
	background: #837254;
	padding:5px 10px 5px 10px;
	color: #e0e0e0;
	font-family: 'Roboto', sans-serif; 
	font-weight: 300;
	font-size: 23px;
}

.bookButton:hover {
	background: #a08e6e;
}

.price {
	position:absolute;
	font-family: 'Libre Baskerville', serif;
	font-style: italic;
	color: #837254;
	font-size: 20px;
	bottom: 0;
	padding: 0 0 5px 0;
}

.perNight {
	font-size: 16px;
}

</style>