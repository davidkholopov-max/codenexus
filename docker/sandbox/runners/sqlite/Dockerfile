# Minimal SQLite runner for SQL exercises
FROM alpine:3.19

RUN apk add --no-cache sqlite

RUN adduser -D -u 1001 runner
USER runner
WORKDIR /sandbox
