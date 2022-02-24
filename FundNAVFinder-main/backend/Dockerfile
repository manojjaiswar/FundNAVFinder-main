FROM node:14-alpine
RUN apk add --no-cache bash
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN mkdir images
COPY ["backend/package.json", "backend/package-lock.json*", "backend/npm-shrinkwrap.json*", "./"]
COPY ./backend/ .
COPY ./scripts/docker/plutus-api/entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 3000
CMD [ "/bin/bash", "-c", "./entrypoint.sh" ]
