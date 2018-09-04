import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
// import the Google Maps API Wrapper from google-maps-react
import { GoogleApiWrapper } from 'google-maps-react'
// import child component
import { locations } from '../../data/Locations.js';
import locationService from '../../service/Location.service.js';
import SearchInput from '../searchInput/SearchInput.js';
import LocationsList from '../locationsList/LocationsList.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      activeMarkerInfo: null,
      infowindow: {},
      search: '',
      //map:
    }
  }

  componentDidMount(){
    let self = this;
    const {google} = this.props
    const maps = this.props.google.maps; // sets maps to google maps props

    const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
    const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

    const mapConfig = Object.assign({}, {
      center: {lat: -22.9048547, lng: -43.1114312}, // sets center of google map to Icaraí
      zoom: 15, // sets zoom. Lower numbers are zoomed further out.
      mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
    });
    self.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
    self.state.infowindow = new google.maps.InfoWindow();

    self.markers = locations.map((location)=>{
      const marker = new maps.Marker({ // creates a new Google maps Marker object.
        position: {lat: location.location.lat, lng: location.location.lng}, // sets position of marker to specified location
        animation: maps.Animation.DROP,
        map: self.map, // sets markers to appear on the map we just created on line 35
        title: location.name // the title of the marker is set to the name of the location
      })
      marker.addListener('click', function() {
        self.getMarkerInfo(marker);
        // self.state.infowindow.setContent(marker.title);
        // self.state.infowindow.open(this.map, marker);
        // self.props.getMarkerInfo(marker, self.state.infowindow);
      });

      marker.addListener('click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(marker.setAnimation(null), 750);
        }
      }

      return marker

    })
    self.setState({markers:self.markers});
  }

  getMarkerInfo=(marker)=>{
    this.state.infowindow.setContent( //set the content of a info window
      marker.title
    );
    this.state.infowindow.open(this.map, marker);
    locationService.getInfo(marker)
    .then((info)=>{
      var location_data = info;
      var place = `<h3>${location_data.name}</h3>`;
      var street = `<p>${location_data.location.formattedAddress[0]}</p>`;
      var contact = "";
      if (location_data.contact.phone) //if exists a contact.phone
        contact = `<p><small>${location_data.contact.phone}</small></p>`;
      var checkinsCount =
        "<b>Number of CheckIn: </b>" +
        location_data.stats.checkinsCount +
        "<br>";
      var readMore =
        '<a href="https://foursquare.com/v/' +
        location_data.id +
        '" target="_blank">Read More on <b>Foursquare Website</b></a>';
      this.state.infowindow.setContent( //set the content of a info window
        place + street + contact + checkinsCount + readMore
      );
    })
    .catch(console.log)
  }

  onSearchChange=(event)=>{
    const search = event.target.value || '';
    let markers = this.markers
    if(search){
      const regex = new RegExp(search, 'gi');
      markers = markers.filter((marker)=>{
        if(!marker.title.match(regex)){
          marker.setMap(null)
          return false
        } else {
          marker.setMap(this.map)
          return true
        }
      })
    } else {
      markers.forEach((marker)=>marker.setMap(this.map))
    }
    this.setState({search, markers})
  }

  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '90vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    }

    return (
       <div>
        <div ref="map" style={style}>
          loading map...
        </div>
        <SearchInput value={this.state.search} onChange={this.onSearchChange} />
        <LocationsList items={this.state.markers} onItemClick={this.getMarkerInfo}/>
      </div>
    )
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDGgLJcQR06qHIGFmqWigjNgmZBUivchxE',
})(App)
