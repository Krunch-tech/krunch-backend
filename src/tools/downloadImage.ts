const imageDownloader = require('node-image-downloader');

const downloadImage = async (url: string, filename: string)=> {
    try {
        const info = await imageDownloader({
            imgs: [
              {
                uri: url,
                filename: filename
              }
            ],
            dest: './images'
        });
    } catch (e) {
        console.log("error in saving");
    }
}

export default downloadImage;