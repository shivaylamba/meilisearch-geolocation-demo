<img alt="MeiliSearch Logo" src="https://www.meilisearch.com/_nuxt/img/cf59975.svg" width="250" />

# MeiliSearch Geolocation API Demo

This is a demo application showing the capabilities of the [MeiliSearch Geolocation API](https://docs.meilisearch.com/reference/features/geosearch.html). It is a React based application to showcase both the sorting and filtering capabilities of the Geolocation Search API using the _geoSearch and _geoPoint attributes. It uses a data of 10 restaurants with their _geo data included in a CSV file. 

## Local Setup

To run the application locally follow these steps in the given order: 
1. Run ./meiliSearch in the backend folder locally to initiate the Meilisearch Server and create the data.ms folder: 
```
cd backend
./meilisearch
```

2. In a separate terminal window : use these steps to add restaruant.json data index in the Meilisearch database: 
```
cd backend
npm install
npm start
```


3. Once the index for the restaurant.json file is created, in a new terminal window move to the frontend and run the following commands to start the react application
```
cd frontend
npm install
npm start
```

## Demonstration

<video alt="Meilisearch Geolocation Demo" src="https://user-images.githubusercontent.com/19529592/142011543-8dce1783-1e38-48a7-9d9b-31a7da53d60c.mp4" width="250" />
