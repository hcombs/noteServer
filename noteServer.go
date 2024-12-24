package main

import (
	"fmt"
	"os"
	"net/http"
	"encoding/json"
	"io/ioutil"
)

type Update struct {
	Filename	string `json:"filename"`
	Content		string `json:"content"`
} 

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
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading body in update file:",err)
		return
	}

	bodyString := string(body)
	fmt.Println(bodyString)
	s := Update{}
	err = json.Unmarshal(body, &s)

	if err != nil {
		fmt.Println("Error unmarshling json in update file", err)
		return
	}

	fmt.Println(s)

	err = os.WriteFile(s.Filename, []byte(s.Content), 0644)
	if err != nil {
		fmt.Println("Error writing to file:",err)
		return
	}

	w.WriteHeader(200)
	w.Write([]byte("{'update':'ran'}"))
}

func deleteFile(w http.ResponseWriter, r *http.Request){
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Error reading body in update file:",err)
		return
	}

	bodyString := string(body)
	fmt.Println(bodyString)
	s := Update{}
	err = json.Unmarshal(body, &s)

	if err != nil {
		fmt.Println("Error unmarshling json in update file", err)
		return
	}

	fmt.Println(s)
	err = os.Remove(s.Filename)
	
	if err != nil {
		fmt.Println("Error deleting file:",err)
		return
	}


	w.WriteHeader(200)
	w.Write([]byte("{'delete':'ran'}"))
}

func main() {
	http.HandleFunc("/getFile/", getFile)
	http.HandleFunc("/updateFile/", updateFile)
	http.HandleFunc("/deleteFile/", deleteFile) 
	http.Handle("/", http.FileServer(http.Dir("public/")))
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}
