import React, { Component } from 'react';
import './App.css';
// import the Google Maps API Wrapper from google-maps-react
import { GoogleApiWrapper } from 'google-maps-react'
// import child component
import MapContainer from './MapContainer'
import LocationList from './LocationList'
import { locations } from './Locations.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: locations,
      activeMarkerInfo: null,
    }
    // console.log("oi", this.state.places);
    this.updateList = this.updateList.bind(this);
  }

  getMarkerInfo=(marker)=>{
    var clientId = "JI35NYHQP02N0BYQPQITBHYAFJRYN0TAU3LQCHRWOWDB1G44";
    var clientSecret = "4PPNXTFLYNF2HBITJ00TYEBIJKSZKCLJMYLAAD2E4TBM4DJZ";

    // Build the api endpoint
    var url =
      "https://api.foursquare.com/v2/venues/search?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&v=20130815&ll=" +
      marker.getPosition().lat() + //lat from the place or marker, that was created by your locations array
      "," +
      marker.getPosition().lng() + //lng from the place or marker, that was created by your locations array
      "&limit=1";

    fetch(url)
      .then((response)=> {
        return response.json()
      })
      .then((response)=> {
        if (response.status !== 200) {
          this.setState({activeMarkerInfo:response.response.venues[0]})
          return
        }
      })
      .catch((err)=> { //error handling
        this.setState({activeMarkerInfo:"Sorry data can't be loaded"})
      });
  }

  updateList(list) {
    this.setState({
      ...this.state,
      places: list
    });
    // console.log("xau", this.state.places);
  }

  render() {
    return (
      <div>
        <h1> Google Maps API + React </h1> // title
/* MOST IMPORTANT: Here we are passing the Google Maps props down to the MapContainer component as 'google'. */
        <MapContainer
          google={this.props.google}
          places={this.state.places}
          markerInfowindow={this.state.activeMarkerInfo}
          getMarkerInfo={this.getMarkerInfo}
        />
        <LocationList
          places={this.state.places}
          updateList={this.updateList}
        />
      </div>
    );
  }
}
// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDGgLJcQR06qHIGFmqWigjNgmZBUivchxE',
})(App)
