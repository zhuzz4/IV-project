var newMap; //Declare newMap as global variable
var markerList = [];
var infowindow;
var geocoder;
var marker;
var directionsService;
var directionsDisplay;


// Initialize the map
function initMap() {
    // Generate new Map and center is Monash University clayton campus
    newMap = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: new google.maps.LatLng(-37.7983459, 144.960974),
        mapTypeId: "terrain",
    });
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    //Initial the map
    const script = document.createElement("script");
    document.getElementsByTagName("head")[0].appendChild(script);
    search()
    navigator.geolocation.getCurrentPosition(setMapCenter,error);
}

function displayRoute(origin, destination, service, display) {
    service
        .route({
            origin: origin,
            destination: destination,
            waypoints: [],
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
        })
        .then((result) => {
            display.setDirections(result);
        })
        .catch((e) => {
            alert("Could not display directions due to: " + e);
        });
}

function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
        return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }

    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
}

//Get the date
function getDate() {
    var myDate = new Date();
    document.write(myDate.toLocaleString())
}

//Display all the restaurant
function displayFood() {

    clearMarker() // Clear all the marker

    let markers = [{lat: -37.7983459, lng: 144.960974}, {
        lat: -37.91434900845777,
        lng: 144.13409224823155
    }, {lat: -37.92402319553542, lng: 144.11968197784918}]

    for (let i = 0; i < markers.length; i++) {
        let newMarker = new google.maps.Marker({
            position: markers[i],
            title: "tooltip" + i.toString()
        });

        markerList.push(newMarker)

    }
    console.log("Display Food")

    showMarker()
}


//Show all the marker in the marker list
function showMarker() {
    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(newMap)
    }
}

//Clear the marker
function clearMarker() {
    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null)
    }
    markerList = []
    // Clear past routes
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
}

function setMapCenter(pos) {
    var crd = pos.coords;
    newMap.setCenter(new google.maps.LatLng(crd.latitude, crd.longitude));
    console.log('current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function fixedRoute() {
    var request = {
        origin: {lat: -37.91379608011779, lng: 145.1317297820128},
        destination: {lat: -37.8828617, lng: 145.0913041},
        travelMode: 'DRIVING'
    };
    findRoute(request)
}

function findRoute(request) {

    // Clear past routes
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }

    //Clear sidebar
    document.getElementById("directPanel").innerHTML = "";

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById("directPanel"),
    });

    directionsDisplay.setMap(newMap);

    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            //console.log(result.routes[0].legs[0].steps);
            console.log(result);
            /* the distance of the first one */
            let totaldistance = result.routes[0].legs[0].distance.value;

            let routes = [];
            let details = result.routes[0].legs[0].steps;
            for (let i = 0; i < result.routes.length; i++) {
                routes[i] = result.routes[i].legs[0].steps;
            }
            findLeastEmissions(routes)
            console.log(totaldistance, routes);
            directionsDisplay.setDirections(result);
        } else {
            console.log(status);
        }
    });
}

function search() {
    const geocodeCache = new Map();
    const geocoder = new google.maps.Geocoder();
    const searchInputEl = document.getElementById('site-search');
    const searchButtonEl = document.getElementById('search-button');

    var input = document.getElementById('site-search');
    var searchBox = new google.maps.places.SearchBox(input);

    const geocodeSearch = function (query) {
        if (!query) {
            return;
        }

        const handleResult = function (geocodeResult) {
            searchInputEl.value = geocodeResult.formatted_address;
            console.log(geocodeResult.formatted_address, geocodeResult.geometry.location)
            updateSearchLocation(geocodeResult.formatted_address, geocodeResult.geometry.location);

        };

        if (geocodeCache.has(query)) {
            handleResult(geocodeCache.get(query));
            return;
        }
        const request = {address: query, bounds: newMap.getBounds()};
        geocoder.geocode(request, function (results, status) {
            if (status === 'OK') {
                if (results.length > 0) {
                    const result = results[0];
                    geocodeCache.set(query, result);
                    handleResult(result);
                }
            }
        });
    };
    searchButtonEl.addEventListener('click', function () {
        geocodeSearch(searchInputEl.value.trim());
    });
}

//navigator.geolocation.getCurrentPosition(setMapCenter,error);
function updateSearchLocation(address, location) {
    searchLocation = {'address': address, 'location': location};
    searchLocationMarker = new google.maps.Marker({
        position: location,
        map: newMap,
        title: 'My location',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#3367D6',
            fillOpacity: 0.5,
            strokeOpacity: 0,
        }
    });
    markerList.push(searchLocationMarker);

    // Update map bounds to include the new location marker.
    const bounds = new google.maps.LatLngBounds();
    center = newMap.getCenter()
    if (searchLocationMarker) {
        bounds.extend(searchLocationMarker.getPosition());
    }
    bounds.extend(center);
    newMap.fitBounds(bounds);


    // ↓ Hard Code origin part
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //     var crd = pos.coords;
    //     findRoute({
    //         origin: {lat: -37.91379608011779, lng: 145.1317297820128},
    //         destination: {lat: location.lat(), lng: location.lng()},
    //         travelMode: 'DRIVING',
    //         provideRouteAlternatives: true,
    //         language: 'en'
    //     })
    // }, error);

    // ↓ get current origin part
    navigator.geolocation.getCurrentPosition(function(pos){var crd = pos.coords;
        findRoute({origin: { lat: crd.latitude, lng: crd.longitude }, destination: { lat: location.lat(), lng: location.lng() }, travelMode: 'DRIVING'})},error);

    // directionsDisplay.setMap(null);
};

// ↓ Choose the route with the least emissions from the existing routes
function findLeastEmissions(routes) {
    return routes[0]
}

function confirmroute() {
    
    let path1 = new Path({
        _id: new mongoose.Types.ObjectId(),
        destination: "?",
        origin: "Monash",
        vehicle: {
            typeName: "VIC",
        },
        user: {
            name: {
                firstName: "FN",
                lastName: "LN",
            },
        },
        pathLength: 1000,
        emmision: 2000
    })
    path1.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
}