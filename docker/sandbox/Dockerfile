# Code execution sandbox — Go service
FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY apps/compiler/go.mod apps/compiler/go.sum ./
RUN go mod download

COPY apps/compiler/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o sandbox-service ./cmd/server

FROM alpine:3.19
RUN apk add --no-cache docker-cli ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/sandbox-service .

EXPOSE 8080
ENTRYPOINT ["./sandbox-service"]
