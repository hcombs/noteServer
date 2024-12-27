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

type Response struct {
	Message string `json:"message"`

}
func read(fname string)(data []byte,err error){
	data, err = os.ReadFile("notes/"+fname)
	return
}

func getFile(w http.ResponseWriter, r *http.Request){
	fname := r.URL.Path[len("/getFile/"):]
	data, err := os.ReadFile("notes/"+fname)
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

	err = os.WriteFile("notes/"+s.Filename, []byte(s.Content), 0644)
	if err != nil {
		fmt.Println("Error writing to file:",err)
		return
	}

	response := Response{Message: "Update completed for " + s.Filename}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		fmt.Println("Error formatting response", err)
	}


	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(jsonResponse)
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
	err = os.Remove("notes/"+s.Filename)
	
	if err != nil {
		fmt.Println("Error deleting file:",err)
		return
	}

	response := Response{Message: "Delete completed for " + s.Filename}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		fmt.Println("Error formatting response", err)
	}


	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(jsonResponse)
}

func errorHandler (){ }

func main() {
	http.HandleFunc("/getFile/", getFile)
	http.HandleFunc("/updateFile/", updateFile)
	http.HandleFunc("/deleteFile/", deleteFile) 
	http.Handle("/", http.FileServer(http.Dir("public/")))
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}
