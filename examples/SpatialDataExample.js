import Rx from 'rx';
import extend from 'extend';
var BingServices = require('../lib/index');

// Fetch the west village surroundings
BingServices.whatsAroundMe({
  apiKey: 'Aji7ARlyYm81OWlGyWxr8DCdPFhUtbYyAYq1LcAKgFoYh1Q6Dx5Sqvybk8qVTtir',
  location: '40.735803,-74.001374',
  top: 20,
  radius: 1
} , {
  // An unexpected error occurred.
  error: function (e){
    console.log('Received an error:\n', e);
  },
  // OK.
  success: function (result){
    Rx.Observable.from(result)
                 .subscribe((location) => {
                     var entityType = BingServices.getEntityTypeDetails(location.EntityTypeID);
                     console.log(JSON.stringify(extend(true, {}, location, entityType)));
                 },
                 (error) => {
                     console.log("There was an error: " + error);
                 });
  },
});