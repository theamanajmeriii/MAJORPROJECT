const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log("SHOW PAGE:", listing.geometry);
  res.render("listings/show.ejs", { listing,  mapToken: process.env.MAP_TOKEN });
};

module.exports.createListing = async (req, res, next) => {

  let listing = req.body.listing;

  // Trim first
  if (listing.title) listing.title = listing.title.trim();
  if (listing.location) listing.location = listing.location.trim();
  if (listing.country) listing.country = listing.country.trim();
  if (listing.description) listing.description = listing.description.trim();

  // Then geocode the cleaned values
  let response = await maptilerClient.geocoding.forward(
    `${listing.location}, ${listing.country}`,
    {
      limit: 1,
    }
  );

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(listing);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  console.log(response.features[0].geometry);
  newListing.geometry = response.features[0].geometry;


  let savedListing = await newListing.save();

  console.log(savedListing);

  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    console.log(listing);

    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace( "/upload","/upload/w_250,h_250,c_fill,e_blur:50");
    res.render("listings/edit.ejs", {listing, originalImageUrl});

};

module.exports.updateListing = async(req,res)=>{
         

    let {id}= req.params;
    

    let updatedListing = req.body.listing;

if(updatedListing.title) updatedListing.title = updatedListing.title.trim();
if(updatedListing.location) updatedListing.location = updatedListing.location.trim();
if(updatedListing.country) updatedListing.country = updatedListing.country.trim();
if(updatedListing.description) updatedListing.description = updatedListing.description.trim();


let listing = await Listing.findByIdAndUpdate(id, {...updatedListing});

if(typeof req.file != "undefined"){
let url = req.file.path;
let filename= req.file.filename;
listing.image = {url,filename}
await listing.save();
}  

    
 
    req.flash("success","listing Updated!");
    res.redirect(`/listings/${id}`);

};

module.exports.destroyListing = async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing Deleted!");
    res.redirect("/listings");

}
