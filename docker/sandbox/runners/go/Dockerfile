# Minimal Go runner
FROM golang:1.22-alpine AS base

RUN adduser -D -u 1001 runner

# Pre-warm the Go module cache for faster compilation
RUN go install golang.org/x/tools/gopls@latest 2>/dev/null; true

USER runner
WORKDIR /sandbox
ENV GOPATH=/home/runner/go
ENV GOCACHE=/home/runner/.cache/go-build
