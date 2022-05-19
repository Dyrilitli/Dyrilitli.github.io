
// variables ---------------------------------------------------

var url = "https://dyrilitli.github.io/data.json";

//  ---------------------------------------------------

fetch(url)
.then(res => res.json())
.then(json => {
    createProjectsFromJSON(json);
})

// create projects ---------------------------------------------------

function createProjectsFromJSON(data) {
    // console.log(data);

    var projectDiv = document.getElementById("projects-grid");

    var id = 1;
    data.projects.forEach(projectInfo => {
        // console.log(projectInfo);
        var title = projectInfo.title;
        var description = projectInfo.description;
        var date = projectInfo.date;
        var imagepath = projectInfo.imagepath;
        var links = projectInfo.links;
        var classes = projectInfo.classes;

        projectDiv.appendChild(createProjectDiv(title, description, date, imagepath, links, classes, id));
        id += 1;
    });
}

function createProjectDiv(title, description, date, imagepath, links, classes, imageId) {

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
    img.id = imageId;
    img.setAttribute("onclick", "showBigImage(this)");
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

// resize image ---------------------------------------------------

function showBigImage(elem) {

    console.log("resize image:", elem.id);

    var docString = `<!DOCTYPE html>
    <html>
    
      <head>
        <title>Kristjón's portfolio</title>
      </head>
      
      <body>
        <!--Page contains full image-->
        <img id="one-image" width="" height="" src="${elem.getAttribute("src")}"/>
    
        <!-- <p>This page is a work in progress.</p> -->
      </body>
    
      <footer>
      </footer>
    
    </html>
    `

    var newWindow = window.open("image.html");
    newWindow.document.write(docString);
}