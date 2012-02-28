    var SKEW_PIXEL_TO_GRID_3D = 1/3;
    var SKEW_GRID_TO_PIXEL_3D = -1/6;

    var GRADIENTS_3D = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];

    var randomKernel = [];
    for(var i = 0; i < 512; i++) {
        randomKernel[i] = ~~(Math.random()*256);
    }

    function calculateEffect3D (delta, grad) {
        var magnitude = 0.6 - delta[0]*delta[0] - delta[1]*delta[1] - delta[2]*delta[2];
        return magnitude < 0 ? 0 : Math.pow(magnitude, 4) * (delta[0]*grad[0] + delta[1]*grad[1] + delta[2]*grad[2]);
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
                    var pixOrigin = [tileOriginX+s, tileOriginY+s, tileOriginZ+s];


                    var pixDeltaFromOrigin = [xin-pixOrigin[0], yin-pixOrigin[1], zin-pixOrigin[2]];

                    var triangleFactor;
                    if (pixDeltaFromOrigin[0]>=pixDeltaFromOrigin[1]) {
                        if (pixDeltaFromOrigin[1]>=pixDeltaFromOrigin[2]) {
                            triangleFactor = [[1,0,0],[1,1,0]];
                        } else if (pixDeltaFromOrigin[0]>=pixDeltaFromOrigin[2]) {
                            triangleFactor = [[1,0,0],[1,0,1]];
                        } else {
                            triangleFactor = [[0,0,1],[1,0,1]];
                        }
                    } else {
                        if (pixDeltaFromOrigin[1]<pixDeltaFromOrigin[2]) {
                            triangleFactor = [[0,0,1],[0,1,1]];
                        } else if (pixDeltaFromOrigin[0]<pixDeltaFromOrigin[2]) {
                            triangleFactor = [[0,1,0],[0,1,1]];
                        } else {
                            triangleFactor = [[0,1,0],[1,1,0]];
                        }
                    }

                    var x1 = [
                        pixDeltaFromOrigin[0] - triangleFactor[0][0] - SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOrigin[1] - triangleFactor[0][1] - SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOrigin[2] - triangleFactor[0][2] - SKEW_GRID_TO_PIXEL_3D
                    ];

                    var x2 = [
                        pixDeltaFromOrigin[0] - triangleFactor[1][0] - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOrigin[1] - triangleFactor[1][1] - 2.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOrigin[2] - triangleFactor[1][2] - 2.0*SKEW_GRID_TO_PIXEL_3D
                    ];

                    var x3 = [
                        pixDeltaFromOrigin[0] - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOrigin[1] - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D,
                        pixDeltaFromOrigin[2] - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D
                    ];

                    var ii = tileOriginX % 255;
                    var jj = tileOriginY % 255;
                    var kk = tileOriginZ % 255;
                    var cornerGradients = [
                        GRADIENTS_3D[randomKernel[ii+randomKernel[jj+randomKernel[kk]]] % 12],
                        GRADIENTS_3D[randomKernel[ii+triangleFactor[0][0]+randomKernel[jj+triangleFactor[0][1]+randomKernel[kk+triangleFactor[0][2]]]] % 12],
                        GRADIENTS_3D[randomKernel[ii+triangleFactor[1][0]+randomKernel[jj+triangleFactor[1][1]+randomKernel[kk+triangleFactor[1][2]]]] % 12],
                        GRADIENTS_3D[randomKernel[ii+1+randomKernel[jj+1+randomKernel[kk+1]]] % 12]
                    ];

                    var totalMagnitude = 0;
                    totalMagnitude += calculateEffect3D(pixDeltaFromOrigin, cornerGradients[0]);
                    totalMagnitude += calculateEffect3D(x1, cornerGradients[1]);
                    totalMagnitude += calculateEffect3D(x2, cornerGradients[2]);
                    totalMagnitude += calculateEffect3D(x3, cornerGradients[3]);

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