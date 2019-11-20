"use strict";

function Mat4()
{
    
}

Mat4.identity = function()
{
    return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1];
};

Mat4.translation = function(x, y, z)
{
    return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1];
};

Mat4.rotationX = function(radians)
{
    /*return [1, 0, 0, 0,
            0, Math.cos(radians), -Math.sin(radians), 0,
            0, Math.sin(radians), Math.cos(radians), 0,
            0, 0, 0, 1];*/
    return [1, 0, 0, 0,
            0, Math.cos(radians), Math.sin(radians), 0,
            0, -Math.sin(radians), Math.cos(radians), 0,
            0, 0, 0, 1];
};

Mat4.rotationY = function(radians)
{
    return [Math.cos(radians), 0, -Math.sin(radians), 0,
            0, 1, 0, 0,
            Math.sin(radians), 0, Math.cos(radians), 0,
            0, 0, 0, 1];
};

Mat4.rotationZ = function(radians)
{
    return [Math.cos(radians), Math.sin(radians), 0, 0,
            -Math.sin(radians), Math.cos(radians), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1];
};

Mat4.scale = function(x, y, z)
{
    if (!y)
    {
        y = x;
        z = x;
    }
    else if (!z)
        z = 1;
    return [x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1];
};

Mat4.multiply = function(first, second)
{
    var a00 = first[0 * 4 + 0];
    var a01 = first[0 * 4 + 1];
    var a02 = first[0 * 4 + 2];
    var a03 = first[0 * 4 + 3];
    var a10 = first[1 * 4 + 0];
    var a11 = first[1 * 4 + 1];
    var a12 = first[1 * 4 + 2];
    var a13 = first[1 * 4 + 3];
    var a20 = first[2 * 4 + 0];
    var a21 = first[2 * 4 + 1];
    var a22 = first[2 * 4 + 2];
    var a23 = first[2 * 4 + 3];
    var a30 = first[3 * 4 + 0];
    var a31 = first[3 * 4 + 1];
    var a32 = first[3 * 4 + 2];
    var a33 = first[3 * 4 + 3];
    
    var b00 = second[0 * 4 + 0];
    var b01 = second[0 * 4 + 1];
    var b02 = second[0 * 4 + 2];
    var b03 = second[0 * 4 + 3];
    var b10 = second[1 * 4 + 0];
    var b11 = second[1 * 4 + 1];
    var b12 = second[1 * 4 + 2];
    var b13 = second[1 * 4 + 3];
    var b20 = second[2 * 4 + 0];
    var b21 = second[2 * 4 + 1];
    var b22 = second[2 * 4 + 2];
    var b23 = second[2 * 4 + 3];
    var b30 = second[3 * 4 + 0];
    var b31 = second[3 * 4 + 1];
    var b32 = second[3 * 4 + 2];
    var b33 = second[3 * 4 + 3];
    
    var result = [];
    result[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    result[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    result[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    result[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    result[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    result[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    result[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    result[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    result[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    result[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    result[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    result[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    result[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    result[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    result[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    result[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return result;
};

Mat4.projection = function(left, right, bottom, top, near, far)
{
    var result = [];
    result[ 0] = 2 * near / (right - left);
    result[ 1] = 0;
    result[ 2] = 0;
    result[ 3] = 0;
    result[ 4] = 0;
    result[ 5] = 2 * near / (top - bottom);
    result[ 6] = 0;
    result[ 7] = 0;
    result[ 8] = (right + left) / (right - left);
    result[ 9] = (top + bottom) / (top - bottom);
    result[10] = -(far + near) / (far - near);
    result[11] = -1;
    result[12] = 0;
    result[13] = 0;
    result[14] = -2 * far * near / (far - near);
    result[15] = 1;
    return result;
};

Mat4.projectionSymmetric = function(left, right, bottom, top, near, far)
{
    var result = [];
    result[ 0] = near / right;
    result[ 1] = 0;
    result[ 2] = 0;
    result[ 3] = 0;
    result[ 4] = 0;
    result[ 5] = near / right;
    result[ 6] = 0;
    result[ 7] = 0;
    result[ 8] = 0;
    result[ 9] = 0;
    result[10] = -(far + near) / (far - near);
    result[11] = -1;
    result[12] = 0;
    result[13] = 0;
    result[14] = -2 * far * near / (far - near);
    result[15] = 1;
    return result;
};

Mat4.orthographic = function(left, right, bottom, top, near, far)
{
    var result = [];
    result[ 0] = 2 / (right - left);
    result[ 1] = 0;
    result[ 2] = 0;
    result[ 3] = 0;
    result[ 4] = 0;
    result[ 5] = 2 / (top - bottom);
    result[ 6] = 0;
    result[ 7] = 0;
    result[ 8] = 0;
    result[ 9] = 0;
    result[10] = -2 / (near - far);
    result[11] = 0;
    result[12] = -(left + right) / (left - right);
    result[13] = -(bottom + top) / (bottom - top);
    result[14] = -(near + far) / (near - far);
    result[15] = 1;
    return result;
}

function Matrix4(array)
{
    this.matrix = array;
}

Matrix4.prototype.translate = function(x, y, z)
{
    this.multiply(Mat4.translation(x, y, z));
};

Matrix4.prototype.rotateX = function(radians)
{
    this.multiply(Mat4.rotationX(radians));
};

Matrix4.prototype.rotateY = function(radians)
{
    this.multiply(Mat4.rotationY(radians));
};

Matrix4.prototype.rotateZ = function(radians)
{
    this.multiply(Mat4.rotationZ(radians));
};

Matrix4.prototype.scale = function(x, y, z)
{
    this.multiply(Mat4.scale(x, y, z));
};

Matrix4.prototype.multiply = function(otherMatrix)
{
    var a00 = this.matrix[0 * 4 + 0];
    var a01 = this.matrix[0 * 4 + 1];
    var a02 = this.matrix[0 * 4 + 2];
    var a03 = this.matrix[0 * 4 + 3];
    var a10 = this.matrix[1 * 4 + 0];
    var a11 = this.matrix[1 * 4 + 1];
    var a12 = this.matrix[1 * 4 + 2];
    var a13 = this.matrix[1 * 4 + 3];
    var a20 = this.matrix[2 * 4 + 0];
    var a21 = this.matrix[2 * 4 + 1];
    var a22 = this.matrix[2 * 4 + 2];
    var a23 = this.matrix[2 * 4 + 3];
    var a30 = this.matrix[3 * 4 + 0];
    var a31 = this.matrix[3 * 4 + 1];
    var a32 = this.matrix[3 * 4 + 2];
    var a33 = this.matrix[3 * 4 + 3];
    
    var b00 = otherMatrix[0 * 4 + 0];
    var b01 = otherMatrix[0 * 4 + 1];
    var b02 = otherMatrix[0 * 4 + 2];
    var b03 = otherMatrix[0 * 4 + 3];
    var b10 = otherMatrix[1 * 4 + 0];
    var b11 = otherMatrix[1 * 4 + 1];
    var b12 = otherMatrix[1 * 4 + 2];
    var b13 = otherMatrix[1 * 4 + 3];
    var b20 = otherMatrix[2 * 4 + 0];
    var b21 = otherMatrix[2 * 4 + 1];
    var b22 = otherMatrix[2 * 4 + 2];
    var b23 = otherMatrix[2 * 4 + 3];
    var b30 = otherMatrix[3 * 4 + 0];
    var b31 = otherMatrix[3 * 4 + 1];
    var b32 = otherMatrix[3 * 4 + 2];
    var b33 = otherMatrix[3 * 4 + 3];
    
    this.matrix[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    this.matrix[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    this.matrix[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    this.matrix[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    this.matrix[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    this.matrix[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    this.matrix[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    this.matrix[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    this.matrix[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    this.matrix[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    this.matrix[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    this.matrix[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    this.matrix[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    this.matrix[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    this.matrix[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    this.matrix[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
};

Matrix4.prototype.multiplyAfter = function(otherMatrix)
{
    var a00 = otherMatrix[0 * 4 + 0];
    var a01 = otherMatrix[0 * 4 + 1];
    var a02 = otherMatrix[0 * 4 + 2];
    var a03 = otherMatrix[0 * 4 + 3];
    var a10 = otherMatrix[1 * 4 + 0];
    var a11 = otherMatrix[1 * 4 + 1];
    var a12 = otherMatrix[1 * 4 + 2];
    var a13 = otherMatrix[1 * 4 + 3];
    var a20 = otherMatrix[2 * 4 + 0];
    var a21 = otherMatrix[2 * 4 + 1];
    var a22 = otherMatrix[2 * 4 + 2];
    var a23 = otherMatrix[2 * 4 + 3];
    var a30 = otherMatrix[3 * 4 + 0];
    var a31 = otherMatrix[3 * 4 + 1];
    var a32 = otherMatrix[3 * 4 + 2];
    var a33 = otherMatrix[3 * 4 + 3];
    
    var b00 = this.matrix[0 * 4 + 0];
    var b01 = this.matrix[0 * 4 + 1];
    var b02 = this.matrix[0 * 4 + 2];
    var b03 = this.matrix[0 * 4 + 3];
    var b10 = this.matrix[1 * 4 + 0];
    var b11 = this.matrix[1 * 4 + 1];
    var b12 = this.matrix[1 * 4 + 2];
    var b13 = this.matrix[1 * 4 + 3];
    var b20 = this.matrix[2 * 4 + 0];
    var b21 = this.matrix[2 * 4 + 1];
    var b22 = this.matrix[2 * 4 + 2];
    var b23 = this.matrix[2 * 4 + 3];
    var b30 = this.matrix[3 * 4 + 0];
    var b31 = this.matrix[3 * 4 + 1];
    var b32 = this.matrix[3 * 4 + 2];
    var b33 = this.matrix[3 * 4 + 3];
    
    this.matrix[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    this.matrix[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    this.matrix[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    this.matrix[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    this.matrix[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    this.matrix[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    this.matrix[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    this.matrix[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    this.matrix[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    this.matrix[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    this.matrix[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    this.matrix[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    this.matrix[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    this.matrix[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    this.matrix[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    this.matrix[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
};

Matrix4.prototype.copy = function()
{
    var copyOfMatrix = [];
    for (let i=0; i<16; i++)
        copyOfMatrix[i] = this.matrix[i];
    return new Matrix4(copyOfMatrix);
};
