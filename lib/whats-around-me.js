import Rx from 'rx';
import RxDom from 'rx-dom';
import extend from 'extend';
import {validateInput} from './index';

const serviceUrl = 'https://spatial.virtualearth.net/REST/v1/data/f22876ec257b474b82fe2ffcb8393150';
const bingDSDefault = 'NAVTEQNA';
const bingPOIDefault = 'NavteqPOIs';

let supportedInputs = {
        apiKey: {
            example: '232edfdnfddf4450',
            description: 'Your api access key to access bing spatial data services. This can be obtained at https://msdn.microsoft.com/en-us/library/ff428642.aspx',
            required: true
        },
        location: {
            example: '34.23245532,-40.47464. {latitude},{longitude}',
            description: 'The users latitude and longitude',
            required: true
        },
        select: {
            example: 'Latitude,Longitude,IsWiFiHotSpot,DisplayName',
            description: 'The selection fields from the bing spatial data source',
            required: false
        },
        datasourceName: {
            example: 'NAVTEQNA',
            description: 'The Bing spatial data public data source name to query',
            required: false
        },
        poiName: {
            example: 'NavteqPOIs',
            description: 'The point of interest name',
            required: false
        },
        filter: {
            example: 'StartsWith(PrimaryCity, Clear) eq true',
            description: 'The Odata filter for the bing spatial data query',
            required: false
        },
        orberByClause: {
            example: 'IsWheelchairAccessible',
            description: 'The Odata filter for the bing spatial data query',
            required: false
        },
        top: {
            example: '3',
            description: 'Sets the max returned alllwable results',
            required: false
        },
        radius: {
            example: '1',
            description: 'Spatial data filter radius(in kilometers)',
            required: true
        }
};

let validateRequest = function(input){
      return(input.location.split(',').length == 2);
};

export function whatsAroundMe(input, exits){  
      let errors = validateInput(input);
      if(errors.size > 0)
        return exits.error({description: 'input validation failed', errorSet: errors});

      if(!validateRequest(input))
        return exits.error({description: 'request failed validation check'});

      var coords = input.location.split(',');

      var spatialFilter = "spatialFilter=nearby({0},{1},{2})".format(coords[0], coords[1], input.radius); 
      var select = "$select={0}".format(input.select || '*');
      var filter = (input.filter)?"&$filter={0}".format(input.filter):'';
      var order = (input.order)?"&$orderby={0}".format(input.order):'';
      var top = "$top={0}".format(input.top || 5);

      var BingURL = "{0}/{1}/{2}?key={3}&{4}&{5}&{6}{7}{8}&$format=json&jsonp=JSONPCallback".format(serviceUrl, 
                                              input.datasourceName || bingDSDefault,
                                              input.poiName || bingPOIDefault,
                                              input.apiKey, spatialFilter, select, top, filter,
                                              order);

      Rx.DOM.jsonpRequest({ url: BingURL, jsonp: 'JSONPCallback' }).subscribe(
        function (bingRsp) {
          var bingResponse = (bingRsp && bingRsp.response && bingRsp.response.d && bingRsp.response.d.results) ? bingRsp.response.d.results : [];

          return exits.success(bingResponse);
        },
        function (error) {
          console.log('Encountered an error: ' + error);

          return exits.error(error);
        }
      );
}