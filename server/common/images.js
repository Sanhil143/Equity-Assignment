const path = require('path');
const fs = require('fs')
const sharp = require('sharp'); 

function compressImages(file,folderPath,subFolder) {
  const targetSizeInBytes = 100 * 1024; // 100 KB in bytes

  return new Promise((resolve, reject) => {
    const ext = path.extname(file.photo.originalname).toLowerCase();
    const outputPath = path.join(folderPath, `${Date.now()}-${file.photo.originalname}`);
    const url = path.join(subFolder, `${Date.now()}-${file.photo.originalname}`);
    const sharpInstance = sharp(file.photo.path);

    // Resize the image to the desired dimensions
    sharpInstance.resize(480, 640);

    // Convert to JPEG if it's not already JPEG or JPG
    if (ext !== '.jpg' && ext !== '.jpeg') {
      sharpInstance.jpeg();
    }

    sharpInstance
      .toBuffer()
      .then((compressedBuffer) => {
        // Check if the image size is less than or equal to the target size
        if (compressedBuffer.length <= targetSizeInBytes) {
          // If it's already small enough, write it as is
          fs.writeFile(outputPath, compressedBuffer, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          });
        } else {
          // If it's larger, reduce quality until it's within the target size
          let quality = 100;
          const reduceQuality = () => {
            quality -= 5;
            sharp(file.photo.path)
              .resize(640, 480)
              .jpeg({ quality })
              .toBuffer()
              .then((buffer) => {
                if (buffer.length <= targetSizeInBytes || quality <= 5) {
                  fs.writeFile(outputPath, buffer, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(url);
                    }
                  });
                } else {
                  reduceQuality();
                }
              })
              .catch((err) => {
                reject(err);
              });
          };

          reduceQuality();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}



module.exports = {compressImages};
