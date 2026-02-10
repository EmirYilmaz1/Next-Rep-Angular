# Web Application Development
🏋️ Next Rep

Next Rep is a fitness tracking application developed as part of a university course project.
This repository contains the frontend (client-side) implementation built with Angular.

The application is designed to help users track their workouts, manage sets and repetitions, and monitor their training progress through a simple and user-friendly interface.

⸻

🎓 Project Scope
	•	📚 Developed as an academic project
	•	💻 Frontend implemented using Angular
	•	🔗 Designed to communicate with a backend via RESTful APIs

⸻

🚀 Features
	•	📝 Workout and exercise listing
	•	🔢 Display of sets and repetitions
	•	📈 Structure suitable for progress tracking
	•	🎨 Clean and user-focused UI
	•	⚡ Component-based architecture


## version "continuous"

#### Install Angular (v20) tools
```bash
npm install -g @angular/cli@20
```
NOTE: from some reasons, it is not recommended to install Angular tools (as `ng`) locally (i.e. among the project files). Global installation (`-g` option) may require administrative rights to the system. On Mac and Linuxes, you should precede the command with `sudo`.

#### Consume this project

##### Clone sources to a local folder
```bash
git clone https://gitlab.com/mariusz.jarocki/wad-cont.git
```

##### Install dependecies for both frontend and backend
```bash
npm install && npm --prefix frontend install
```
##### Configure to your needs (changing default settings)
Copy `.env-example` to `.env` and customize the second file if needed.

##### Run both parts of Webapp using development servers
```bash
npm run dev
```
in the second terminal
```bash
cd frontend
npm run dev
```

##### To reinitialize databases
* stop the backend
* simply remove `./db/*.sqlite3` files (all or selected)
* start the backend

##### Enjoy the working Webapp in your browser!
http://localhost:4200

##### REST API documentation
[Click here](./API.md)

##### ERD diagram
![ERD](./data-erd.png)

##### Visual component dependencies
![Visual components](./visual-component-dependencies.drawio.png)