npm set //verdaccio:4873/:_authToken "g7JwbbhC0dnE3vkbzZnGwIJcoTHmHA1x5UNdAC8y7hk="
npm config set registry http://verdaccio:4873/
npm install --registry http://verdaccio:4873/
cp -rf node_modules ../
rm -rf node_modules
npm start