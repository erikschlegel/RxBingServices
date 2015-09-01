import Rx from 'rx';
import extend from 'extend';
var BingServices = require('../lib/index');

// Fetch the west village surroundings
var rsp = BingServices.whatsAroundMe({
  apiKey: 'Place your API Key here',
  location: '40.735803,-74.001374',
  top: 20,
  radius: 1
} , {
  // An unexpected error occurred.
  error: function (e){
    console.log('Received a validation error:\n', e);
  }
}).subscribe((rspSequence) => {
           Rx.Observable.from(BingServices.fromRspToSpatialEntities(rspSequence))
                        .subscribe((location) => {
                            let entityType = BingServices.getEntityTypeDetails(location.EntityTypeID);
                            console.log(JSON.stringify(extend(true, {}, location, entityType)));
                        });
        },
        (error) => {
            console.log("There was an error: " + error);
        }
);