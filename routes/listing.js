const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn , upload.single('listing[image][url]'),validateListing, wrapAsync(listingController.createListing));
 

//New Route
router.get("/new", isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image][url]'),validateListing , wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner ,wrapAsync(listingController.destroyListing));




// mongo fix
// app.get("/fix", async (req, res) => {
//     const listings = await Listing.find({});
//     for (let listing of listings) {
//         listing.title = listing.title?.trim();
//         listing.description = listing.description?.trim();
//         listing.location = listing.location?.trim();
//         listing.country = listing.country?.trim();
//         await listing.save();
//     }
//     res.send("All listings cleaned!");
// });


//index route
// router.get("/",wrapAsync(listingController.index));


// Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

// Create Route
// app.post("/listings",async(req,res)=>{
//     // let {title, description, image,price,country,location}=req.body;

//     if(req.body.listing.image.url === ""){
//         req.body.listing.image.url = undefined;
//     }

//     const newlisting = new Listing(req.body.listing);
//     await newlisting.save(); 
//     res.redirect("/listings");

// });

// router.post("/", isLoggedIn ,validateListing, wrapAsync(listingController.createListing));

// Edit route
router.get("/:id/edit", isLoggedIn,isOwner ,wrapAsync(listingController.renderEditForm));

// Update Route
// router.put("/:id", isLoggedIn, isOwner,validateListing , wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn,isOwner ,wrapAsync(listingController.destroyListing));

module.exports = router;
