function WebGLProgram(shape, hardEdges, subdivisions)
{
    this.shape = shape;
    this.hardEdges = hardEdges;
    this.subdivisions = subdivisions;
    
    this.rotationSpeed = 0.01;
    this.rotationX = 0.5;
    this.rotationY = 0;
    
    var canvas = document.getElementById("c");
    this.gl = canvas.getContext("webgl");
    if (!this.gl)
    {
        console.log("WebGL context not found.");
        return;
    }
    
    this.program = createProgramFromScripts(this.gl, "3d-vertex-shader", "3d-fragment-shader");
    
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.normalAttributeLocation = this.gl.getAttribLocation(this.program, "a_normal");
    
    this.matrixModelUniformLocation = this.gl.getUniformLocation(this.program, "u_model");
    this.matrixViewUniformLocation = this.gl.getUniformLocation(this.program, "u_view");
    this.matrixProjectionUniformLocation = this.gl.getUniformLocation(this.program, "u_projection");
    
    this.generateGeometry();
    
    this.gl.clearColor(0, 0, 0, 0);
    
    this.objectColorUniformLocation = this.gl.getUniformLocation(this.program, "u_objectColor");
    this.lightColorUniformLocation = this.gl.getUniformLocation(this.program, "u_lightColor");
    this.lightPositionUniformLocation = this.gl.getUniformLocation(this.program, "u_lightPosition");
    
    this.objectColor = [0.6784, 0, 0.2157, 1.0];
    this.lightColor = [1.0, 1.0, 1.0];
    this.lightPosition = [1.2, 1.0, 2.0];
}

WebGLProgram.prototype.generateGeometry = function()
{
    this.mesh = new Mesh(this.shape, 0.45, this.subdivisions);
    
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW);
    
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    if (this.hardEdges)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.hardEdgeNormals), this.gl.STATIC_DRAW);
    else
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), this.gl.STATIC_DRAW);
};

WebGLProgram.prototype.animationLoop = function()
{
    this.rotationY += this.rotationSpeed;
    console.log(this.gl);
    resizeToMatchCSS(this.gl);
    
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    
    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Turn on culling. By default backfacing triangles will be culled.
    this.gl.enable(this.gl.CULL_FACE);
    
    // Enable the depth buffer
    this.gl.enable(this.gl.DEPTH_TEST);
    
    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(this.program);
    
    // Turn on the attribute
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    
    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);
    
    //Normals
    this.gl.enableVertexAttribArray(this.normalAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    var size = 3;          // 3 components per iteration
    var type = this.gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(this.normalAttributeLocation, size, type, normalize, stride, offset);
    
    // Model Matrix
    var modelMatrix = new Matrix4(Mat4.identity());
    modelMatrix.translate(0, 0, -1);
    modelMatrix.rotateX(this.rotationX);
    modelMatrix.rotateY(this.rotationY);
    modelMatrix.scale(1.3);
    this.gl.uniformMatrix4fv(this.matrixModelUniformLocation, false, new Float32Array(modelMatrix.matrix));
    
    // View Matrix
    var viewMatrix = new Matrix4(Mat4.identity());
    viewMatrix.translate(0, 0, -0.05);
    this.gl.uniformMatrix4fv(this.matrixViewUniformLocation, false, new Float32Array(viewMatrix.matrix));
    
    // Projection Matrix
    var nearPlaneHalfWidth = 2 * 0.1 * Math.tan(22.18);
    var projectionMatrix = new Matrix4(Mat4.projection(-nearPlaneHalfWidth, nearPlaneHalfWidth,
                                                       -nearPlaneHalfWidth, nearPlaneHalfWidth,
                                                       0.1, 100));
    this.gl.uniformMatrix4fv(this.matrixProjectionUniformLocation, false, new Float32Array(projectionMatrix.matrix));
    
    // Color
    this.gl.uniform4fv(this.objectColorUniformLocation, new Float32Array(this.objectColor));
    this.gl.uniform3fv(this.lightColorUniformLocation, new Float32Array(this.lightColor));
    this.gl.uniform3fv(this.lightPositionUniformLocation, new Float32Array(this.lightPosition));
    
    // draw
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = this.mesh.vertices.length / 3; //number of vertices
    this.gl.drawArrays(primitiveType, offset, count);
};

WebGLProgram.prototype.setGeometry = function(shape, hardEdges, subdivisions)
{
    this.shape = shape;
    this.hardEdges = hardEdges;
    this.subdivisions = subdivisions;
    
    this.mesh = new Mesh(this.shape, 0.45, this.subdivisions);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), this.gl.STATIC_DRAW);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    if (this.hardEdges)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.hardEdgeNormals), this.gl.STATIC_DRAW);
    else
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.mesh.normals), this.gl.STATIC_DRAW);
};

WebGLProgram.prototype.getVerticesAmount = function()
{
    if (this.hardEdges)
        return this.mesh.vertices.length / 3;
    else
        return this.mesh.geometry.vertices.length;
};

