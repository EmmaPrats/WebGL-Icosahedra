function MyDictionary()
{
    this.associativeArray = [];
    this.length = 0;
}

MyDictionary.prototype.add = function(key, value)
{
    if (this.associativeArray[key] == undefined)
    {
        this.associativeArray[key] = value;
        this.length++;
    }
}

function Icosahedron (radius, subdivisions)
{
    var t = (1.0 + Math.sqrt(5.0) / 2.0);
    
    this.vertices = [Vector3.mult(Vector3.normalized(-1, t, 0), radius),
                     Vector3.mult(Vector3.normalized(1, t, 0), radius),
                     Vector3.mult(Vector3.normalized(-1, -t, 0), radius),
                     Vector3.mult(Vector3.normalized(1, -t, 0), radius),
                     
                     Vector3.mult(Vector3.normalized(0, -1, t), radius),
                     Vector3.mult(Vector3.normalized(0, 1, t), radius),
                     Vector3.mult(Vector3.normalized(0, -1, -t), radius),
                     Vector3.mult(Vector3.normalized(0, 1, -t), radius),
                     
                     Vector3.mult(Vector3.normalized(t, 0, -1), radius),
                     Vector3.mult(Vector3.normalized(t, 0, 1), radius),
                     Vector3.mult(Vector3.normalized(-t, 0, -1), radius),
                     Vector3.mult(Vector3.normalized(-t, 0, 1), radius)];
    
    this.triangles = [0, 11, 5,
                      0, 5, 1,
                      0, 1, 7,
                      0, 7, 10,
                      0, 10, 11,
                      1, 5, 9,
                      5, 11, 4,
                      11, 10, 2,
                      10, 7, 6,
                      7, 1, 8,
                      3, 9, 4,
                      3, 4, 2,
                      3, 2, 6,
                      3, 6, 8,
                      3, 8, 9,
                      4, 9, 5,
                      2, 4, 11,
                      6, 2, 10,
                      8, 6, 7,
                      9, 8, 1];
    
    this.normals = [];
    for (let i=0; i<this.vertices.length; i++)
    {
        this.normals[i] = Vector3.normalized(this.vertices[i]);
    }
    
    this.radius = radius;
    
    this.middlePointIndexCache = new MyDictionary();
    
    for (let i=0; i<subdivisions; i++)
        this.subdivide();
}

Icosahedron.prototype.subdivide = function()
{
    var newTriangles = [];
    
    var j = 0;
    for (let i=0; i<this.triangles.length; i+=3)
    {
        var a = this.getMiddleVertex(this.triangles[i], this.triangles[i+1]);
        var b = this.getMiddleVertex(this.triangles[i+1], this.triangles[i+2]);
        var c = this.getMiddleVertex(this.triangles[i+2], this.triangles[i]);
        
        newTriangles[j] = this.triangles[i];
        newTriangles[j+1] = a;
        newTriangles[j+2] = c;
        
        newTriangles[j+3] = this.triangles[i+1];
        newTriangles[j+4] = b;
        newTriangles[j+5] = a;
        
        newTriangles[j+6] = this.triangles[i+2];
        newTriangles[j+7] = c;
        newTriangles[j+8] = b;
        
        newTriangles[j+9] = a;
        newTriangles[j+10] = b;
        newTriangles[j+11] = c;
        
        j += 12;
    }
    
    this.triangles = newTriangles;
}

Icosahedron.prototype.getMiddleVertex = function (vertexIndex1, vertexIndex2)
{
    var firstIsSmaller = vertexIndex1 < vertexIndex2;
    var smallerIndex = firstIsSmaller ? vertexIndex1 : vertexIndex2;
    var greaterIndex = firstIsSmaller ? vertexIndex2 : vertexIndex1;
    var key = pad(smallerIndex, 16) + pad(greaterIndex, 16);
    
    //Check if it already exists
    var middleVertexIndex = this.middlePointIndexCache.associativeArray[key];
    if (middleVertexIndex !== undefined && middleVertexIndex !== null && middleVertexIndex >= 0)
        return middleVertexIndex;
    
    //If it doesn't, create it
    var newVertex = Vector3.add(this.vertices[vertexIndex1], this.vertices[vertexIndex2]);
    newVertex.div(2);
    newVertex.normalize();
    newVertex.mult(this.radius);
    
    var middleVertexIndex = this.vertices.length;
    this.vertices[middleVertexIndex] = newVertex;
    
    //And store it in the dictionary
    this.middlePointIndexCache.add(key, middleVertexIndex);
    
    return middleVertexIndex;
}

function pad(number, width, paddingSymbol)
{
    paddingSymbol = paddingSymbol || '0';
    number = number + '';
    
    if (number.length >= width)
        return number;
    else
        return new Array(width - number.length + 1).join(paddingSymbol) + number;
}
