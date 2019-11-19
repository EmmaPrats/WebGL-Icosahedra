function createShader(gl, type, source)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
    {
        return shader;
    }
    throw("Could not compile: " + gl.getShaderInfoLog(shader));
}

function createProgram(gl, vertexShader, fragmentShader)
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success)
    {
        return program;
    }
    throw("Program failed to link: " + gl.getProgramInfoLog(program));
}

function createShaderFromScript(gl, scriptId, opt_shaderType)
{
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript)
        throw("Error: Couldn't find shader script by id: " + scriptId);
    
    var shaderSource = shaderScript.text;
    
    if (!opt_shaderType)
        if (shaderScript.type == "x-shader/x-vertex")
            opt_shaderType = gl.VERTEX_SHADER;
        else if (shaderScript.type == "x-shader/x-fragment")
            opt_shaderType = gl.FRAGMENT_SHADER;
        else
            throw("Error: Shader type not set.");
    
    return createShader(gl, opt_shaderType, shaderSource);
}

function createProgramFromScripts(gl, vertexShaderScriptId, fragmentShaderScriptId)
{
    var vertexShader = createShaderFromScript(gl, vertexShaderScriptId, gl.VERTEX_SHADER);
    var fragmentShader = createShaderFromScript(gl, fragmentShaderScriptId, gl.FRAGMENT_SHADER);
    return createProgram(gl, vertexShader, fragmentShader);
}

function resizeToMatchCSS(gl)
{
    var realToCSSPixels = window.devicePixelRatio;
    
    // Lookup the size the browser is displaying the canvas in CSS pixels and
    // compute a size needed to make our drawingbuffer match it in device pixels.
    var displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
    var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);
    
    // Check if the canvas is not the same size.
    if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight)
    {
        // Make the canvas the same size
        gl.canvas.width  = displayWidth;
        gl.canvas.height = displayHeight;
    }
}
