# NE-CHUNK-UPLOADER

Yet another chunk uploader library

## What's different?

This library doesn't provide a UI. Just a handful of events to allow you to update **your own** UI. Depending on what kind of network driver are you using, this can even be used in NodeJS (not just web browsers)

## Usage

### Installation and usage

```sh
npm install --save ne-chunk-uploader
```

```javascript
import { NEChunkUploader, NoRetryStrategy, FetchDriver } from 'ne-chunk-uploader'

const chunkUploader = new NEChunkUploader(const defaultOptions = {
  uploadChunkURL: 'http://localhost',
  additionalFields: {}, 
  additionalHeaders: {},
  contentType: 'multipart/form-data',
  file: File|Blob
  chunkSize: 5 * 1024 * 1024,
  retryStrategy: new NoRetryStrategy(),
  driver: new FetchDriver()
});

chunkUploader.addEventListener('error', (error) => ());
chunkUploader.addEventListener('progress', (data) => ());
chunkUploader.addEventListener('chunkRetry', (data) => ());
chunkUploader.addEventListener('complete', (data) => ());
chunkUploader.addEventListener('abort', (data) => ());

chunkUploadHandler.upload();
```

`retryStrategy` and `driver` are not mandatory. When not specified, `NoRetryStrategy` and a very basicly configured `FetchDriver` will be used.

### contentType

2 content types are supported: `multipart/form-data` and `application/json`. Default is `multipart/form-data`

### Events

#### error

Occurs when the upload is interrupted for whatever reason (HTTP errors, connection errors, failed retries, etc.). When error events occur, upload is aborted. Useful for cleaning up and updating the UI accordingly,

#### abort

Occurs when the upload is aborted for whatever reason

#### chunkRetry

Occurs every time a chunk is retried. has the same data as `progress`

#### progress

Occurs after every successful chunk uploading

#### complete

Occurs after all chunks have been uploaded

### Additional fields

The chunk uploader can accept additional fields via the `additionalFields` option. It's an object, where the keys represent the field names. 

### Additional headers

Your endpoint may require other headers aside of what this uploader provides. You can specify them via the `additionalHeaders` option. It's an object where the keys represent the various header names.

### Retry strategy

RetryStrategy tells the uploader how many times a chunk should be retried before giving up and when the retries should be repeated.

There are 4 retry strategies available:

- `NoRetryStrategy`: will provide no retries
- `BasicRetryStrategy(N, baeInterval)` repeats `N` times, waiting `BasicInterval` between retries (typically, when long waiting time is required between retries, but backing off is not required)
- `LinearBackOffRetryStrategy(N, baseInterval)` repeats `N` times, waits `N * BasicInterval` between retries (for endpoints with less stringent throttling)
- `ExponentialBackOffRetryStrategy(N, BaseInterval)` repeats `N` times, waits an increasingly long time between retries `2^N * BaseInterval` (Best to use for endpoints with heavy throttling)

You may write new retry strategies. 

Retry strategies add tries to the first try. So if your retry strategy has 2 tries, the chunk uploader will try uploading 3 times before giving up (hence `retry`).

They should have a constructor either with two parameters `(retryTimes, retryInterval)` or no parameters. You have complete control over the algorithm - and you must implement it :P. Having the parameters in the constructor gives you more flexibility.

They should have also a `getCurve()` method (with no parameters) which would return a n array with int values (the waiting times between retries)

They should also have a `retryInterval` property (it is read by the chunk handler to determine how much to wait after the first try).

### Driver

This is an adapter which is used to interface with whatever AJAX (or WS?) library you want to interact with.

Currently, only the `FetchDriver` is implemented.

Drivers are asynchronous, but not event driven. Any state is returned via the `upload()` method. Network or other connection errors are returned with `status` `-1`.

Drivers shouldn't have any other logic, they just should provide the interface between the transfer library and the chunk uploader.

#### Drivers must implement the following methods:
- setHeaders(headers) - headers is an object (keys are individual headers)
- upload(uploadURL, data) - uploadURL is where the chunk will be sent, data is the chunk data (including the file fragment)
   - for OK and redirect status codes it should return 
   ```javascript
        {
          nativeEvent: null,
          nativeResponse: response, // 2xx, 3xx statuses
          status: response.status,
          statusText: response.statusText,
        }
   ```
   - for error status codes (e.g. 4xx, 5xx), it should return 
   ```javascript
        {
          nativeEvent: null,
          nativeResponse: response, //(5xx and 4xx statuses)
          status: response.status,
          statusText: response.statusText
        }
   ```
   - for connection and other errors it should return
   ```javascript
      {
        nativeEvent: e, // error event thrown by your library of preference
        status: -1,
        statusText: e.message
      }
   ```

#### Driver authorization

   The driver should also make sure that it can handle authorization/authentication through the `Authorization` header. It should also be able to cope with situations when the authorization info is acquired asynchronously (such as in case of a `refreshToken`).

   Since `Fetchdriver` is a shipped driver, it provides this with a property called `onAuthorizationRequest`. The value of the property must point to an asynchronous function/method which returns a string value for the `Authorization` header in the format `[basic|bearer] [basic auth credentials|bearer token]`. All authorization types supported by the `Authorization` header can be used. The value of the property can be set any time:
```javascript
   driver.onAuthorizationRequest = async () => {
    // example for getting an authorization token
    const refreshToken = yourAuthService.refreshToken();
    return "bearer ${refreshToken}";
   }
```
When you don't specify the driver, you will get a FetchDriver out of the box after you create a new `NEChunkUploader` instance:

```javascript
const chunkUploader = new NEChunkUploader({
  chunkUploadURL: 'http://localhost',
  // no driver specified
})

// returns a FetchDriver instance
const driver = chunkUploader.getDriver();
driver.onAuthorizationRequest = async () => {...}
```

Alternatively, if you have long-living authorization data, you may specify it when you create the chunk uploader, using the `additionalHeaders` option. It accepts an object literal, where the keys represent the header names:

```javascript
new NEChunkUploader({
  // ...,
  additionalHeaders: {
    "Authorization": "authorization header value here"
  }
  // ...
})
```