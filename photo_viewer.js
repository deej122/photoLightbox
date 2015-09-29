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
	var i;
	var images = album.photo;

	// Generate image thumbnails on page
	createThumbnails(images);
	// Set up lightbox functionality/elements
	initializeLightbox(images);
}


// Function to loop through all images in photoset and display image thumbnails on the page
function createThumbnails(images) {
	for(i = 0; i < images.length; i++) {

		var thumbnail_item = document.createElement("LI");
		var thumbnail_image = document.createElement("IMG");

		thumbnail_item.className = "thumbnail";
		thumbnail_image.id = images[i].id;
		thumbnail_image.className = "thumbnailImage";
		thumbnail_image.src = images[i].url_s;

		thumbnail_item.appendChild(thumbnail_image);
		document.getElementById("imageThumbnails").appendChild(thumbnail_item);
	}
}

function initializeLightbox(images) {
	// Set default image to be first in the album (just a sanity check)
	currentImage = images[0];
	document.getElementById("lightboxImage").src = currentImage.url_m;
	document.getElementById("lightboxTitle").innerHTML = currentImage.title;

	// Add click event to thumbnails to open lightbox with corresponding image
	var thumbnails = document.querySelectorAll("img.thumbnailImage");
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
		window.addEventListener("keydown", closeLightbox, false);

		for(i=0; i < images.length; i++) {
			if(images[i].id == imageId) {
				currentImage = images[i];
				document.getElementById("lightboxImage").src = currentImage.url_m;
				document.getElementById("lightboxTitle").innerHTML = currentImage.title;
				return currentImage;
			}
		}
	}

	// Function which toggles to next or previous image depending on which button is clicked
	function toggleImage (e) {
		// Setting these variables for cleanliness
		var index = images.indexOf(currentImage);
		var targetId = e.target.id;

		if(targetId == "toggleNext") {

			// If we reach the end of the list, go back to first image
			if(index < images.length - 1) {
				currentImage = images[index + 1];
			}
			else {
				currentImage = images[0];
			}

			document.getElementById("lightboxImage").src = currentImage.url_m;
			document.getElementById("lightboxTitle").innerHTML = currentImage.title;
		}
		else if(targetId == "togglePrevious") {

			// If we reach first image, go to last image
			if(index > 0) {
				currentImage = images[index - 1];
			}
			else {
				currentImage = images[images.length - 1];
			}

			document.getElementById("lightboxImage").src = currentImage.url_m;
			document.getElementById("lightboxTitle").innerHTML = currentImage.title;
		}
		// Just in case
		else {
			return;
		}
	}
}

function closeLightbox (e) {
	if(e.which == 27) {
		document.getElementById("lightboxContainer").style.display = "none";
	}
	else {
		return;
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