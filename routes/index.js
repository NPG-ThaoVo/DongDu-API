const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { FIND_USER_BY_EMAIL } = require("../queries/query");
const { UPDATE_USER } = require("../queries/mutation");
const { sendEmailResetPassword } = require("../services/mail");
const { MongoClient, GridFSBucket } = require("mongodb");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_TTL } = require("../config");
const cors = require("cors");

function nonAccentVietnamese(str) {
  str = str.toLowerCase();
  // We can also use this instead of from line 11 to line 17
  str = str.replace(
    /\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g,
    "a"
  );
  str = str.replace(
    /\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g,
    "e"
  );
  str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  str = str.replace(
    /\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g,
    "o"
  );
  str = str.replace(
    /\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g,
    "u"
  );
  str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

const chunkSize = 255 * 1024;
const bucketName = "fs";

const { DB_FILE_CONNECTION } = require("../config");
const router = express.Router();
router.use(
  cors({
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// const connection = mongoose.connect(DB_FILE_CONNECTION);
let bucket;

const promise = MongoClient.connect(DB_FILE_CONNECTION).then((client) => {
  const db = client.db("dongdudatabasefile");
  bucket = new GridFSBucket(db, { bucketName });
  return db;
});

// Create a storage object with a given configuration
const storage = new GridFsStorage({
  db: promise,
  file: (req, file) => {
    let name = file.originalname.toString().trim().replace(/\s/g, "-");
    name = nonAccentVietnamese(name);
    name = Date.now().toString() + "-" + name;

    return {
      filename: name,
      chunkSize,
      bucketName,
    };
  },
});

storage.on("connection", (db) => {
  console.log("\nConnect to file server successful!");
});

storage.on("connectionFailed", (err) => {
  console.error("\n[ERROR] Connect to file server failed\n", err);
});

storage.on("streamError", (err) => {
  console.error("\n[ERROR] Stream file error!\n", err);
});

storage.on("dbError", (err) => {
  console.error("\n[ERROR] Database error!\n", err);
});

// Set multer storage engine to the newly created object
const upload = multer({ storage, dest: "./public" });

router.get("/upload", (req, res) => {
  res.send("hello");
});

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400);
    return res.json({ error: "No image found" });
  }

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization,content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE"
  );
  res.type("application/json");
  req.file.publicUrl = "/resource/gridfs/" + req.file?.filename;
  res.send(JSON.stringify(req.file));
});

router.get("/resource/gridfs", async (req, res) => {
  const cursor = bucket
    .find({})
    .toArray()
    .then((data = []) => {
      return res.json(data);
    });
});

router.get("/resource/gridfs/:filename", async (req, res) => {
  const cursor = bucket
    .find({ filename: req.params.filename })
    .toArray()
    .then((data = []) => {
      if (data.length <= 0) return res.json({ error: "File does not exist!" });
      res.setHeader("Content-type", data[0]?.contentType);
      return bucket.openDownloadStream(data[0]._id).pipe(res);
    });
});

router.post("/password-reset", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email === "")
      res.json({ success: false, message: "Email is required" });
    const app = req.app;
    const keystone = app.get("keystoneInstance");
    const context = keystone.createContext().sudo();

    const { data } = await context.executeGraphQL({
      query: FIND_USER_BY_EMAIL,
      variables: {
        email: email,
      },
    });

    if (data && data.allUsers && data.allUsers.length === 0) {
      res.json({
        success: false,
        message: "Địa chỉ Email chưa được đăng ký trong hệ thống!",
      });
    } else {
      const provider =
        data && data.allUsers && data.allUsers[0].provider
          ? data.allUsers[0].provider
          : "";
      const userId =
        data && data.allUsers && data.allUsers[0].id ? data.allUsers[0].id : "";
      if (provider === "local") {
        const token = jwt.sign({ id: userId, email }, JWT_SECRET, {
          expiresIn: JWT_TTL,
        });
        await sendEmailResetPassword(email, token);
        res.json({
          success: true,
          message: "Email đã được gửi!",
        });
      } else {
        res.json({
          success: false,
          message:
            "Địa chỉ email bạn đã cung cấp không có sẵn trên dịch vụ này. Vui lòng cung cấp một địa chỉ email hợp lệ!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "An error occurred",
      error,
    });
  }
});

router.post("/verify-token", (req, res) => {
  try {
    const { token } = req.body;
    const data = jwt.verify(token, JWT_SECRET);
    if (data) res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
});

router.post("/change-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (password === "")
      res.json({ success: false, message: "Password is required" });

    const app = req.app;
    const keystone = app.get("keystoneInstance");
    const context = keystone.createContext().sudo();
    app.use(cors({ origin: "*" }));
    const dataEncoded = jwt.verify(token, JWT_SECRET);
    if (dataEncoded) {
      const id = dataEncoded.id;
      const { data } = await context.executeGraphQL({
        query: UPDATE_USER,
        variables: {
          id,
          data: {
            password,
          },
        },
      });
      res.json({ success: true, data });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
});

module.exports = router;
