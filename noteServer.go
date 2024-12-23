package main

import (
	"fmt"
	"os"
	"net/http"
)

func read(fname string)(data []byte,err error){
	data, err = os.ReadFile(fname)
	return
}

func getFile(w http.ResponseWriter, r *http.Request){
	fname := r.URL.Path[len("/getFile/"):]
	data, err := os.ReadFile(fname)
	if err == nil {
		w.WriteHeader(200)
		w.Write(data)
	}
}

func updateFile(w http.ResponseWriter, r *http.Request){

}

func deleteFile(w http.ResponseWriter, r *http.Request){

}

func main() {
	http.HandleFunc("/getFile/", getFile)
	http.HandleFunc("/updateFile/", updateFile)
	http.HandleFunc("/deleteFile/", deleteFile) 
	http.Handle("/", http.FileServer(http.Dir("public/")))
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}
