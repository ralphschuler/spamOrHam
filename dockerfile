FROM node as build

RUN apt-get -y update && apt-get -y install \
    curl \
    wget \
    build-essential \
    make \
    gcc \
    g++ \
    autoconf \
    python3 \
    node-gyp \
    bzip2 \
    python \
    gcc-multilib \
    libxi-dev \
    libglu1-mesa-dev \
    libglew-dev pkg-config

COPY ./package*.json ./yarn.lock ./
RUN yarn

FROM node

WORKDIR /workspace

COPY . .
COPY --from=build ./node_modules ./node_modules
RUN yarn build

CMD ["node", "dist/index.js"]
