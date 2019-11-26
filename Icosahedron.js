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

function Icosahedron(radius, subdivisions)
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
        this.normals[i] = Vector3.normalized(this.vertices[i].x, this.vertices[i].y, this.vertices[i].z);
    }
    
    this.radius = radius;
    
    this.middlePointIndexCache = new MyDictionary();
    
    for (let i=0; i<subdivisions; i++)
        this.subdivide();
    
    console.log(" vertices: " + this.vertices.length + "\n" +
                "triangles: " + this.triangles.length/3);
    
    var str = "vertices =\n";
    for (let i=0; i<this.vertices.length; i++)
    {
        str += "(" + this.vertices[i].x + ", " + this.vertices[i].y + ", " + this.vertices[i].z + ")\n";
    }
    console.log(str);
    
    str = "triangles =\n";
    for (let i=0; i<this.triangles.length; i+=3)
    {
        str += this.triangles[i] + ", " + this.triangles[i+1] + ", " + this.triangles[i+2] + ",\n";
    }
    console.log(str);
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

function TruncatedIcosahedron(radius)
{
    this.radius = radius;
    
    var C0 = (Math.sqrt(5.0) - 1.0) / 6.0;
    var C1 = 1.0 / 3.0;
    var C2 = (Math.sqrt(5.0) - 1.0) / 3.0;
    var C3 = 2.0 / 3.0;
    var C4 = Math.sqrt(5.0) / 3.0;
    var C5 = (3.0 + Math.sqrt(5.0)) / 6.0;
    
    this.vertices = [Vector3.mult(Vector3.normalized(  C0,  0.0,  1.0), radius),
                     Vector3.mult(Vector3.normalized(  C0,  0.0, -1.0), radius),
                     Vector3.mult(Vector3.normalized( -C0,  0.0,  1.0), radius),
                     Vector3.mult(Vector3.normalized( -C0,  0.0, -1.0), radius),
                     Vector3.mult(Vector3.normalized( 1.0,   C0,  0.0), radius),
                     Vector3.mult(Vector3.normalized( 1.0,  -C0,  0.0), radius),
                     Vector3.mult(Vector3.normalized(-1.0,   C0,  0.0), radius),
                     Vector3.mult(Vector3.normalized(-1.0,  -C0,  0.0), radius),
                     Vector3.mult(Vector3.normalized( 0.0,  1.0,   C0), radius),
                     Vector3.mult(Vector3.normalized( 0.0,  1.0,  -C0), radius),
                     Vector3.mult(Vector3.normalized( 0.0, -1.0,   C0), radius),
                     Vector3.mult(Vector3.normalized( 0.0, -1.0,  -C0), radius),
                     Vector3.mult(Vector3.normalized(  C2,   C1,   C5), radius),
                     Vector3.mult(Vector3.normalized(  C2,   C1,  -C5), radius),
                     Vector3.mult(Vector3.normalized(  C2,  -C1,   C5), radius),
                     Vector3.mult(Vector3.normalized(  C2,  -C1,  -C5), radius),
                     Vector3.mult(Vector3.normalized( -C2,   C1,   C5), radius),
                     Vector3.mult(Vector3.normalized( -C2,   C1,  -C5), radius),
                     Vector3.mult(Vector3.normalized( -C2,  -C1,   C5), radius),
                     Vector3.mult(Vector3.normalized( -C2,  -C1,  -C5), radius),
                     Vector3.mult(Vector3.normalized(  C5,   C2,   C1), radius),
                     Vector3.mult(Vector3.normalized(  C5,   C2,  -C1), radius),
                     Vector3.mult(Vector3.normalized(  C5,  -C2,   C1), radius),
                     Vector3.mult(Vector3.normalized(  C5,  -C2,  -C1), radius),
                     Vector3.mult(Vector3.normalized( -C5,   C2,   C1), radius),
                     Vector3.mult(Vector3.normalized( -C5,   C2,  -C1), radius),
                     Vector3.mult(Vector3.normalized( -C5,  -C2,   C1), radius),
                     Vector3.mult(Vector3.normalized( -C5,  -C2,  -C1), radius),
                     Vector3.mult(Vector3.normalized(  C1,   C5,   C2), radius),
                     Vector3.mult(Vector3.normalized(  C1,   C5,  -C2), radius),
                     Vector3.mult(Vector3.normalized(  C1,  -C5,   C2), radius),
                     Vector3.mult(Vector3.normalized(  C1,  -C5,  -C2), radius),
                     Vector3.mult(Vector3.normalized( -C1,   C5,   C2), radius),
                     Vector3.mult(Vector3.normalized( -C1,   C5,  -C2), radius),
                     Vector3.mult(Vector3.normalized( -C1,  -C5,   C2), radius),
                     Vector3.mult(Vector3.normalized( -C1,  -C5,  -C2), radius),
                     Vector3.mult(Vector3.normalized(  C0,   C3,   C4), radius),
                     Vector3.mult(Vector3.normalized(  C0,   C3,  -C4), radius),
                     Vector3.mult(Vector3.normalized(  C0,  -C3,   C4), radius),
                     Vector3.mult(Vector3.normalized(  C0,  -C3,  -C4), radius),
                     Vector3.mult(Vector3.normalized( -C0,   C3,   C4), radius),
                     Vector3.mult(Vector3.normalized( -C0,   C3,  -C4), radius),
                     Vector3.mult(Vector3.normalized( -C0,  -C3,   C4), radius),
                     Vector3.mult(Vector3.normalized( -C0,  -C3,  -C4), radius),
                     Vector3.mult(Vector3.normalized(  C4,   C0,   C3), radius),
                     Vector3.mult(Vector3.normalized(  C4,   C0,  -C3), radius),
                     Vector3.mult(Vector3.normalized(  C4,  -C0,   C3), radius),
                     Vector3.mult(Vector3.normalized(  C4,  -C0,  -C3), radius),
                     Vector3.mult(Vector3.normalized( -C4,   C0,   C3), radius),
                     Vector3.mult(Vector3.normalized( -C4,   C0,  -C3), radius),
                     Vector3.mult(Vector3.normalized( -C4,  -C0,   C3), radius),
                     Vector3.mult(Vector3.normalized( -C4,  -C0,  -C3), radius),
                     Vector3.mult(Vector3.normalized(  C3,   C4,   C0), radius),
                     Vector3.mult(Vector3.normalized(  C3,   C4,  -C0), radius),
                     Vector3.mult(Vector3.normalized(  C3,  -C4,   C0), radius),
                     Vector3.mult(Vector3.normalized(  C3,  -C4,  -C0), radius),
                     Vector3.mult(Vector3.normalized( -C3,   C4,   C0), radius),
                     Vector3.mult(Vector3.normalized( -C3,   C4,  -C0), radius),
                     Vector3.mult(Vector3.normalized( -C3,  -C4,   C0), radius),
                     Vector3.mult(Vector3.normalized( -C3,  -C4,  -C0), radius)];
    
    this.faces = [0,  2, 18, 42, 38, 14,
                  1,  3, 17, 41, 37, 13,
                  2,  0, 12, 36, 40, 16,
                  3,  1, 15, 39, 43, 19,
                  4,  5, 23, 47, 45, 21,
                  5,  4, 20, 44, 46, 22,
                  6,  7, 26, 50, 48, 24,
                  7,  6, 25, 49, 51, 27,
                  8,  9, 33, 57, 56, 32,
                  9,  8, 28, 52, 53, 29,
                  10, 11, 31, 55, 54, 30,
                  11, 10, 34, 58, 59, 35,
                  12, 44, 20, 52, 28, 36,
                  13, 37, 29, 53, 21, 45,
                  14, 38, 30, 54, 22, 46,
                  15, 47, 23, 55, 31, 39,
                  16, 40, 32, 56, 24, 48,
                  17, 49, 25, 57, 33, 41,
                  18, 50, 26, 58, 34, 42,
                  19, 43, 35, 59, 27, 51,
                  0, 14, 46, 44, 12,
                  1, 13, 45, 47, 15,
                  2, 16, 48, 50, 18,
                  3, 19, 51, 49, 17,
                  4, 21, 53, 52, 20,
                  5, 22, 54, 55, 23,
                  6, 24, 56, 57, 25,
                  7, 27, 59, 58, 26,
                  8, 32, 40, 36, 28,
                  9, 29, 37, 41, 33,
                  10, 30, 38, 42, 34,
                  11, 35, 43, 39, 31];
    
    this.triangles = [];
    var j = 0;
    for (let i=0; i<20; i++)
    {
        this.triangles[j  ] = this.faces[i*6+0];
        this.triangles[j+1] = this.faces[i*6+1];
        this.triangles[j+2] = this.faces[i*6+5];
        
        this.triangles[j+3] = this.faces[i*6+1];
        this.triangles[j+4] = this.faces[i*6+2];
        this.triangles[j+5] = this.faces[i*6+4];
        
        this.triangles[j+6] = this.faces[i*6+1];
        this.triangles[j+7] = this.faces[i*6+4];
        this.triangles[j+8] = this.faces[i*6+5];
        
        this.triangles[j+9] = this.faces[i*6+2];
        this.triangles[j+10] = this.faces[i*6+3];
        this.triangles[j+11] = this.faces[i*6+4];
        
        j += 12;
    }
    for (let i=0; i<12; i++)
    {
        this.triangles[j  ] = this.faces[i*5+120+0];
        this.triangles[j+1] = this.faces[i*5+120+1];
        this.triangles[j+2] = this.faces[i*5+120+4];
        
        this.triangles[j+3] = this.faces[i*5+120+1];
        this.triangles[j+4] = this.faces[i*5+120+2];
        this.triangles[j+5] = this.faces[i*5+120+3];
        
        this.triangles[j+6] = this.faces[i*5+120+1];
        this.triangles[j+7] = this.faces[i*5+120+3];
        this.triangles[j+8] = this.faces[i*5+120+4];
        
        j += 9;
    }
    
    this.normals = [];
    for (let i=0; i<this.vertices.length; i++)
    {
        this.normals[i] = Vector3.normalized(this.vertices[i]);
    }
    
    console.log(" vertices: " + this.vertices.length + "\n" +
                "triangles: " + this.triangles.length/3);
    
    var str = "vertices =\n";
    for (let i=0; i<this.vertices.length; i++)
    {
        str += "(" + this.vertices[i].x + ", " + this.vertices[i].y + ", " + this.vertices[i].z + ")\n";
    }
    console.log(str);
    
    str = "triangles =\n";
    for (let i=0; i<this.triangles.length; i+=3)
    {
        str += this.triangles[i] + ", " + this.triangles[i+1] + ", " + this.triangles[i+2] + ",\n";
    }
    console.log(str);
}
