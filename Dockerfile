FROM golang:latest as build

WORKDIR /app

COPY go.mod .
COPY go.sum .

run go mod download

COPY ..

RUN go build -o /myapp ./cmd/web

FROM alpine:latest as run

COPY --from=build /myapp /myapp

WORKDIR /app
EXPOSE 8081
CMD ["/myapp"]
