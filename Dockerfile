FROM golang:latest

WORKDIR /app

VOLUME /app/notes

COPY go.mod ./

run go mod download

COPY . .

RUN go build -o main . 

EXPOSE 8081
CMD ["./main"]