WebGLProgram.prototype.getTrianglesAmount = function()
{
    return this.mesh.vertices.length / 3 / 3;
};

function generatePyramidGeometry()
{
    return vertices = [
                       //BASE
                       -0.5, -0.5, 0.5,  //0
                       -0.5, -0.5, -0.5, //1
                       0.5, -0.5, 0.5,   //2
                       
                       0.5, -0.5, 0.5,   //2
                       -0.5, -0.5, -0.5, //1
                       0.5, -0.5, -0.5,  //3
                       
                       //FRONT
                       0.0, 0.5, 0.0,    //4 tip
                       -0.5, -0.5, 0.5,  //0
                       0.5, -0.5, 0.5,   //2
                       
                       //RIGHT
                       0.0, 0.5, 0.0,    //4 tip
                       0.5, -0.5, 0.5,   //2
                       0.5, -0.5, -0.5,  //3
                       
                       //BACK
                       0.0, 0.5, 0.0,    //4 tip
                       0.5, -0.5, -0.5,  //3
                       -0.5, -0.5, -0.5, //1
                       
                       //LEFT
                       0.0, 0.5, 0.0,    //4 tip
                       -0.5, -0.5, -0.5, //1
                       -0.5, -0.5, 0.5  //0
    ];
}

function calculateNormals(vertices)
{
    var normals = [];
    for (var i=0; i<vertices.length; i+=9)
    {
        var v0 = new Vector3(vertices[i  ], vertices[i+1], vertices[i+2]);
        var v1 = new Vector3(vertices[i+3], vertices[i+4], vertices[i+5]);
        var v2 = new Vector3(vertices[i+6], vertices[i+7], vertices[i+8]);
        
        var a = Vector3.sub(v2, v1);
        var b = Vector3.sub(v0, v1);
        
        var normal = Vector3.cross(a, b);
        normal.normalize();
        
        normals[i  ] = normal.x;
        normals[i+1] = normal.y;
        normals[i+2] = normal.z;
        normals[i+3] = normal.x;
        normals[i+4] = normal.y;
        normals[i+5] = normal.z;
        normals[i+6] = normal.x;
        normals[i+7] = normal.y;
        normals[i+8] = normal.z;
    }
    return normals;
}

function generatePyramidColors()
{
    return colors = [
                     //BASE
                     255,   0,   0,    //0
                       0, 255,   0,    //1
                       0,   0, 255,    //2
                     
                       0,   0, 255,    //2
                       0, 255,   0,    //1
                     255,   0, 255,    //3
                     
                     //FRONT
                     255, 255,   0,    //4 tip
                     255,   0,   0,    //0
                       0,   0, 255,    //2
                     
                     //RIGHT
                     255, 255,   0,    //4 tip
                       0,   0, 255,    //2
                     255,   0, 255,    //3
                     
                     //BACK
                     255, 255,   0,    //4 tip
                     255,   0, 255,    //3
                       0, 255,   0,    //1
                     
                     //LEFT
                     255, 255,   0,    //4 tip
                       0, 255,   0,    //1
                     255,   0,   0    //0
    ];
}

function Mesh(shape, radius, subdivisions)
{
    if (shape == "icosahedron")
        this.geometry = new Icosahedron(radius, subdivisions);
    else
        this.geometry = new TruncatedIcosahedron(radius);
    
    var verts = [];
    for (let i=0; i<this.geometry.triangles.length; i++)
        verts[i] = this.geometry.vertices[this.geometry.triangles[i]];
    
    var norms = [];
    for (let i=0; i<verts.length; i++)
        norms[i] = verts[i].normalized();
    
    var j = 0;
    this.vertices = [];
    for (let i=0; i<verts.length*3; i+=3)
    {
        this.vertices[i  ] = verts[j].x;
        this.vertices[i+1] = verts[j].y;
        this.vertices[i+2] = verts[j].z;
        j++
    }
    
    j = 0;
    this.normals = [];
    for (let i=0; i<verts.length*3; i+=3)
    {
        this.normals[i  ] = norms[j].x;
        this.normals[i+1] = norms[j].y;
        this.normals[i+2] = norms[j].z;
        j++
    }
    
    var hardEdgeNorms = [];
    for (let i=0; i<verts.length; i+=3)
    {
        var normal = Vector3.cross(Vector3.sub(verts[i+2], verts[i+1]),
                                   Vector3.sub(verts[i], verts[i+1]));
        hardEdgeNorms[i  ] = normal.normalized();
        hardEdgeNorms[i+1] = normal.normalized();
        hardEdgeNorms[i+2] = normal.normalized();
    }
    
    j = 0;
    this.hardEdgeNormals = [];
    for (let i=0; i<verts.length*3; i+=3)
    {
        this.hardEdgeNormals[i  ] = hardEdgeNorms[j].x;
        this.hardEdgeNormals[i+1] = hardEdgeNorms[j].y;
        this.hardEdgeNormals[i+2] = hardEdgeNorms[j].z;
        j++
    }
}
