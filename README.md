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
var rsp = BingServices.whatsAroundMe({
  apiKey: 'place your API key here',
  location: '40.735803,-74.001374',
  top: 20,
  radius: 1
} , {
  // An unexpected error occurred.
  error: function (e){
    console.log('Received a validation error:\n', e);
  }
}).subscribe((rspSequence) => {
           Rx.Observable.from(BingServices.fromResponseToSpatialEntities(rspSequence))
                        .subscribe((location) => {
                            let entityType = BingServices.getEntityTypeDetails(location.EntityTypeID);
                            console.log(JSON.stringify(extend(true, {}, location, entityType)));
                        });
        },
        (error) => {
            console.log("There was an error: " + error);
        }
);
```

All services in this package will return a Rx observable, which is available for subscription. The subscribe will stream the response in an async fashion. If the request fails its validation request, then the clients error callback will be invoked with the details encapsulated in the error parameter. the client success or error callback depending on the status of the Bing call and response. In this example we're converting the response into an observable sequence, and merging the location details with the metadata details for each returned location. 

## API Reference
* [BingServices](#SD)
  * [.whatsAroundMe](#BingServices.whatsAroundMe)
  * [.fromResponseToSpatialEntities](#BingServices.fromResponseToSpatialEntities)
  * [.getEntityTypeDetails](#BingServices.getEntityTypeDetails)

<a name="SD"></a>
### BingServices
All services are available within the BingServices module

<a name="BingServices.whatsAroundMe"></a>
#### BingServices.whatsAroundMe(options, errorCallback) => <code>Observable</code>
Bing Spatial Data Service: collects all entities around a specified geo location. This calls bing spatial data service as an observable, and uses Rx to subscribe to the response of nearby entities

**Returns**: An observable sequence. The table below describes the response thats streamed back from the subscription. 

#####Supported Input Parameters
| Param | Type | Example | Required | Description | Default
| --- | --- | --- | --- | --- | --- |
| apiKey | <code>string</code> | 232edfdnfddf4450 | Yes | Your api access key to access bing spatial data services. This can be obtained at https://msdn.microsoft.com/en-us/library/ff428642.aspx|None
| location | <code>string</code> | 34.23245532,-40.47464 | Yes | The users latitude and longitude|None
| select | <code>string</code> | Latitude,Longitude,IsWiFiHotSpot,DisplayName | No | The selection fields from the bing spatial data source|All/*
| datasourceName | <code>string</code> | NAVTEQNA | No | The selection fields from the bing spatial data source|NAVTEQNA
| poiName | <code>string</code> | NavteqPOIs | No | The point of interest name|NavteqPOIs
| filter | <code>string</code> | StartsWith(PrimaryCity, Clear) eq true | No | The Odata filter for the bing spatial data query|None
| orberByClause | <code>string</code> | IsWheelchairAccessible | No | The Odata order by clause for the bing spatial data query|None
| top | <code>int</code> | 10 | No | Sets the max returned allowable results|20
| radius | <code>int</code> | 1 | Yes | Spatial data filter radius(in kilometers)|None

<a name="BingServices.fromResponseToSpatialEntities"></a>
#### BingServices.fromResponseToSpatialEntities(response)
Function to convert a whatsAroundMe response to a structured Data Contract array. You can then use Rx.Observable.from to convert the response items to a structured data stream. The response data contract depends on the spatial data source you're requesting. You can even create your own spatial data source, and customize the geo-tagged schema. For more details on creating/publishing your own custom data source or the Microsoft supported public data sources check out https://msdn.microsoft.com/en-us/library/hh478189.aspx

<a name="BingServices.getEntityTypeDetails"></a>
#### BingServices.getEntityTypeDetails(entityTypeId)
Function to translate an spatial data returned entitytypeId to a data structure that's more descriptive and useful. This provides a description and icon word for a particular entity type. The icon word can be used to customize your own pushpin icon image, when leveraging the Rx-BingMaps visualization component.  
