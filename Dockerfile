FROM nikolaik/python-nodejs:python3.10-nodejs16-alpine As development
WORKDIR /usr/src/app
COPY package.json ./
RUN apk add build-base pkgconfig libusb-dev linux-headers eudev-dev
RUN yarn install
COPY . .
RUN npm run build
RUN rm -Rf node_modules
ARG DEV_ENV=null
RUN echo ${DEV_ENV}
RUN echo ${DEV_ENV} | base64 -d > /usr/src/app/config.yaml
ARG FCM=null
RUN echo ${FCM} | base64 -d > /usr/src/app/fcm.json
RUN yarn install --prod


FROM gcr.io/distroless/nodejs:16 as masterclassroom-chat-api
WORKDIR /usr/share/app
COPY --from=development /usr/src/app/dist/ dist/
COPY --from=development /usr/src/app/config.yaml dist/config/config.yaml
COPY --from=development /usr/src/app/fcm.json fcm.json
COPY --from=development /usr/src/app/node_modules/ node_modules/
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
CMD ["dist/src/main"]
EXPOSE 3000
EXPOSE 3005