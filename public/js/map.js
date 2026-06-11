if (!coordinates || coordinates.length !== 2) {
  console.log("Invalid coordinates");
} else {
maptilersdk.config.apiKey = mapToken;


const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates,
  zoom: 9,
});


const popup = new maptilersdk.Popup({ offset: 25 })
    .setHTML(`
      <h5>${listingTitle}</h5>
      <p>Exact location provided after booking.</p>
    `);


new maptilersdk.Marker({color:'red'})
  .setLngLat(coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 })
      .setHTML(`
        <h5>${listingTitle}</h5>
        <p>Exact location provided after booking.</p>
      `)
  )
  .addTo(map);

    // Show popup by default
  popup.setLngLat(coordinates).addTo(map)
}