<template>
	<div v-if="listings">

		<v-row class="dateSearchRow ma-0 py-0" justify="center" align="center" v-if="activeStep == 0">
			<v-col cols="2" class="pb-0">
				<div class="dateLabel">Arrival</div>
			</v-col >
			<v-col cols="2" class="pb-0">
				<div class="dateLabel">Departure</div>
			</v-col>
			<v-col cols="1" class="pb-0">
				<div class="numOfGuestsLabel">No. of Guests</div>
			</v-col>
			<v-col cols="2" class="pb-0">
				<div class="numOfGuestsLabel"></div>
			</v-col>

		</v-row>
		
		<v-row  class="dateSearchRow ma-0" justify="center" align="center"  v-if="activeStep == 0">
			<v-col cols="2" class='pt-0'>
				<b-datepicker
					placeholder="Arrival..."
					custom-class="datePicker"
					v-model="arrival"
					:min-date="minArrival"
					icon="fas fa-calendar"
				>
				</b-datepicker>
			</v-col>
		

			<v-col cols="2" class='pt-0'>
				<b-datepicker
					placeholder="Departure..."
					v-model="departure"
					:min-date="minDeparture"
					icon="fas fa-calendar"
					class="datePicker"
				>
				</b-datepicker>
			</v-col>

			<v-col cols="1" class='pt-0'>
				<b-select v-model="numOfGuests"
					icon="fas fa-male"
					type="is-primary"
				>
					<option
						v-for="i in [1,2,3,4]"
						:value="i"
						:key="i"
					>
						{{ i }}
					</option>
				</b-select>
			</v-col>


			<v-col cols="2" align-self="end" class='pt-0'>
				<button class="searchButton" @click="getListings()"> 
					<v-icon v-if="searchLoading" color="rgb(219, 219, 219)">fas fa-circle-notch fa-spin</v-icon>	
					
					<div v-else  class="searchIcon">Check Availability</div>
				</button>
			</v-col>
		</v-row>

			<!-- <div v-if="listings[0]">
				{{ listings[0].numberOfNights }} Nights, starting at ${{ listings[0].totalPrice }}
			</div> -->


		<b-steps
            v-model="activeStep"
            :animated="true"
            :rounded="true"
            :has-navigation="false"
			class="steps"
		>
            <b-step-item icon="fas fa-bed" label="Select a room" :clickable="activeStep > 0 ? true: false" >
				<v-row class="ma-0" style="backgroundColor: #f1ede7;" align="center" justify="center">
					<v-col cols="9">
						<v-card v-for="listing in listings" :key="listing.uuid" class="listingContainer" elevation="1">
							<v-row class="pa-0 ma-0">
								<v-col cols="4" class="pa-0">
								<b-carousel
									:pause-hover="false"
									:autoplay="false"
									style="height:200px"
								>
									<b-carousel-item v-for="(image, i) in listing.images" :key="i" >
										
											
										<img style="height:200px; width:100%" :src="'http://localhost:3000' + image.path" alt="">
											
										
									</b-carousel-item>
								</b-carousel>
							</v-col>
							<v-col cols="8" style="position: relative;">
								<v-row>
									<v-col class="pb-0">
										<v-row class="ma-0">
											<v-col cols="3" class="px-0 pt-0">
												<div class="roomTitle">
													{{ listing.name }}
												</div>

												<div class="roomSubtitle">
													{{ listing.subtitle }}
												</div>
											</v-col>
											<v-col class="px-0 pt-0">
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
								<template>
									<button class="bookButton"  @click.prevent="bookListing(listing)">
										BOOK
										<v-icon color="#e0e0e0" style="margin:0 0 3px 0 !important;" small> fas fa-chevron-right</v-icon> 
									</button>
								</template>

								<div class="price">
									${{ listing.basePrice }} <span class="perNight"> / Night </span>
								</div>
							</v-col>
							</v-row>
						</v-card>
					</v-col>
				</v-row>
            </b-step-item>

            <b-step-item icon="fas fa-clipboard-list" label="Booking Details"   >
                <Customize 
					v-if="activeStep == 1"
					:listing="listingToBook" 
					:arrival="arrival"
					:departure="departure"
					@navigate="navigate"
				/>
            </b-step-item>

            <b-step-item icon="fas fa-check" label="Confirm Booking">
                Lorem ipsum dolor sit amet.
            </b-step-item>

        </b-steps>




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
import Customize from './Customize';

