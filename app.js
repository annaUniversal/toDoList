const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

//extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const reteLimiter = require("express-rate-limit");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const auth = require("./middleware/auth");
const { UnauthenticatedError } = require("./errors");
const cookieParser = require("cookie-parser");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routers
const tasks = require("./routes/tasks");
const events = require("./routes/events");

const csrf = require("host-csrf");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(require("body-parser").urlencoded({ extended: true }));

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));
app.use(express.static("public")); //styles

// after cookie_parser and any body parsers but before any of the routes.
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.urlencoded({ extended: false }));
let csrf_development_mode = true;
console.log(app.get("env"));
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
  app.use(
    reteLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );
}
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

const csrf_options = {
  protected_operations: ["PATCH", "PUT", "POST"],
  protected_content_types: [
    "application/json",
    "application/x-www-form-urlencoded",
  ], // protect headers from
  development_mode: csrf_development_mode,
};
app.use(csrf(csrf_options));

passportInit();
app.use(passport.initialize());
app.use(passport.session());

// this code must come after the app.use that sets up sessions, because flash depends on sessions
app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));

// These lines should be added before any of the lines that govern routes, such as the app.get and app.post statements:
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/tasks", auth, tasks);
app.use("/events", auth, events);

app.use((req, res, next) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
  // res.status(500).send('Something went wrong!');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
