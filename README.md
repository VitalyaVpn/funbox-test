# Google Maps Waypoints

---
Description 
-----------
React app with Google Maps.

---
Installation and usage
----------------------

```
git clone https://github.com/VitalyaVpn/funbox-test.git
yarn install
yarn start - to start dev server
yarn build - to make production build
yarn test - to run tests
```
+ App requires Google Maps API key.
  + Go to the Google Maps Platform > [Credentials page](https://console.cloud.google.com/project/_/google/maps-apis/credentials?hl=ru).
  
  + On the Credentials page, click Create credentials > API key.
The API key created dialog displays your newly created API key.

  + Click Close.
The new API key is listed on the Credentials page under API keys.
  + Copy API key.
  + Put it in the `.env.development` for dev build or `.env.production` for production build. See example
  + ```
    REACT_APP_API_KEY = YOUR_API_KEY
    ```



Example page
------------
App deployed on firebase

[https://profound-maker-339015.web.app/](https://profound-maker-339015.web.app/)

![Alt-текст](https://sun9-46.userapi.com/impg/AsHpMk0IVirz3vfUn-kLSgKZWPuu0BGa6dFDAA/uDJ0yG3u1bc.jpg?size=1919x978&quality=96&sign=bf5439fb2c09448586d7f2b0c1fa1941&type=album "App screen")
