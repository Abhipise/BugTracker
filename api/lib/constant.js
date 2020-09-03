const AWS = require('aws-sdk');
const fs = require('fs');
const ID = 'AKIAIU7HDAF7J4KPOGMQ';
const SECRET = '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';
const BUCKET_NAME = 'elatictestbucket48';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region : "ap-south-1"
});

const uploadFile = (fileName) => {
    // Read content from the file
    // const fileContent = fs.readFileSync(fileName);
    // console.log(fileName)

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: '5f45fadbe447d49bf95ab0b0/5f4604de8b7456647c3af24e',
        ContentType: 'image/jpg',
        Expires: 100
    };
    s3.getSignedUrl('putObject', params, (err, url) =>{
        if(err) {
            console.log(err);
        }
        console.log(`File uploaded successfully. ${url}`);
    })
};

const getUploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    console.log(fileName)

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: '5f45fadbe447d49bf95ab0b0/5f4604de8b7456647c3af24e',
        Expires: 600
    };
    s3.getSignedUrl('getObject', params, (err, url) =>{
        if(err) {
            console.log(err);
        }
        console.log(`File downloaded successfully. ${url.split('?')[0]}`);
    })
};
uploadFile('./bat.jpg');
getUploadFile('./bat.jpg');

