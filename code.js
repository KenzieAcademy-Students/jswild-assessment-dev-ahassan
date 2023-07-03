// To run this assignment, right click on index.html in the Visual Studio file explorer to the left
// and select "Open with Live Server"

// Your Code Here.

// To obtain geographic location from browser
let latitude;
let longitude;

function updateLocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  fetchImages();
}

function handleLocationError(error) {
  console.log("Error getting location:", error.message);
  // hardcoded latitude and longitude
  latitude = 39.76574;
  longitude = -86.1579024;
  fetchImages();
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(updateLocation, handleLocationError);
} else {
  console.log("Geolocation is not supported by this browser.");
  // hardcoded latitude and longitude
  latitude = 39.76574;
  longitude = -86.1579024;
  fetchImages();
}

// Constructing the query URL
const apiKey = "256ac4b33d0ecf105beb54b03b82a43a";
const baseFlickrURL = "https://api.flickr.com/services/rest/?";
const method = "flickr.photos.search";
const perPage = 5;
const searchText = "boat";
const safeSearch = 1;

function constructImageURL(photoObj) {
  return `https://farm${photoObj.farm}.staticflickr.com/${photoObj.server}/${photoObj.id}_${photoObj.secret}.jpg`;
}
// this function accepts an images parameter, which represents the collection of images retrieved from the Flickr API.
function getNextImage(images) {
   // this variable keeps track of the current index of the image to be displayed.
  let currentIndex = 0;
  return function () {
    const imageElement = document.getElementById("imageContainer");
    if (!imageElement) {
      console.log("Image container element could not be found.");
      return;
    }

    const photoObj = images[currentIndex];
    const imageUrl = constructImageURL(photoObj);

    // Displays the image
    imageElement.innerHTML = `<img src="${imageUrl}" alt="Flickr Image">`;

    currentIndex = (currentIndex + 1) % images.length;
  };
}

// To send the request to Flickr and process the response data
function fetchImages() {
  const flickrQueryURL = `${baseFlickrURL}api_key=${apiKey}&format=json&nojsoncallback=1&method=${method}&safe_search=${safeSearch}&per_page=${perPage}&lat=${latitude}&lon=${longitude}&text=${searchText}`;

  fetch(flickrQueryURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.photos && data.photos.photo.length > 0) {
        const photos = data.photos.photo;
        const showNextImage = getNextImage(photos);
        setInterval(showNextImage, 5000);
      } else {
        console.log("No images found.");
      }
    })
    .catch((error) => {
      console.log("Error fetching images:", error);
    });
}
