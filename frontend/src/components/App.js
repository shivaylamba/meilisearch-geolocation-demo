import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { tableHeaderData } from "./appData";

/* 
  Initial state contains the coordinates of a nearby restaurant
  from the data present in the meili search database
*/
const initialState = {
  longitude: 8.128168,
  latitude: 51.22672,
  radius: 2000,
};

const BASE_API_URL = "http://localhost:7700";

function App() {
  const [searchValue, setSearchValue] = useState(""); // For Search Input
  const [dataList, setDataList] = useState([]); // For storing data list from API
  const [isDataFilter, setIsDataFilter] = useState(false); // Toggling the checkbox for data filter
  const [location, setLocation] = useState(initialState); // Setting filter data input location
  const [select, setSelect] = useState(""); // For Selecting sorting

  const handleSearch = async () => {
    let filter, sort;
    if (isDataFilter) {
      filter = `_geoRadius(${location.latitude}, ${location.longitude}, ${location.radius})`;

      if (select) {
        sort = [
          `_geoPoint(${location.latitude}, ${location.longitude}):${select}`,
        ];
      }
    }

    const restaurantList = await axios({
      url: `${BASE_API_URL}/indexes/restaurants/search`,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: {
        attributesToHighlight: ["*"],
        limit: 200,
        q: searchValue,
        filter,
        sort,
      },
    });
    setDataList(restaurantList.data.hits);
  };

  useEffect(
    () => handleSearch(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { longitude, latitude } }) => {
          setLocation({ ...location, longitude, latitude });
        }
      );
    } else {
      alert(
        "Current location can't be fetched as Geo Navigation is not present in your device."
      );
    }
  };

  const distanceFormatter = (val) => `${val / 1000} kms`;

  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setLocation({ ...location, [name]: [value] });
  };

  return (
    <div className='App container'>
      <h1>Find Restaurants</h1>
      <div className='wrapper'>
        <input
          className='search-input'
          placeholder='Search a restaurant by name, place, location, pincode'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className='filter-wrapper'>
          <input
            type='checkbox'
            className='filter-checkbox'
            checked={isDataFilter}
            onChange={() => setIsDataFilter(!isDataFilter)}
          />
          <label>Filter based on current location</label>

          {isDataFilter && (
            <div>
              <button className='get-location-btn' onClick={getCurrentLocation}>
                Get current location
              </button>

              <div className='filter-container'>
                <div className='filter-location-wrapper'>
                  <div>
                    <label className='filter-label'>Longitude</label>
                    <input
                      value={location.longitude}
                      className='filter-input'
                      type='number'
                      name='longitude'
                      placeholder='Longitude'
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div>
                    <label className='filter-label'>Latitude</label>
                    <input
                      value={location.latitude}
                      className='filter-input'
                      type='number'
                      placeholder='Latitude'
                      name='latitude'
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div>
                    <label className='filter-label'>Radius</label>
                    <input
                      value={location.radius}
                      className='filter-input'
                      type='number'
                      placeholder='Radius'
                      name='radius'
                      onChange={handleLocationChange}
                    />
                  </div>
                </div>
                <div>
                  <lable className='filter-label'>Sort</lable>
                  <select
                    className='filter-input'
                    onChange={(e) => setSelect(e.target.value)}
                  >
                    <option value=''>Select</option>
                    <option value='asc'>Ascending sort</option>
                    <option value='desc'>Descending sort</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='search-button-wrapper'>
          <button className='search-button' onClick={handleSearch}>
            SEARCH
          </button>
        </div>
      </div>
      <table className='table'>
        <thead>
          <tr>
            {tableHeaderData.map((tData) => (
              <th className='table-header-data' key={`th-${tData.id}`}>
                {tData.title}
              </th>
            ))}
            <th className='table-header-data'>Longitude</th>
            <th className='table-header-data'>Latitude</th>
            {dataList &&
              dataList.length !== 0 &&
              dataList[0].hasOwnProperty("_geoDistance") && (
                <th className='table-header-data'>Distance from location</th>
              )}
          </tr>
        </thead>
        <tbody>
          {dataList && dataList.length !== 0 ? (
            dataList.map((rest) => (
              <tr key={rest.id}>
                {tableHeaderData.map((tData) => (
                  <td className='table-data' key={`td-${tData.id}`}>
                    {rest[tData.id]}
                  </td>
                ))}
                <td className='table-data'>{rest._geo.lng}</td>
                <td className='table-data'>{rest._geo.lat}</td>
                {dataList &&
                  dataList.length !== 0 &&
                  dataList[0].hasOwnProperty("_geoDistance") && (
                    <td className='table-data'>
                      {distanceFormatter(rest._geoDistance)}
                    </td>
                  )}
              </tr>
            ))
          ) : (
            <tr>
              <td className='table-data' colSpan='7'>
                No result found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
