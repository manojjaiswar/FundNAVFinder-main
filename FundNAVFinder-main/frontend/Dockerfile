FROM nginx:alpine
RUN apk add --update nodejs npm
RUN apk add --no-cache bash
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["frontend/package.json", "frontend/package-lock.json*", "frontend/npm-shrinkwrap.json*", "./"]
COPY ./frontend .

COPY ./scripts/docker/plutus-web/entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 80
CMD [ "/bin/bash", "-c", "./entrypoint.sh" ]