    var SKEW_PIXEL_TO_GRID_3D = 1/3;
    var SKEW_GRID_TO_PIXEL_3D = -1/6;

    var GRADIENTS_3D = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    var NUM_GRADIENTS_3D = GRADIENTS_3D.length;

    var randomKernel = [];
    for(var i = 0; i < 512; i++) {
        randomKernel[i] = ~~(Math.random()*256);
    }

    function calculateEffect3D (delta, grad) {
        var magnitude = 0.6 - delta[0]*delta[0] - delta[1]*delta[1] - delta[2]*delta[2];
        if (magnitude < 0) {
            return 0;
        } else {
            return Math.pow(magnitude, 4) * (delta[0]*grad[0] + delta[1]*grad[1] + delta[2]*grad[2]);
        }
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
                    var posOnTileGrid = [xin+s, yin+s, zin+s];

                    var tileOrigin = [~~posOnTileGrid[0], ~~posOnTileGrid[1], ~~posOnTileGrid[2]];


                    s = (tileOrigin[0]+tileOrigin[1]+tileOrigin[2])*SKEW_GRID_TO_PIXEL_3D;
                    var pixOrigin = [tileOrigin[0]+s, tileOrigin[1]+s, tileOrigin[2]+s];


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

                    var x1 = pixDeltaFromOrigin[0] - triangleFactor[0][0] - SKEW_GRID_TO_PIXEL_3D;
                    var y1 = pixDeltaFromOrigin[1] - triangleFactor[0][1] - SKEW_GRID_TO_PIXEL_3D;
                    var z1 = pixDeltaFromOrigin[2] - triangleFactor[0][2] - SKEW_GRID_TO_PIXEL_3D;

                    var x2 = pixDeltaFromOrigin[0] - triangleFactor[1][0] - 2.0*SKEW_GRID_TO_PIXEL_3D;
                    var y2 = pixDeltaFromOrigin[1] - triangleFactor[1][1] - 2.0*SKEW_GRID_TO_PIXEL_3D;
                    var z2 = pixDeltaFromOrigin[2] - triangleFactor[1][2] - 2.0*SKEW_GRID_TO_PIXEL_3D;

                    var x3 = pixDeltaFromOrigin[0] - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D;
                    var y3 = pixDeltaFromOrigin[1] - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D;
                    var z3 = pixDeltaFromOrigin[2] - 1.0 - 3.0*SKEW_GRID_TO_PIXEL_3D;




                    var ii = tileOrigin[0] % 255;
                    var jj = tileOrigin[1] % 255;
                    var kk = tileOrigin[2] % 255;
                    var index0 = randomKernel[ii+randomKernel[jj+randomKernel[kk]]] % 12;
                    var index1 = randomKernel[ii+triangleFactor[0][0]+randomKernel[jj+triangleFactor[0][1]+randomKernel[kk+triangleFactor[0][2]]]] % 12;
                    var index2 = randomKernel[ii+triangleFactor[1][0]+randomKernel[jj+triangleFactor[1][1]+randomKernel[kk+triangleFactor[1][2]]]] % 12;
                    var index3 = randomKernel[ii+1+randomKernel[jj+1+randomKernel[kk+1]]] % 12;
                    var cornerGradients = [
                        GRADIENTS_3D[index0 % NUM_GRADIENTS_3D],
                        GRADIENTS_3D[index1 % NUM_GRADIENTS_3D],
                        GRADIENTS_3D[index2 % NUM_GRADIENTS_3D],
                        GRADIENTS_3D[index3 % NUM_GRADIENTS_3D]
                    ];

                    var totalMagnitude = 0;
                    totalMagnitude += calculateEffect3D(pixDeltaFromOrigin, cornerGradients[0]);
                    totalMagnitude += calculateEffect3D([x1, y1, z1], cornerGradients[1]);
                    totalMagnitude += calculateEffect3D([x2, y2, z2], cornerGradients[2]);
                    totalMagnitude += calculateEffect3D([x3, y3, z3], cornerGradients[3]);


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