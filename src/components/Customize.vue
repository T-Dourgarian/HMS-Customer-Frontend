<template>
	<v-row class="ma-0">
		<v-col>
			<v-row class="ma-0" style="backgroundColor: rgb(240, 240, 240);">
				<v-col cols="12">
					<v-card   elevation="1">
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
							<template>
								<button class="bookButton"  @click.prevent="bookListing(listing)">
									Book
									<v-icon color="#e0e0e0" small> fas fa-chevron-right</v-icon> 
								</button>
							</template>

							<div class="price">
								${{ listing.basePrice }} <span class="perNight"> / Night </span>
							</div>
						</v-col>
						</v-row>
					</v-card>
				</v-col>
				<v-col >
					<v-row class="ma-2 addOnContainer" v-for="addOn in listing.addOns" :key="addOn.uuid" align="center">
						<v-col>
							<b-checkbox 
								v-model="selectedAddons"
								:native-value="addOn"
								style="margin: 5px 0 5px 0;"
							>
								{{ addOn.name }}
							</b-checkbox>

						</v-col>
						<v-col>
							${{ addOn.cost}}
						</v-col><v-col></v-col>
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
	props:[ 'listing' ],
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
		}
	}
}
</script>

<style>

.addOnContainer{
	background-color: #dbccb3 !important;
	color: #524329;
}
</style>