const fs = require("fs");
const path = require("path");

const environment = process.env.NODE_ENV || "development";
const targetDir = path.join(__dirname, "src/environments");
const targetPath = path.join(targetDir, "environment.ts");

const envConfigFile = `
export const environment = {
  production: ${environment === "production"},
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}'
  }
};
`;

fs.mkdirSync(targetDir, { recursive: true });



fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.error('Error writing environment file:', err);
  } else {
    console.log(`Output generated at ${targetPath}`);
  }
});