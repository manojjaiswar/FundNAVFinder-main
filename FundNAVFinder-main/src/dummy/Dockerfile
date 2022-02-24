FROM nginx:alpine
RUN apk add --update nodejs npm
RUN apk add --no-cache bash
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["src/polysets-web/package.json", "src/polysets-web/package-lock.json*", "src/polysets-web/npm-shrinkwrap.json*", "./"]
COPY ./src/polysets-web .

COPY ./scripts/docker/polysets-web/entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 80
CMD [ "/bin/bash", "-c", "./entrypoint.sh" ]