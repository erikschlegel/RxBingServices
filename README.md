# RxBingServices
Reactive extensions for Bing location and mapping services

This package contains a suite of reactive extension APIs for Bing Map and Location based services: The goal of this package is providing a clean, well-defined API to help make it easier for developers to interact with Microsoft's most powerful services. These API's are built on top of the Reactive(Rx) framework, which helps manage and orcherstrate the asynchronous service calls to Bing. This Node module provides Bing service interfacing hooks for Spatial Data(whats around me), Location Search(where am I) and Navigation Directions(Take Me To). For more details on the underlying Bing Services, please visit [Bing.Services](https://msdn.microsoft.com/en-us/library/dd877956.aspx).

<img src="https://cloud.githubusercontent.com/assets/7635865/9588268/4a0e9478-4ff5-11e5-9fb2-4fb959982881.jpg"width="600" height="300" />

## Usage
To install this package, run `npm install RxBingServices` 
[API Key Request](https://msdn.microsoft.com/en-us/library/ff428642.aspx).

```
var BingServices = require('RxBingServices');
import Rx from 'rx';
```

Check out the places around you by calling whats around me, including your current lat/long. 

```
// Fetch the west village surroundings
BingServices.whatsAroundMe({
  apiKey: 'Your api access key to access bing spatial data services. This can be obtained at https://msdn.microsoft.com/en-us/library/ff428642.aspx',
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
                     let entityType = BingServices.getEntityTypeDetails(location.EntityTypeID);
                     console.log(JSON.stringify(extend(true, {}, location, entityType)));
                 },
                 (error) => {
                     console.log("There was an error: " + error);
                 });
  },
});
```

All services in this package will invoke the client success or error callback depending on the status of the Bing call and response. In this example we're converting the response into an observable sequence, and merging the location details with the metadata details for each returned location. 

## API Reference
* [BingServices](#SD)
  * [.whatsAroundMe](#BingServices.whatsAroundMe)

<a name="SD"></a>
### BingServices
All services are available within the BingServices module

<a name="BingServices.whatsAroundMe"></a>
#### BingServices.whatsAroundMe(options)
Bing Spatial Data Service: collects all entities around a specified geo location. This calls bing spatial data service as an observable, and uses Rx to subscribe to the response of nearby entities

**Returns**: A promise with either the success method called, or the error method invoked. 

| Param | Type | Example | Required | Description
| --- | --- | --- | --- | --- |
| apiKey | <code>string</code> | 232edfdnfddf4450 | Yes | Your api access key to access bing spatial data services. This can be obtained at https://msdn.microsoft.com/en-us/library/ff428642.aspx
