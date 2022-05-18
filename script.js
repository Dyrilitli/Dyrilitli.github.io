
// variables ---------------------------------------------------

var url = "https://thordisbk.github.io/data.json";
var activeFilters = [];

const filterNames = {
    "all": "Show all",
    "haslink": "Has Link",
    "cplusplus": "C++",
    "csharp": "C#",
    "javascript": "JavaScript",
    "opengl": "OpenGL",
    "unity3d": "Unity",
    "unreal": "Unreal",
    "godot": "Godot",
    "twod": "2D",
    "threed": "3D",
    "pcg": "PCG",
    "ai": "AI",
    "multiplayer": "Multiplayer",
    "gamejam": "Game Jam",
    "groupproject": "Group",
    "individualproject": "Individual",
    "university": "University",
    "physics": "Physics",
    "splines": "Splines"
}

//  ---------------------------------------------------

fetch(url)
.then(res => res.json())
.then(json => {
    createProjectsFromJSON(json);
    createAllButtons(json);
    filterSelection();
})

// create projects ---------------------------------------------------

function createProjectsFromJSON(data) {
    // console.log(data);

    var projectDiv = document.getElementById("projects-grid");

    data.projects.forEach(projectInfo => {
        // console.log(projectInfo);
        var title = projectInfo.title;
        var description = projectInfo.description;
        var date = projectInfo.date;
        var imagepath = projectInfo.imagepath;
        var links = projectInfo.links;
        var classes = projectInfo.classes;

        projectDiv.appendChild(createProjectDiv(title, description, date, imagepath, links, classes));
    });
}

function createProjectDiv(title, description, date, imagepath, links, classes) {

    console.assert(typeof title === 'string' && title != "", 'title is not a string or is empty');
    console.assert(typeof description === 'string', 'description is not a string');
    console.assert(typeof date === 'string', 'date is not a string');
    console.assert(typeof imagepath === 'string' && imagepath.indexOf("/") > -1 && imagepath.indexOf(".") > -1, 'imagepath is not a valid path string');
    console.assert(typeof links === 'object', 'links is not an object');
    console.assert(typeof classes === 'object', 'classes is not an object');

    var project = document.createElement("div");
    project.classList.add("grid-item");
    project.classList.add("filter-div");
    classes.forEach(element => {
        if (element.replace(" ", "") != "") 
            project.classList.add(element);
    });
    project.classList.add("show");

    var linkElem;
    if (links.length > 0) {
        linkElem = document.createElement("a");
        linkElem.setAttribute("href", links[0]);
        // TODO rest of links
    }

    var img = document.createElement("img");
    var imgName = "image";
    if (imagepath.length > 0) imgName = imagepath.split("/")[1].split(".")[0];
    img.setAttribute("src", imagepath);
    img.setAttribute("alt", imgName);
    img.classList.add("project-images");
    if (links.length > 0) linkElem.appendChild(img);
    else project.appendChild(img);

    var infoDiv = document.createElement("div");
    infoDiv.classList.add("project-info");

    var titleElem = document.createElement("h2");
    var titleText = document.createTextNode(title);
    titleElem.appendChild(titleText);
    infoDiv.appendChild(titleElem);

    var paragraphElem = document.createElement("p");
    var paragraphText = document.createTextNode(description);
    paragraphElem.appendChild(paragraphText);
    infoDiv.appendChild(paragraphElem);

    var dateElem = document.createElement("p");
    dateElem.classList.add("date-info");
    var dateText = document.createTextNode(date);
    dateElem.appendChild(dateText);
    infoDiv.appendChild(dateElem);

    if (links.length > 0) {
        linkElem.appendChild(infoDiv);
        project.appendChild(linkElem);
    } else {
        project.appendChild(infoDiv);
    }

    return project;
}

// create buttons ---------------------------------------------------

function createAllButtons(data) {
    // create all button and has link button
    // find classes used in json data and create filter buttons buttons
    
    var buttonList = [];
    var buttonsDiv = document.getElementById("filter-buttons");
    var listOfClassesCreated = [];

    buttonList.push(createButton("all", true));
    buttonList.push(createButton("haslink", false));
    listOfClassesCreated.push("all");
    listOfClassesCreated.push("haslink");

    data.projects.forEach(projectInfo => {
        // console.log(projectInfo);
        projectInfo.classes.forEach(className => {
            if (className !== "grid-item" && className !== "filter-div" && className !== "show" && filterNames[className] && listOfClassesCreated.indexOf(className) < 0) {
                buttonList.push(createButton(className, false));
                listOfClassesCreated.push(className);
            }
        }); 
    });

    // add event listener
    buttonList.forEach(button => {
        buttonsDiv.appendChild(button);
        button.addEventListener("click", function() {
            // console.log("[BEF] activeFilters: ", activeFilters);
            // var currentlyActive = document.getElementsByClassName("active");
            var allButton = document.getElementById("all-button");
    
            // check if this button was active or not
            if (this.className.indexOf(" active") > -1) {
                this.classList.remove("active");
                // remove this.className from activeFilters
                var filterValue = this.id.split("-")[0];
                activeFilters = activeFilters.filter(function(value, index, arr) {return value != filterValue});
            } else {
                this.classList.add("active");
                // add this.className to activeFilters
                var filterValue = this.id.split("-")[0];
                activeFilters.push(filterValue);
            }
    
            if (this.id == "all-button") {
                // if all-button is clicked, deactivate all other buttons
                for (var j = 0; j < buttonList.length; j++) {
                    buttonList[j].classList.remove("active");
                }
                activeFilters = [];
            } else {
                // if any other button is clicked, deactive the all-button
                allButton.classList.remove("active");
            }
    
            // activate "all-button" if no other button is active
            if (document.getElementsByClassName("active").length == 0) {
                allButton.classList.add("active");
                activeFilters = [];
            }
            // console.log("[AFT] activeFilters: ", activeFilters);
            filterSelection();
        });
    });
}

function createButton(name, active) {
    
    var button = document.createElement("button");
    button.classList.add("btn");
    if (active === true) button.classList.add("active");
    button.setAttribute("id", name + "-button");
    button.setAttribute("onclick", "filterSelection()");
    
    var buttonText = document.createTextNode(filterNames[name]);
    button.appendChild(buttonText);
    
    return button;
}

// filtering of projects ---------------------------------------------------

function filterSelection() {
    var projects = document.getElementsByClassName("filter-div");
    for (var i = 0; i < projects.length; i++) {
        var hasAllFilters = true;
        for (var j = 0; j < activeFilters.length; j++) {
            if (projects[i].className.indexOf(activeFilters[j]) == -1) {
                hasAllFilters = false;
            }
        }
        if (hasAllFilters === true) {
            projects[i].classList.add("show");
        } else {
            projects[i].classList.remove("show");
        }
    }
}