export default {
	name:'Listings',
	data() {
		return {
			listings: null,
			dates: [],
			bookingDialog: false,
			listingToBook: {},
			minArrival: moment().subtract(1,'day').toDate(),
			searchLoading: false,
			activeStep: 0,
			numOfGuests: 2
		}
	},
	components: { BookingDialog, Customize },
	methods: {
		async getListings() {
			try {
				this.searchLoading = true;

				const { data } = await axios.get('http://localhost:3000/api/room/listings', {
					params: {
						checkIn: this.arrival,
						checkOut: this.departure,
						numOfGuests: this.numOfGuests,
						companyUuid: 'f8899d40-9a0e-11eb-8cc7-f50a8fca0685'
					}
				});

				this.listings = data;
				this.listingToBook = data[0];

				console.log(this.listingToBook);




			} catch(error) {
				console.log(error);
			}


			this.searchLoading = false;

		},
		navigate(direction) {
			if (direction) { // 1 is forward
				this.activeStep++;
			} else {// 0 is backward
				this.activeStep--;
			}
		},
		calculatePrice(room) {

			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const diffDays = Math.round(Math.abs((this.arrival - this.departure) / oneDay));


			return room.basePrice * diffDays;
		},
		async bookListing(listing) {
			this.activeStep = 1
			this.listingToBook = listing;
		},
		cancelBooking() {
			this.bookingDialog = false;
		},
		formatAmenityArray(amenities) { // formats amenities array in such a way that they can be nicely formatted in columns in a v-for
			let mainArray = [];
			let tempArray = [];

			let amenitiesPerColumn = amenities.length > 8 ? 3 : 2;

			for (let i = 0; i < amenities.length; i++) {
				if ( i % amenitiesPerColumn === 0) {
					tempArray = [ amenities[i] ];

				} else {
					tempArray.push(amenities[i])
					
					if (tempArray.length === amenitiesPerColumn) {
						mainArray.push(tempArray);
						tempArray = [];
					}
				}

				if (i === amenities.length - 1) {
					mainArray.push(tempArray);
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
		},
		minDeparture() {

			
			return moment(this.arrival).add(1,'day').toDate()
		},
	},
	watch: {
		arrival() {
			if (this.arrival > this.departure) {
				this.departure = moment(this.arrival).add(1,'day').toDate()
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
	color:#64563e;
}

.numOfGuestsLabel {
	font-family: 'Roboto', sans-serif; 
	font-weight: 300;
	letter-spacing: 2px;
	font-size: 13px;
	color:#64563e;
}

.dateSearchRow {
	background: rgb(216, 216, 216);
}

.searchButton {
	font-family: 'Roboto', sans-serif; 
	font-weight: 300;
	letter-spacing: 2px;
	color:rgb(219, 219, 219);
	font-size: 19px;
	background-color:#837254;
	padding: 10px 13px 10px 13px;
	width:100%;

}

.searchButton:hover {
	background-color: #a08e6e;
}

.listingContainer {
	margin: 20px !important;
	background-color: #f3f3f3 !important;
	height:200px;
	border-radius: 0px !important;
}

.roomTitle {
	color: #837154;
	font-family: 'Libre Baskerville', serif;
	font-weight: 600;
	font-size: 17px;
	letter-spacing: 1px;
}

.roomSubtitle {
	font-family: 'Libre Baskerville', serif;
	color: #837254;
	font-size: 13px;
}


.roomDescription {
	font-family: 'Open Sans', sans-serif;
	color: rgb(109, 109, 109);
	font-size: 12px;
}

.amenityContainer {
	padding: 0 !important;
}

.amenity {
	font-family: 'Open Sans', sans-serif;
	color: #837254;
	font-size: 11px;
}

.bookButton {
	position: absolute;
	bottom:0;
	right:0;
	height:35px;
	width:105px;
	background: #837254;
	padding:5px 10px 5px 10px;
	color: #e0e0e0;
	font-family: 'Roboto', sans-serif; 
	font-weight: 400;
	font-size: 17px;
}

.bookButton:hover {
	background: #a08e6e;
}

.price {
	position:absolute;
	font-family: 'Open Sans', sans-serif;
	color: #837254;
	font-size:16px;
	bottom: 0;
	padding: 0 0 5px 0;
}

.perNight {
	font-size: 14px;
}

.step-content {
	padding: 0 !important;
	height:100vh;
	overflow-y: scroll;
}


.steps {
	background-color: #f1ede7;
	padding: 10px 0 0 0;
}

</style>