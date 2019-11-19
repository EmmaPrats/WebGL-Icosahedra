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
    var positions = [0, 0, 0,
                     0.5, 0, 0,
                     0, 0.5, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var colors = [255, 0, 0,
                  0, 255, 0,
                  0, 0, 255];
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    
    gl.clearColor(0, 0, 0, 0);
    
    function radToDeg(r) {
        return r * 180 / Math.PI;
    }
    
    function degToRad(d) {
        return d * Math.PI / 180;
    }
    
    /*var translation = [0, 0, -360];
    var rotation = [degToRad(190), degToRad(40), degToRad(320)];
    var scale = [1, 1, 1];
    
    var rotationSpeed = 1.2;*/
    var fieldOfViewRadians = degToRad(60);
    var rotation = [degToRad(190), degToRad(40), degToRad(320)];
    var rotationSpeed = 1.2;
    
    // code above this line is initialization code.
    // code below this line is rendering code.
    
    animationLoop();
    
    function animationLoop()
    {
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
        var matrixObject = new Matrix4(Mat4.orthographic(-width/2, width/2,
                                                         -1, 1,
                                                         0.5, -0.5));
        
        // Set the matrix.
        gl.uniformMatrix4fv(matrixUniformLocation, false, new Float32Array(matrixObject.matrix));
        
        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
        
        requestAnimationFrame(animationLoop);
    }
}

main();
