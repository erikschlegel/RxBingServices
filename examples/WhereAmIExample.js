import Rx from 'rx';
import extend from 'extend';
var BingServices = require('../lib/index');

const defaultCoordinates = '42.362606,-71.087918';

var whereAmIObs = Rx.DOM.geolocation.getCurrentPosition();

var myLocationProcessor = {
  'bingLocationService' : (latitude, longitude) => {
      var rsp = BingServices.whereAmI({
          apiKey: process.env.BING_API_KEY,
          location: "{0},{1}".format(latitude, longitude)
      } , {
        // An unexpected error occurred.
        error: function (e){
          console.log('Received a validation error:\n', e);
        }
      }).subscribe((rspSequence) => {
        Rx.Observable.from(BingServices.fromResponeToLocationResources(rspSequence))
                     .subscribe((location) => {
                         console.log("You are currently at Point: {0},{1} Address: {2}".format(location.point.coordinates[0], location.point.coordinates[1], location.name));
                     });
        },
        (error) => {
                    console.log("There was an error: " + error);
        }
      );
  }
}

var subscription = whereAmIObs.subscribe(
  function (pos) {
    console.log('Next:' + pos.coords.latitude + ',' + pos.coords.longitude);
    myLocationProcessor.bingLocationService(pos.coords.latitude, pos.coords.longitude);
  },
  function (err) {
    var message = '';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = 'Permission denied';
        break;
      case err.POSITION_UNAVAILABLE:
        message = 'Position unavailable';
        break;
      case err.PERMISSION_DENIED_TIMEOUT:
        message = 'Position timeout';
        break;
    }
    console.log('Error: ' + message);
    console.log('Using default coords ' + defaultCoordinates);
    let coordSplit = defaultCoordinates.split(',');
    myLocationProcessor.bingLocationService(coordSplit[0], coordSplit[1]);
  },
  function () {
    console.log('Completed');
  });
