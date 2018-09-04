// Add the api keys for foursquare
const clientId = "JI35NYHQP02N0BYQPQITBHYAFJRYN0TAU3LQCHRWOWDB1G44";
const clientSecret = "4PPNXTFLYNF2HBITJ00TYEBIJKSZKCLJMYLAAD2E4TBM4DJZ";
const apiUrl = 'https://api.foursquare.com/v2/venues/search?'

const getUrl=(position)=>
  // Build the api endpoint
  `
  ${apiUrl}client_id=${clientId}&client_secret=${clientSecret}&v=20130815&ll=${position.lat()},${position.lng()}&limit=1
  `


const getInfo=(marker)=>{

  const url = getUrl(marker.position);

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response=>response.json())
      .then(data=>{
        // if (data.status !== 200) {
        //   console.log(data.response);
        //   return reject('data couldnt be loaded');
        // }
        resolve(data.response.venues[0]);
      })
      .catch(reject);
  });
}

export default{
  getInfo
}
