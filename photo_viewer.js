// Set API variables
var flickr_key = "3e3c7312558715a97a1420a72e2d8251";
var flickr_secret = "0dd531d8540e3a05";
var photoset_id = "72157659269611965";
var user_id = "135894911@N08";

// Set URL endpoint for API
var url = "https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + flickr_key + "&photoset_id=" + photoset_id + 
"&user_id=" + user_id + "&extras=url_s,url_m&format=json&jsoncallback=?";

// Function to control page UI/content
function displayImages (album) {
	var images = album.photo;

	// Generate image thumbnails on page
	createThumbnails(images);
	// Set up lightbox functionality/elements
	initializeLightbox(images);
}

// Function to loop through all images in photoset and display image thumbnails on the page
function createThumbnails(images) {
	var i;

	for(i = 0; i < images.length; i++) {

		var thumbnail_item = document.createElement("LI");
		var thumbnail_image = document.createElement("IMG");

		thumbnail_item.className = "thumbnail";
		thumbnail_image.id = images[i].id;
		thumbnail_image.className = "thumbnail_image";
		thumbnail_image.src = images[i].url_s;

		thumbnail_item.appendChild(thumbnail_image);
		document.getElementById("thumbnailList").appendChild(thumbnail_item);
	}
}

// This function handles ALL lightbox functionality
// Four nested functions: 
// 1. selectImage: Opens lightbox when an image thumbnail is selected
// 2. toggleImage: Navigates through list of images forwards/backwards
// 3. updateLightbox: Called from toggleImage - handles replacing information in lightbox when image is changed
// 4. closeLightbox: Closes lightbox on escape keydown and removes all event listeners

function initializeLightbox(images) {
	var currentImage;
	// Set default image to be first in the album (unnecessary, but for my sanity)
	currentImage = images[0];
	updateLightbox(currentImage);

	// Add click event to thumbnails to open lightbox with corresponding image
	var thumbnails = document.querySelectorAll("img.thumbnail_image");
	[].forEach.call(thumbnails, function(thumbnail) {
		thumbnail.addEventListener('click', selectImage, false);
	});

	// Add click event to next/previous toggle buttons in lightbox
	var toggles = document.querySelectorAll("div.toggle");
	[].forEach.call(toggles, function(toggle) {
		toggle.addEventListener('click', toggleImage, false);
	});

	// Select image based on what thumbnail is clicked
	function selectImage (e) {
		var i;
		var imageId = e.target.id;

		document.getElementById("lightboxContainer").style.display = "block";
		// Add key press controls to lightbox
		document.getElementById("closeLightbox").addEventListener('click', closeLightbox, false);
		window.addEventListener("keydown", closeLightbox, false);
		window.addEventListener("keydown", toggleImage, false);

		// Find image that was targeted and display its information in the lightbox
		// Kind of brute-forcing it, but can't see a better way
		for(i=0; i < images.length; i++) {
			if(images[i].id == imageId) {
				currentImage = images[i];
				// Call function to fill in accurate lightbox information
				updateLightbox(currentImage);
				return currentImage;
			}
		}
	}

	// Function which toggles to next or previous image depending on which button is clicked
	function toggleImage (e) {
		// Setting these variables for cleanliness
		var index = images.indexOf(currentImage);
		var targetId = e.target.id;

		if(targetId == "toggleNext" || e.which == 39) {
			// If we reach the end of the list, go back to first image
			if(index < images.length - 1) {
				currentImage = images[index + 1];
			}
			else {
				currentImage = images[0];
			}

			// Call function to fill in accurate lightbox information
			updateLightbox(currentImage);
		}

		else if(targetId == "togglePrevious" || e.which == 37) {
			// If we reach first image, go to last image
			if(index > 0) {
				currentImage = images[index - 1];
			}
			else {
				currentImage = images[images.length - 1];
			}

			// Call function to fill in accurate lightbox information
			updateLightbox(currentImage);
		}

		// Just in case
		else {
			return;
		}
	}

	// Create a function to update lightbox information to avoid repetition
	function updateLightbox (currentImage) {
		document.getElementById("lightboxImage").src = currentImage.url_m;
		document.getElementById("lightboxTitle").innerHTML = currentImage.title;
	}

	function closeLightbox (e) {
		if( e.target.id == "closeLightbox" || e.which == 27) {
			document.getElementById("lightboxContainer").style.display = "none";
			// Remove all event listeners that were set when the lightbox was opened
			document.getElementById("closeLightbox").removeEventListener('click', closeLightbox);
			window.removeEventListener("keydown", closeLightbox);
			window.removeEventListener("keydown", toggleImage);
		}
		else {
			return;
		}
	}
}

// Retrieve JSON object containing set of images to toggle through using AJAX call
$.ajax({
  url: url,
  dataType: 'jsonp',
  success: function(data){
  	// Pass images to JS to handle display
  	var album = data.photoset;
  	displayImages(album);
  }
});