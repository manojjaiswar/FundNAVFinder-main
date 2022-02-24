npm set //verdaccio:4873/:_authToken "g7JwbbhC0dnE3vkbzZnGwIJcoTHmHA1x5UNdAC8y7hk=" && \
npm config set registry http://verdaccio:4873 && \
npm config get registry && \
npm install --legacy-peer-deps && \
npm run build && \
cd /usr/share/nginx/html && \
chmod 755 /usr/share/nginx/html && \
rm -rf ./* && \
chmod 755 /usr/share/nginx/html && \
cp -rf /usr/src/app/build/. . && \
nginx -g 'daemon off;'