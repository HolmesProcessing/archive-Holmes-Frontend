FROM golang:alpine

# create folder
RUN mkdir -p /frontend

# add the files to the container
ADD web /frontend/web
ADD server /frontend/server

WORKDIR /frontend/server
RUN go build

CMD ["./server"]
