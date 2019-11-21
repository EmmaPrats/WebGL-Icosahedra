function Icosahedron (radius, subdivisions)
{
    var t = (1.0 + Math.sqrt(5.0) / 2.0);
    
    this.vertices = [Vector3.mult(new Vector3(-1, t, 0), radius),
                     Vector3.mult(new Vector3(1, t, 0), radius),
                     Vector3.mult(new Vector3(-1, -t, 0), radius),
                     Vector3.mult(new Vector3(1, -t, 0), radius),
                     
                     Vector3.mult(new Vector3(0, -1, t), radius),
                     Vector3.mult(new Vector3(0, 1, t), radius),
                     Vector3.mult(new Vector3(0, -1, -t), radius),
                     Vector3.mult(new Vector3(0, 1, -t), radius),
                     
                     Vector3.mult(new Vector3(t, 0, -1), radius),
                     Vector3.mult(new Vector3(t, 0, 1), radius),
                     Vector3.mult(new Vector3(-t, 0, -1), radius),
                     Vector3.mult(new Vector3(-t, 0, 1), radius)];
    
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
}
