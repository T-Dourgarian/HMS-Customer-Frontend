<template>
	<v-row class="ma-0" >
		<v-col cols="12">
			<v-row class="ma-0">
				<v-col>
					<v-row class="pa-0 ma-0">
						<v-col cols="12" style="position: relative;">
							<v-row>
								<v-col class="pb-0">
									<v-row class="ma-0">
										<v-col cols="3" class=" pl-0 pt-0">
											<div class="roomTitle2">
												{{ listing.name }}
											</div>

											<div class="roomSubtitle">
												{{ listing.subtitle }}
											</div>
										</v-col>
									</v-row>
								</v-col>
								<v-col class="pt-0" cols="12">
									<div class="roomDescription">
										{{ listing.description }}
									</div>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
					<v-row class="ma-0 datesBar">
						<v-col class="">

							{{ arrival.toDateString() }} - {{ arrival.toDateString() }} 
						</v-col>
						<v-divider vertical></v-divider>
						<v-col >	
							{{ numberOfNights }} Nights
						</v-col>
						<v-divider vertical></v-divider>
						<v-col >	
							{{ numOfGuests }} Guests
						</v-col>
					</v-row>

					<v-row class="ma-0">
						<v-col class="roomTitle hover" cols="12" @click="bookerDetailsForm = !bookerDetailsForm">
							Booker Details +
						</v-col>
						
						<v-row class="ma-0" v-if="bookerDetailsForm">
							<v-col cols="6" class="py-0">
								<v-text-field 
									v-model="bookerDetails.firstname"
									label="First Name"
								></v-text-field>
							</v-col>
							<v-col cols="6" class="py-0">
								<v-text-field 
									v-model="bookerDetails.lastname"
									label="Last Name"
								></v-text-field >
							</v-col>
							<v-col cols="6" class="py-0">
								<v-text-field 
									v-model="bookerDetails.emailAddress"
									label="Email Address"
								></v-text-field >
							</v-col>
							<v-col cols="6" class="py-0">
								<v-text-field 
									v-model="bookerDetails.phoneNumber"
									label="Phone Number"
								></v-text-field >
							</v-col>
						</v-row>

						<!-- ------------------------------------ -->
						<v-col class="roomTitle hover" cols="12" @click="addressDetailsForm = !addressDetailsForm">
							Address Info + 
						</v-col>

						<v-row class="ma-0" v-if="addressDetailsForm">
							<v-col cols="6" class="py-0">
								<v-text-field 
									v-model="bookerDetails.city"
									label="City"
								></v-text-field >
							</v-col>
							<v-col cols="6" class="py-0">
								<v-text-field 
									v-model="bookerDetails.state"
									label="State / Region"
								></v-text-field >
							</v-col>
							<v-col cols="6" class="py-0">
								<v-text-field
									v-model="bookerDetails.countrey"
									label="Country"
								></v-text-field >
							</v-col>
							<v-col cols="6" class="py-0">
								<v-text-field
									v-model="bookerDetails.postalCode"
									label="Postal Code"
								></v-text-field >
							</v-col>

						</v-row>
						<!-- ------------------------------------ -->
						<v-col class="guestDetailsTitle hover" cols="12" @click="guestDetailsForm = !guestDetailsForm">
							Guest Details +
						</v-col>

						<v-row class="ma-0" v-if="guestDetailsForm">
						
							<v-col cols="12" class="pa-0" v-for="(guest,i ) in guests" :key="i">

									<v-row class="ma-0">

										<v-col class="py-0">
											<v-text-field
												v-model="guest.firstname"
												label="First Name"
											></v-text-field >
										</v-col>

										<v-col class="py-0">
											<v-text-field
												v-model="guest.lastname"
												label="Last Name"
											></v-text-field >
										</v-col>
								</v-row>
							</v-col>
						</v-row>
						<!-- -------------------------------------- -->
						<v-col class="guestDetailsTitle hover" cols="12" @click="paymentDetailsForm = !paymentDetailsForm">
							Payment Details +
						</v-col>

						<v-row class="ma-0" v-if="paymentDetailsForm">
						
							<v-col>

								<v-text-field
									v-model="creditCard.name"
									label="Card Holder Name"
								></v-text-field >
								
								<v-text-field
									v-model="creditCard.number"
									label="Card Number"
								></v-text-field >

								<v-text-field
									v-model="creditCard.expiration"
									label="Expiration Date"
								></v-text-field >

								<v-text-field
									v-model="creditCard.cvc"
									label="CVC"
								></v-text-field >

							</v-col>
							<v-col>
								<v-row class="ma-0" >	
									<v-col cols="12" class="pb-0 summaryHeader">
										Booking Summary
									</v-col>
									<v-col cols="4" class="pb-0">
										<div class="summarySubHeader">
											Arrival
										</div>
										{{ arrival.toDateString() }}
									</v-col>
									<v-col cols="8" class="pb-0">
										<div class="summarySubHeader">
											Departure
										</div>
										{{ departure.toDateString() }} 
									</v-col>
									<v-col class="py-0">
										<v-row class="ma-0 pa-0">
											<v-col cols="9" class="px-0">
												{{ numberOfNights }} Nights |
											
												${{ listing.basePrice }} / Night
											</v-col>

											<v-col cols="3" class="px-0">
												${{ listing.basePrice * numberOfNights}}
											</v-col>
										</v-row>
									</v-col>

									<v-col cols="12" class="py-0 summarySubHeader">
										<div>
											Extras
										</div>
									</v-col>

									<v-col cols="12" class="pt-1">
										<v-row class="ma-0 pa-0" v-for="addOn in selectedAddons" :key="addOn.uuid">
											<v-col cols="9" class="ma-0 pa-0">
												{{ addOn.name }}
											</v-col>
											<v-col cols="3" class="ma-0 pa-0">
												${{ addOn.cost }}
											</v-col>
										</v-row>
									</v-col>

									<v-col cols="12" class="pt-0">
										<v-divider class="divider mt-1">
										</v-divider>

										<v-row class="ma-0 pa-0">
											<v-col cols="9" class="pa-0 ma-0 roomTitle">
												Total: 
											</v-col>
											<v-col cols="3" class="pa-0 ma-0">
												<b>${{ total }}</b>
											</v-col>
										</v-row>
									</v-col>
								</v-row>

							</v-col>
						</v-row>
					</v-row>
				</v-col>
			</v-row>
		</v-col>
		<v-col cols="12">
			<v-row class="ma-0 px-5" justify="center" align="center">
				<v-col cols="12" class="px-0">
					<v-row class="ma-0" justify="space-between" align="center">
						<v-col cols="4" >
							<button class="continueButton" @click="navigate(0)">
								<v-icon style="margin: 0 0 0 5px;" color="#e0e0e0" small> fas fa-chevron-left</v-icon> 
								Back
							</button>
						</v-col>
						<v-col cols="4" class="continueButtonContainer">
							<button class="continueButton" @click="navigate(1)">
								Complete
							</button>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data() {
		return {
			bookerDetails: {
				firstname: '',
				lastname: '',
				emailAddress: '',
				phoneNumber: '',
				city: '',
				state:'',
				country: '',
				postalCode: '',
			},
			creditCard: {
				name: '',
				number: '',
				expiration: '',
				cvc: ''
			},
			bookerDetailsForm: true,
			guestDetailsForm: false,
			addressDetailsForm: false,
			paymentDetailsForm: false
		}
	},
	props:[ 'listing', 'arrival', 'departure', 'selectedAddons', 'numOfGuests' ],
	methods: {
		navigate(direction) {
			this.$emit('navigate', direction);
		},
	},
	computed: {
		numberOfNights() {
			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const nights = Math.round(Math.abs((this.arrival - this.departure) / oneDay));

			return nights;
		},
		guests()  {
			let guests = [];

			for (let i=0; i < this.numOfGuests; i++) {
				// if (i === 0) {
				// 	guests.push({
				// 		firstname: this.bookerDetails.firstname,
				// 		lastname: this.bookerDetails.lastname
				// 	})
				// } else {
				// 	guests.push({
				// 		firstname: '',
				// 		lastname: ''
				// 	})
				// }

				guests.push({
					firstname: '',
					lastname: ''
				})
			}

			return guests;
		},
		total() {
			
			let addOnTotal = 0;
			
			this.selectedAddons.forEach(addOn => addOnTotal += addOn.cost);

			return addOnTotal + (this.numberOfNights * this.listing.basePrice)

		}

	}
}
</script>

<style scoped>

.roomTitle2 {
	font-size: 45px;
	color: #837154;
	font-family: 'Libre Baskerville', serif;
	font-weight: 600;
	letter-spacing: 1px;
}

/* .roomSubtitle2 {

} */

.datesBar {
	text-align: center;
	background: #837154;
	color: #eee4d5;
}

.guestDetailsTitle {
	font-size: 17px;
	color: #837154;
	font-family: 'Libre Baskerville', serif;
	font-weight: 600;
	letter-spacing: 1px;
}

/* .hover {

} */

.hover:hover {
	cursor: pointer;
}
</style>