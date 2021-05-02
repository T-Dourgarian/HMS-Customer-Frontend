<template>
	<v-row class="ma-0">
		<v-col>
			<v-row class="ma-0" style="backgroundColor: rgb(240, 240, 240);">
				<v-col>
					<v-card  class="listingContainer" elevation="1">
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
											<!-- <v-row class="ma-0 pa-0">
												<v-col cols="3" class="amenityContainer" v-for="(amenityPair, i) in formatAmenityArray(listing.amenities)" :key="i">
													<div class="amenity" v-for="(amenity, i) in amenityPair" :key="i">
														<v-icon x-small color="rgb(131, 114, 84)">fas fa-{{ amenity.icon }}</v-icon>
														<span> {{ amenity.name }} </span>
													</div>
												</v-col>
											</v-row> -->
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
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	props:[ 'listing' ],
	created() {
		console.log(this.listing)
	}
}
</script>

<style>

</style>