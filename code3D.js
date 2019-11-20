function main()
{
    var canvas = document.getElementById("c");
    
    var gl = canvas.getContext("webgl");
    if (!gl)
    {
        console.log("WebGL context not found.");
        return;
    }
    
    var program = createProgramFromScripts(gl, "3d-vertex-shader", "3d-fragment-shader");
    
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
    
    var matrixModelUniformLocation = gl.getUniformLocation(program, "u_model");
    var matrixViewUniformLocation = gl.getUniformLocation(program, "u_view");
    var matrixProjectionUniformLocation = gl.getUniformLocation(program, "u_projection");
    
    var pyramidGeometry = generatePyramidGeometry();
    var pyramidNormals = calculateNormals(pyramidGeometry);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidGeometry), gl.STATIC_DRAW);
    
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidNormals), gl.STATIC_DRAW);
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(generatePyramidColors()), gl.STATIC_DRAW);
    
    gl.clearColor(0, 0, 0, 0);
    
    var rotationSpeed = 0.01;
    var rotationX = 0.5;
    var rotationY = 0;
    
    ////////////COLOR
    var objectColorUniformLocation = gl.getUniformLocation(program, "u_objectColor");
    var lightColorUniformLocation = gl.getUniformLocation(program, "u_lightColor");
    var lightPositionUniformLocation = gl.getUniformLocation(program, "u_lightPosition");
    
    var objectColor = [1.0, 0.5, 0.31, 1.0];
    var lightColor = [1.0, 1.0, 1.0];
    var lightPosition = [1.2, 1.0, 2.0];
    
    animationLoop();
    
    function animationLoop()
    {
        rotationY += rotationSpeed;
        
        resizeToMatchCSS(gl);
        
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // Turn on culling. By default backfacing triangles will be culled.
        gl.enable(gl.CULL_FACE);
        
        // Enable the depth buffer
        gl.enable(gl.DEPTH_TEST);
        
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        
        //Normals
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(normalAttributeLocation, size, type, normalize, stride, offset);
        
        // Compute the matrices
        var modelMatrix = new Matrix4(Mat4.identity());
        modelMatrix.rotateX(rotationX);
        modelMatrix.rotateY(rotationY);
        modelMatrix.scale(1.1);
        modelMatrix.translate(0, 0.2, 0);
        
        // Set the matrix.
        gl.uniformMatrix4fv(matrixModelUniformLocation, false, new Float32Array(modelMatrix.matrix));
        
        var viewMatrix = new Matrix4(Mat4.identity());
        viewMatrix.translate(0, 0, -0.25);
        gl.uniformMatrix4fv(matrixViewUniformLocation, false, new Float32Array(viewMatrix.matrix));
        
        var nearPlaneHalfWidth = 2 * 0.1 * Math.tan(22.5);
        var projectionMatrix = new Matrix4(Mat4.projection(-nearPlaneHalfWidth, nearPlaneHalfWidth,
                                                           -nearPlaneHalfWidth, nearPlaneHalfWidth, 0.1, 100));
        gl.uniformMatrix4fv(matrixProjectionUniformLocation, false, new Float32Array(projectionMatrix.matrix));
        
        gl.uniform4fv(objectColorUniformLocation, new Float32Array(objectColor));
        gl.uniform3fv(lightColorUniformLocation, new Float32Array(lightColor));
        gl.uniform3fv(lightPositionUniformLocation, new Float32Array(lightPosition));
        
        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6 * 3; //triangles * vertices_per_triangle
        gl.drawArrays(primitiveType, offset, count);
        
        requestAnimationFrame(animationLoop);
    }
}

main();

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
