FROM oven/bun:slim

# 環境変数の設定
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV HUSKY=0

# Puppeteer用にChromiumをインストール
RUN apt update && apt install -y --no-install-recommends chromium python3 libgif-dev

# ワークディレクトリの作成
RUN mkdir -p /app/packages/md-client && mkdir -p /app/packages/md-server
WORKDIR /app

# パッケージのインストール
COPY package.json /app
COPY bun.lockb /app
COPY ./packages/md-client/package.json /app/packages/md-client
COPY ./packages/md-server/package.json /app/packages/md-server
RUN bun install

# ソースのコピー
COPY . /app
# ビルド
RUN bun install && bun client build

# プロセスの起動
CMD ["bun", "server", "start"]