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

    for (line of lines) {
        let sLine = line.replace('\r', '').split(" ");
        for (let token in sLine) {
            if (sLine[token] != "") {
                if (token == 0) {
                    if (sLine[token] in mesh.vertices) {
                        type = 1;
                        mesh.edges[onEdge] = sLine[token];
                    } else {
                        type = 0;
                        currentV = sLine[token];
                        mesh.vertices[currentV] = {};
                        rVerts[currentV] = {};
                    }
                } else {
                    switch (type) {
                        case 0:
                            mesh.vertices[currentV][String.fromCharCode(parseInt(token) + 119)] = parseFloat(sLine[token]);
                            break;
                        case 1:
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
    let intervalID = window.setInterval(displayRotating, 0.0333);
}

function displayRotating() {
    // Your code here
    for (let vert in mesh.vertices) {
        rVerts[vert]["x"] = (mesh.vertices[vert]["x"] * Math.cos(radians(rotation))) - (mesh.vertices[vert]["z"] * Math.sin(radians(rotation)));
        rVerts[vert]["y"] = mesh.vertices[vert]["y"]
        rVerts[vert]["z"] = (mesh.vertices[vert]["x"] * Math.sin(radians(rotation))) + (mesh.vertices[vert]["z"] * Math.cos(radians(rotation)));
        console.log(rVerts[vert]);
    }
    rotation += rotationSpeed;
    if (rotation >= 360) {
        rotation = 0;
    }
    drawMesh();
}

function drawMesh() {
    for (let vert in rVerts) {
        rVerts[vert]["x"] = centerX + ((rVerts[vert]["x"] / (rVerts[vert]["z"] + zOffset)) * size)
        rVerts[vert]["y"] = centerY + ((rVerts[vert]["y"] / (rVerts[vert]["z"] + zOffset)) * size)
    }

    for (let edge in mesh.edges) {
        let edgeVerts = mesh.edges[edge].split(" ");

        let xmlEdge = document.getElementById("e" + edge);
        if (xmlEdge == null) {
            let parent = document.getElementById("yrt3dSvg");
            xmlEdge = document.createElementNS('http://www.w3.org/2000/svg','line');
            xmlEdge.setAttribute("style", "stroke:rgb(255,255,255);stroke-width:1");
            xmlEdge.setAttribute("id", "e" + edge)
            parent.appendChild(xmlEdge);
        }
        xmlEdge.setAttribute("x1", rVerts[edgeVerts[0]]["x"]);
        xmlEdge.setAttribute("y1", rVerts[edgeVerts[0]]["y"]);
        xmlEdge.setAttribute("x2", rVerts[edgeVerts[1]]["x"]);
        xmlEdge.setAttribute("y2", rVerts[edgeVerts[1]]["y"]);
    }
}

function radians(degrees)
{
  return degrees * (Math.PI/180);
}