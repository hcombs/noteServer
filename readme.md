# Note server

This project is a simple web app for me to write random notes. I did this to learn more about writing a REST server in Go, Docker, and content editable html elements.

## Currently the features of the website are as follows:

- The notes are stored as json files with the note title as the filename, and each json object has a key, content that stores the note.
- The landing page for the website lists all the note titles and an option to create a new note
- Editing or creating a new note brings up a container to edit the note title, note content, and ability to save, delete, or cancel editting the note.

## Potential additions and changes for the future of this project

- Have a tagging key in the JSON note objects to group notes by theme
- A more robust text editor for editing notes with features like text formatting, clickable hyperlinks, and maybe embeddeding images


