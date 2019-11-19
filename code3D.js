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
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    
    var matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
    
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatePyramidGeometry()), gl.STATIC_DRAW);
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(generatePyramidColors()), gl.STATIC_DRAW);
    
    gl.clearColor(0, 0, 0, 0);
    
    var rotationSpeed = 0.01;
    var rotationX = 0.5;
    var rotationY = 0;
    
    animationLoop();
    
    function animationLoop()
    {
        //rotationX += rotationSpeed;
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
        
        // Turn on the color attribute
        gl.enableVertexAttribArray(colorAttributeLocation);
        
        // Bind the color buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        
        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        var size = 3;                 // 3 components per iteration
        var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
        var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
        var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;               // start at the beginning of the buffer
        gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
        
        // Compute the matrices
        var width = gl.canvas.width * 2 / gl.canvas.height;
        var matrixObject = new Matrix4(Mat4.orthographic(-1, 1,
                                                         -1, 1,
                                                         -1, 1));
        matrixObject.rotateY(rotationY);
        matrixObject.rotateX(-rotationX);
        matrixObject.scale(1.4);
        matrixObject.translate(0, 0.2, 0);
        
        // Set the matrix.
        gl.uniformMatrix4fv(matrixUniformLocation, false, new Float32Array(matrixObject.matrix));
        
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
