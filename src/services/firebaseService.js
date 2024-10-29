const { bucket } = require("../config/firebase");

exports.uploadFileToFirebase = async (file) => {
  const fileName = `Profile_Photos/${Date.now()}_${file.originalname}`;
  const blob = bucket.file(fileName); // This is where the error occurs if bucket is undefined
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => reject(error));

    blobStream.on("finish", async () => {
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};


