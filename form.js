function formMain()
{
    var shapeIcosahedron = document.getElementById("shape-icosahedron");
    var shapeTruncated = document.getElementById("shape-truncated");
    var subdivisions = document.getElementById("subdivisions");
    var subdivisionsLabel = document.getElementById("subdivisions-label");
    var subdivisionsTitle = document.getElementById("subdivisions-title");
    var edgesHard = document.getElementById("edges-hard");
    var edgesSmooth = document.getElementById("edges-smooth");
    var vertices = document.getElementById("vertices");
    var triangles = document.getElementById("triangles");
    var downloadButton = document.getElementById("download-button");
    
    shapeIcosahedron.addEventListener("change", shapeChange);
    shapeTruncated.addEventListener("change", shapeChange);
    function shapeChange(event)
    {
        if (event.target == shapeIcosahedron)
        {
            subdivisions.parentElement.style.display = "block";
            subdivisionsTitle.style.display = "block";
        }
        else if (event.target == shapeTruncated)
        {
            subdivisions.parentElement.style.display = "none";
            subdivisionsTitle.style.display = "none";
        }
        
        updateGeometry();
        updateVerticesTriangles();
    }
    
    subdivisions.addEventListener("change", subdivisionsChange);
    function subdivisionsChange(event)
    {
        updateGeometry();
        subdivisionsLabel.innerHTML = event.target.value;
        updateVerticesTriangles();
    }
    
    edgesHard.addEventListener("change", edgesChange);
    edgesSmooth.addEventListener("change", edgesChange);
    function edgesChange(event)
    {
        if (event.target == edgesHard)
            console.log("hard");
        else if (event.target == edgesSmooth)
            console.log("smooth");
        
        updateGeometry();
        updateVerticesTriangles();
    }
    
    function updateVerticesTriangles()
    {
        vertices.innerHTML = webGLProgram.getVerticesAmount();
        triangles.innerHTML = webGLProgram.getTrianglesAmount();
    }
    
    downloadButton.addEventListener("click", downloadAsObj);
    function downloadAsObj()
    {
        console.log("downloading");
        main.externalFunction();
    }
    
    var shape = shapeIcosahedron.checked ? "icosahedron" : "truncated";
    var hardEdges = edgesHard.checked;
    var subdivs = subdivisions.value;
    var webGLProgram = new WebGLProgram(shape, hardEdges, subdivs);
    
    function updateGeometry()
    {
        shape = shapeIcosahedron.checked ? "icosahedron" : "truncated";
        hardEdges = edgesHard.checked;
        subdivs = subdivisions.value;
        webGLProgram.setGeometry(shape, hardEdges, subdivs);
    }
    
    (function animLoop()
    {
        webGLProgram.animationLoop();
        window.requestAnimationFrame(animLoop);
    })();
}

formMain();
