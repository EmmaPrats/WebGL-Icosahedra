"use strict";

function Vector3(x = 0, y = 0, z = 0)
{
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector3.sub = function(vector1, vector2)
{
    return new Vector3(vector1.x - vector2.x,
                       vector1.y - vector2.y,
                       vector1.z - vector2.z);
};

Vector3.cross = function(vector1, vector2)
{
    return new Vector3(
        vector1.y * vector2.z - vector1.z * vector2.y,
        vector1.z * vector2.x - vector1.x * vector2.z,
        vector1.x * vector2.y - vector1.y * vector2.x);
};

Vector3.crossArray = function(vector1, vector2)
{
    return [vector1[1] * vector2[2] - vector1[2] * vector2[1],
            vector1[2] * vector2[0] - vector1[0] * vector2[2],
            vector1[0] * vector2[1] - vector1[1] * vector2[0]];
};

Vector3.prototype.magnitude = function()
{
    return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector3.prototype.normalize = function()
{
    var mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
};
