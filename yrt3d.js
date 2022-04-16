class Mesh {
    vertices = {}
    edges = {}
}

let mesh = new Mesh;
let rVerts = {};
let rotation = 270;
let zOffset = -4;
let size = 300;

let centerX = 250
let centerY = 250

let rotationSpeed = 0.2;

// Read the mesh data
function loadMesh(path) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let fileContents = rawFile.responseText;
                parseMesh(fileContents);
            }
        }
    }
    rawFile.send(null);
}

function parseMesh(fileContents) {
    let lines = fileContents.split("\n");
    let type = 0; //0: vertex, 1: edge
    let onEdge = 0;
    let currentV;

    // Loop through each line of the file
    for (line of lines) {
        let sLine = line.replace('\r', '').split(" ");
        for (let token in sLine) {
            // Loop through each token in each line
            if (sLine[token] != "") {
                if (token == 0) {
                    // Check if it's a vertex or an edge.
                    if (sLine[token] in mesh.vertices) {
                        // Add edge to mesh
                        type = 1;
                        mesh.edges[onEdge] = sLine[token];
                    } else {
                        // Add new vertex to mesh
                        type = 0;
                        currentV = sLine[token];
                        mesh.vertices[currentV] = {};
                        rVerts[currentV] = {};
                    }
                } else {
                    switch (type) {
                        case 0:
                            // Add x, y, or z coordinate to vertex.
                            mesh.vertices[currentV][String.fromCharCode(parseInt(token) + 119)] = parseFloat(sLine[token]);
                            break;
                        case 1:
                            // Add second vertex to edge.
                            mesh.edges[onEdge] += " " + sLine[token];
                            onEdge++;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}

function displayMesh() {
    // Make the mesh rotate every 0.0333 seconds.
    let intervalID = window.setInterval(displayRotating, 0.0333);
}

function displayRotating() {
    // Apply rotation to mesh.
    for (let vert in mesh.vertices) {
        // Loop through each vertex and apply the rotation.
        rVerts[vert]["x"] = (mesh.vertices[vert]["x"] * Math.cos(radians(rotation))) - (mesh.vertices[vert]["z"] * Math.sin(radians(rotation)));
        rVerts[vert]["y"] = mesh.vertices[vert]["y"]
        rVerts[vert]["z"] = (mesh.vertices[vert]["x"] * Math.sin(radians(rotation))) + (mesh.vertices[vert]["z"] * Math.cos(radians(rotation)));
    }
    // Set the rotation for next time.
    rotation += rotationSpeed;
    if (rotation >= 360) {
        rotation = 0;
    }

    // Draw the mesh
    drawMesh();
}

function drawMesh() {
    // Draw the mesh
    for (let vert in rVerts) {
        // Project 3d coordinates into 2d
        rVerts[vert]["x"] = centerX + ((rVerts[vert]["x"] / (rVerts[vert]["z"] + zOffset)) * size)
        rVerts[vert]["y"] = centerY + ((rVerts[vert]["y"] / (rVerts[vert]["z"] + zOffset)) * size)
    }

    // Loop through each edge in the mesh
    for (let edge in mesh.edges) {
        let edgeVerts = mesh.edges[edge].split(" ");

        // Try to get the edge in the HTML
        let xmlEdge = document.getElementById("e" + edge);
        if (xmlEdge == null) {
            // If edge hasn't been drawn yet, make a new line.
            let parent = document.getElementById("yrt3dSvg");
            xmlEdge = document.createElementNS('http://www.w3.org/2000/svg','line');
            xmlEdge.setAttribute("style", "stroke:rgb(255,255,255);stroke-width:1");
            xmlEdge.setAttribute("id", "e" + edge)
            parent.appendChild(xmlEdge);
        }
        // Set the coordinates for the line.
        xmlEdge.setAttribute("x1", rVerts[edgeVerts[0]]["x"]);
        xmlEdge.setAttribute("y1", rVerts[edgeVerts[0]]["y"]);
        xmlEdge.setAttribute("x2", rVerts[edgeVerts[1]]["x"]);
        xmlEdge.setAttribute("y2", rVerts[edgeVerts[1]]["y"]);
    }
}

function radians(degrees)
{
    // Convert degrees to radians
    return degrees * (Math.PI/180);
}