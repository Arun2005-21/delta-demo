

if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
} else {
  console.log("Running in Production Mode");
}

console.log("SECRET KEY:", process.env.SECRET);
require('dotenv').config({ path: './.env' });
console.log(process.env.SECRET);









const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
// const { console } = require("inspector");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, hygieneSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require('./models/listing.js');
const Hygiene = require("./models/hygiene.js");
const wrapAsync = require('./utils/wrapAsync.js');




const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
  console.log("connected to DB");
})
.catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);  
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.use('/images', express.static('public/images')); //error this is not in apna file expecialy this line

const store = MongoStore.create({
   mongoUrl: dbUrl,
   crypto: {
     secret :process.env.SECRET,
   }, 
   touchAfter: 24 * 3600, 
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

const validateHygiene = (req, res, next) =>{
  let { error } = hygieneSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
   } else {
    next();
   }
};











app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// //latest
// app.use(express.json()); 

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});






app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.post("/listings/:id/hygiene", validateHygiene, wrapAsync( async(req,res) => {
  let listing = await Listing.findById(req.params.id);
  let newHygiene = new Hygiene(req.body.hygiene);

  listing.hygiene.push(newHygiene);
  await newHygiene.save();
  await listing.save();
  console.log("new hygiene saved");
  res.redirect(`/listings/${req.params.id}`);  // Better to redirect than just send text
}));


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode=500, message="something Went wrong!"} = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});



const PORT = 8080;
app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});

