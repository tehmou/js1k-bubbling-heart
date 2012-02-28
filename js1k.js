    var SKEW_PIXEL_TO_GRID_3D = 1/3;
    var SKEW_GRID_TO_PIXEL_3D = -1/6;

    var GRADIENTS_3D = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

    var randomKernel = [];
    for(var i = 0; i < 512; i++) {
        randomKernel[i] = ~~(Math.random()*256);
    }

    c.style.cssText = "position: absolute; left: 0; top: 0";
    var w = c.width = window.innerWidth,
        h = c.height = window.innerHeight,
        img = a.createImageData(w, h),
        heartImg,
        time = 0;

    a.font = "400px Arial";
    a.fillText("♥", w/2-150, h/2+150);
    heartImg = a.getImageData(0, 0, w, h);

    function draw () {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                var idx = (x + y * w) * 4;
                var hd = heartImg.data[idx+3];
                if (hd) {

                    var xin=x*.01,yin=y*.01,zin=time*.02;

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

                    var triangleFactorA, triangleFactorB;
                    if (pixDeltaFromOriginX>=pixDeltaFromOriginY) {
                        if (pixDeltaFromOriginY>=pixDeltaFromOriginZ) {
                            triangleFactorA = [1,0,0];
                            triangleFactorB = [1,1,0];
                        } else if (pixDeltaFromOriginX>=pixDeltaFromOriginZ) {
                            triangleFactorA = [1,0,0];
                            triangleFactorB = [1,0,1];
                        } else {
                            triangleFactorA = [0,0,1];
                            triangleFactorB = [1,0,1];
                        }
                    } else {
                        if (pixDeltaFromOriginY<pixDeltaFromOriginZ) {
                            triangleFactorA = [0,0,1];
                            triangleFactorB = [0,1,1];
                        } else if (pixDeltaFromOriginX<pixDeltaFromOriginZ) {
                            triangleFactorA = [0,1,0];
                            triangleFactorB = [0,1,1];
                        } else {
                            triangleFactorA = [0,1,0];
                            triangleFactorB = [1,1,0];
                        }
                    }

                    var ii = tileOriginX % 255;
                    var jj = tileOriginY % 255;
                    var kk = tileOriginZ % 255;

                    function calculateEffect3D (deltaX, deltaY, deltaZ, grad) {
                        var magnitude = 0.6 - deltaX*deltaX - deltaY*deltaY - deltaZ*deltaZ;
                        return magnitude < 0 ? 0 : Math.pow(magnitude, 4) * (deltaX*grad[0] + deltaY*grad[1] + deltaZ*grad[2]);
                    }

                    var totalMagnitude = 0;

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX,
                        pixDeltaFromOriginY,
                        pixDeltaFromOriginZ
                    , GRADIENTS_3D[randomKernel[ii+randomKernel[jj+randomKernel[kk]]] % 12]);

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX - triangleFactorA[0] - SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginY - triangleFactorA[1] - SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginZ - triangleFactorA[2] - SKEW_GRID_TO_PIXEL_3D
                    , GRADIENTS_3D[randomKernel[ii+triangleFactorA[0]+randomKernel[jj+triangleFactorA[1]+randomKernel[kk+triangleFactorA[2]]]] % 12]);

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX - triangleFactorB[0] - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginY - triangleFactorB[1] - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginZ - triangleFactorB[2] - 2.0*SKEW_GRID_TO_PIXEL_3D
                    , GRADIENTS_3D[randomKernel[ii+triangleFactorB[0]+randomKernel[jj+triangleFactorB[1]+randomKernel[kk+triangleFactorB[2]]]] % 12]);

                    totalMagnitude += calculateEffect3D(
                        pixDeltaFromOriginX - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginY - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOriginZ - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D
                    , GRADIENTS_3D[randomKernel[ii+1+randomKernel[jj+1+randomKernel[kk+1]]] % 12]);

                    var color = hd*(32.0*totalMagnitude+1)*.7;
                }
                img.data[idx] = color;
                img.data[idx+1] = img.data[idx+2] = 0;
                img.data[idx+3] = 255;
            }
        }
        a.putImageData(img, 0, 0);
        time++;
        setTimeout(draw, 0);
    }

    draw();