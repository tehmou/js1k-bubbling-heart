    var SKEW_PIXEL_TO_GRID_3D = 1/3;
    var SKEW_GRID_TO_PIXEL_3D = -1/6;

    var GRADIENTS_3D = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1]];

    var randomKernel = [];
    for(var i = 0; i < 96; i++) {
        randomKernel[i] = ~~(Math.random()*48);
    }

    var imageDataString = "ImageData";

    c.style.cssText = "position:absolute;left:0;top:0";
    var w = c.width = window.innerWidth,
        h = c.height = window.innerHeight,
        img = a["create"+imageDataString](w, h),
        imgData = img.data,
        heartImg,
        time = 0,
        color;

    a.font = "400px A";
    a.fillText("♥", w/2-150, h/2+150);
    heartImg = a["get"+imageDataString](0, 0, w, h);


    setInterval(function () {
        for (var i = 0; i < w*h; i++) {


                var idx = i * 4;
                var hd = heartImg.data[idx+3];
                if (hd) {

                    var xin=(i%w)*.01,
                        yin=~~(i/w)*.01,
                        zin=time*.02;

                    var s = (xin+yin+zin) * SKEW_PIXEL_TO_GRID_3D;
                    var tileOriginX = ~~(xin+s);
                    var tileOriginY = ~~(yin+s);
                    var tileOriginZ = ~~(zin+s);

                    s = (tileOriginX+tileOriginY+tileOriginZ)*SKEW_GRID_TO_PIXEL_3D;
                    var pixOriginX = tileOriginX+s;
                    var pixOriginY = tileOriginY+s;
                    var pixOriginZ = tileOriginZ+s;

                    var pixDeltaFromOriginX = xin-pixOriginX;
                    var pixDeltaFromOriginY = yin-pixOriginY;
                    var pixDeltaFromOriginZ = zin-pixOriginZ;

                    var triangleFactorAX,
                        triangleFactorAY,
                        triangleFactorAZ,
                        triangleFactorBX,
                        triangleFactorBY,
                        triangleFactorBZ;

                    if (pixDeltaFromOriginX>=pixDeltaFromOriginY) {
                        if (pixDeltaFromOriginY>=pixDeltaFromOriginZ) {
                            triangleFactorAX = 1;
                            triangleFactorAY = 0;
                            triangleFactorAZ = 0;
                            triangleFactorBX = 1;
                            triangleFactorBY = 1;
                            triangleFactorBZ = 0;
                        } else if (pixDeltaFromOriginX>=pixDeltaFromOriginZ) {
                            triangleFactorAX = 1;
                            triangleFactorAY = 0;
                            triangleFactorAZ = 0;
                            triangleFactorBX = 1;
                            triangleFactorBY = 0;
                            triangleFactorBZ = 1;
                        } else {
                            triangleFactorAX = 0;
                            triangleFactorAY = 0;
                            triangleFactorAZ = 1;
                            triangleFactorBX = 1;
                            triangleFactorBY = 0;
                            triangleFactorBZ = 1;
                        }
                    } else {
                        if (pixDeltaFromOriginY<pixDeltaFromOriginZ) {
                            triangleFactorAX = 0;
                            triangleFactorAY = 0;
                            triangleFactorAZ = 1;
                            triangleFactorBX = 0;
                            triangleFactorBY = 1;
                            triangleFactorBZ = 1;
                        } else if (pixDeltaFromOriginX<pixDeltaFromOriginZ) {
                            triangleFactorAX = 0;
                            triangleFactorAY = 1;
                            triangleFactorAZ = 0;
                            triangleFactorBX = 0;
                            triangleFactorBY = 1;
                            triangleFactorBZ = 1;
                        } else {
                            triangleFactorAX = 0;
                            triangleFactorAY = 1;
                            triangleFactorAZ = 0;
                            triangleFactorBX = 1;
                            triangleFactorBY = 1;
                            triangleFactorBZ = 0;
                        }
                    }

                    var ii = tileOriginX % 48;
                    var jj = tileOriginY % 48;
                    var kk = tileOriginZ % 48;

                    function calculateEffect3D (deltaX, deltaY, deltaZ, grad) {
                        var magnitude = 0.6 - deltaX*deltaX - deltaY*deltaY - deltaZ*deltaZ;
                        return magnitude < 0 ? 0 : Math.pow(magnitude, 4) * (deltaX*grad[0] + deltaY*grad[1] + deltaZ*grad[2]);
                    }

                    var totalMagnitude = 0;

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX,
                        pixDeltaFromOriginY,
                        pixDeltaFromOriginZ,
                        GRADIENTS_3D[randomKernel[ii+randomKernel[jj+randomKernel[kk]]] % 6]);

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX - triangleFactorAX - SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginY - triangleFactorAY - SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginZ - triangleFactorAZ - SKEW_GRID_TO_PIXEL_3D,
                        GRADIENTS_3D[randomKernel[ii+triangleFactorAX+randomKernel[jj+triangleFactorAY+randomKernel[kk+triangleFactorAZ]]] % 6]);

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX - triangleFactorBX - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginY - triangleFactorBY - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginZ - triangleFactorBZ - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        GRADIENTS_3D[randomKernel[ii+triangleFactorBX+randomKernel[jj+triangleFactorBY+randomKernel[kk+triangleFactorBZ]]] % 6]);

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginY - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginZ - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        GRADIENTS_3D[randomKernel[ii+1+randomKernel[jj+1+randomKernel[kk+1]]] % 6]);

                    color = hd*(32.0*totalMagnitude+1)*.7;
                }
                imgData[idx] = color;
                imgData[idx+3] = 255;

                
            }
        a["put"+imageDataString](img, 0, 0);
        time++;
    }, 0);
