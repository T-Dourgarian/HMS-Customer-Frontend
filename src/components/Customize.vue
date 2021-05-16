<template>
	<v-row class="ma-0">
		<v-col>
			<v-row class="ma-0" style="backgroundColor: #f1ede7;" justify="center">
				<v-col cols="12">
					<v-card class="card"  elevation="1">
						<v-row class="pa-0 ma-0">
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
										<v-col class="pr-0 pt-0">
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
						</v-col>
						</v-row>
					</v-card>
				</v-col>
				<v-col cols="12" class="px-0">
					<v-row class="ma-0 ">
						<v-col class="py-0 pl-6 summaryHeader">
							Personalize Your Stay
						</v-col>
					</v-row>
					<v-row class="ma-0">
						<v-col >
							<div class="personalizeContainer">
								<v-row class="ma-0">
									<v-col  cols="8">
										<v-row class="ma-2 addOnContainer" v-for="(addOn,i) in listing.addOns" :key="addOn.uuid" justify="space-between" align="center">
											<v-col class="pr-0">
												<b-checkbox 
													v-model="selectedAddons"
													:native-value="addOn"
													class="addOnName"
												>
													{{ addOn.name }}
												</b-checkbox>

												<div class="addOnDescription">
													{{ addOn.description }}
												</div>

											</v-col>
											<v-col cols="1" class="addOnCost px-0">
												${{ addOn.cost}}
											</v-col>
											<v-col v-if="i !== listing.addOns.length - 1" class="pa-0" cols="12">
												<v-divider class="divider my-1 mx-4"></v-divider>
											</v-col>
										</v-row>
									</v-col>

									
									<v-divider vertical class="divider my-4 mx-0"></v-divider>
									

									<v-col >
										<v-row class="ma-0" >	
											<v-col cols="12" class="pb-0 summaryHeader">
												Booking Summary
											</v-col>
											<v-col cols="6" class="pb-0">
												<div class="summarySubHeader">
													Arrival
												</div>
												{{ arrival.toDateString() }}
											</v-col>
											<v-col cols="6" class="pb-0">
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
													<v-col cols="9" class="pa-0 ma-0">
														Total
													</v-col>
													<v-col cols="3" class="pa-0 ma-0">
														${{ total }}
													</v-col>
												</v-row>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
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
								Continue
								<v-icon style="margin: 0 0 0 5px;" color="#e0e0e0" small> fas fa-chevron-right</v-icon> 
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
			selectedAddons: [],
		}
	},
	props:[ 'listing', 'arrival', 'departure' ],
	created() {
		this.selectedAddons = [];
	},
	methods: {
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
		},
		navigate(direction) {
			this.$emit('navigate', direction)
		}
	},
	computed: {
		numberOfNights() {
			const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

			const nights = Math.round(Math.abs((this.arrival - this.departure) / oneDay));

			return nights;
		},
		total() {
			
			let addOnTotal = 0;
			
			this.selectedAddons.forEach(addOn => addOnTotal += addOn.cost);

			return addOnTotal + (this.numberOfNights * this.listing.basePrice)

		}
	}
}
</script>

<style>

.addOnContainer{

	color: #524329;
}

.card {
	background-color: #f3f3f3 !important;
}

.addOnDescription {
	font-size: 12px;
}

.addOnName {
	font-weight: 400;
}

.addOnCost {
	font-size: 16px;
	color: #524329;
}

.summaryHeader {
	font-size: 20px;
	color: #837254;
	font-weight: bold;
}

.summarySubHeader {
	font-size: 17px;
	color: #837254;
	font-weight: bold;
}

.continueButton {
	height:45px;
	width:200px;
	background: #837254;
	padding:5px 10px 5px 10px;
	letter-spacing: 2px;
	color:rgb(219, 219, 219);
	font-family: 'Roboto', sans-serif; 
	font-weight: 300;
	font-size: 19px;
}

.continueButton:hover {
	background: #a08e6e;
}


.continueButtonContainer {
	text-align: right;
}

.personalizeContainer {
	background-color:  #f3f3f3;
	border: 1px solid rgb(212, 212, 212);
}

.divider {
	background-color: #524329 !important;
}


</style>