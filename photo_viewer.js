var flickr_key = "3e3c7312558715a97a1420a72e2d8251";
var flickr_secret = "0dd531d8540e3a05";

var photoset_id = "72157659166167826";
var user_id = "135894911@N08";

var url = "https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + flickr_key + "&photoset_id=" + photoset_id + 
"&user_id=" + user_id + "&extras=url_m&format=json&jsoncallback=?";

console.log(url);

function displayImages (album) {
	var i;
	var images = album.photo;

	currentImage = images[0];
	document.getElementById("lightboxImage").src = currentImage.url_m;
	document.getElementById("lightboxTitle").innerHTML = currentImage.title;

	var toggles = document.querySelectorAll("div.toggle");

	[].forEach.call(toggles, function(toggle) {
		toggle.addEventListener('click', toggleImage, false);
	});

	function toggleImage (e) {
		console.log(e);
		console.log(images);
		var index = images.indexOf(currentImage);
		console.log("index: " + index);
		var targetId = e.target.id;

		if(targetId == "toggleNext") {

			if(index < images.length - 1) {
				currentImage = images[index + 1];
			}
			else {
				currentImage = images[0];
			}

			console.log(currentImage);
			document.getElementById("lightboxImage").src = currentImage.url_m;
			document.getElementById("lightboxTitle").innerHTML = currentImage.title;

			console.log("Next Image!");

		}
		else if(targetId == "togglePrevious") {

			if(index > 0) {
				currentImage = images[index - 1];
			}
			else {
				currentImage = images[images.length - 1];
			}

			console.log(currentImage);
			document.getElementById("lightboxImage").src = currentImage.url_m;
			document.getElementById("lightboxTitle").innerHTML = currentImage.title;

			console.log("Previous Image!");

		}
		else {
			return;
		}

	}
}

// Retrieve JSON object containing set of images to toggle through using AJAX
$.ajax({
  url: url,
  dataType: 'jsonp',
  success: function(data){
  	// Pass images to JS to handle display
  	var album = data.photoset;
  	displayImages(data.photoset);
  }
});