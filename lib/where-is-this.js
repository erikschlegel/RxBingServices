import Rx from 'rx';
import RxDom from 'rx-dom';
import extend from 'extend';
import {validateInput} from './index';

const serviceUrl = "http://dev.virtualearth.net/REST/v1/Locations/{0},{1}?&o=json&key={2}&$format=json&jsonp=JSONPCallback";

let supportedInputs = {
        apiKey: {
            example: '232edfdnfddf4450',
            description: 'Your api access key to access bing data services. This can be obtained at https://msdn.microsoft.com/en-us/library/ff428642.aspx',
            required: true
        },
        location: {
            example: '34.23245532,-40.47464. {latitude},{longitude}',
            description: 'The users latitude and longitude',
            required: true
        }
};

export function bingLocation(input, exits){
      let errors = validateInput(supportedInputs, input);
      if(errors.size > 0)
        return exits.error({description: 'input validation failed', errorSet: errors});

      if(!validateRequest(input))
        return exits.error({description: 'request failed validation check'});

      var coords = input.location.split(',');
      var BingURL = serviceUrl.format(coords[0], coords[1], input.apiKey);

      return Rx.DOM.jsonpRequest({ url: BingURL, jsonp: 'JSONPCallback' });
};

let validateRequest = function(input){
      return(input.location.split(',').length == 2);
};

export function fromResponeToLocationResources(bingRsp){
    return (bingRsp && bingRsp.response && bingRsp.response.resourceSets && bingRsp.response.resourceSets.length > 0) ?bingRsp.response.resourceSets[0].resources: [];
}
