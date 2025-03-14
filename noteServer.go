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
	Tag			string `json:"tag"`
} 

type Response struct {
	Message string `json:"message"`
}

type Filelist struct{
	List []string `json:"list"`
}

func read(fname string)(data []byte,err error){
	data, err = os.ReadFile("notes/"+fname)
	return
}


func getFileList (folder string)(names []string){ 
	dir, err := os.Open(folder)
	if err != nil {
		fmt.Println("flie list error", err)
	}

	names, err = dir.Readdirnames(-1)

	return names
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
func getNotes(w http.ResponseWriter, r *http.Request){
	filelist := getFileList("notes/")
	response := Filelist{List:filelist}
	jsonResponse, err := json.Marshal(response)
	if err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		w.Write(jsonResponse)
	}
}

func errorHandler (){ }

func main() {
	err := os.Mkdir("notes",0755)
	if err != nil{
		fmt.Println("Note directory exists")
	}
	http.HandleFunc("/getNotes/",getNotes)
	http.HandleFunc("/getFile/", getFile)
	http.HandleFunc("/updateFile/", updateFile)
	http.HandleFunc("/deleteFile/", deleteFile) 
	http.Handle("/", http.FileServer(http.Dir("public/")))
	fmt.Println("Server listening on port 8081")
	http.ListenAndServe(":8081", nil)
}
