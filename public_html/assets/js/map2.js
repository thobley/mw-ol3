var MapResolutions = (function () {
    function MapResolutions(epsgCode, zoomLevels) {
        this.wmArray = [
            156543.03392804097,
            78271.51696402048,
            39135.75848201024,
            19567.87924100510000,
            9783.93962050256000,
            4891.96981025128000,
            2445.98490512564000,
            1222.99245256282000,
            611.49622628141000,
            305.74811314070500,
            152.87405657035200,
            76.43702828517620,
            38.21851414258810,
            19.10925707129400,
            9.55462853564703,
            4.77731426782351,
            2.388657133911758,
            1.194328566955879,
            0.5971642834779395,
            0.2985821416974068,
            0.1492910708487034
        ];
        this.espgCode = epsgCode;
    }
    MapResolutions.prototype.createResolutionArray = function (zoomLevels) {
        if (this.espgCode === 'EPSG:3857' || this.espgCode === 'WM') {
            return this.createWebMercArray(zoomLevels);
        }
        else {
            throw new TypeError("EPSG Code does not match any in this function: " + this.espgCode);
        }
    };
    MapResolutions.prototype.createWebMercArray = function (zoomLevels) {
        return this.wmArray.slice(0, zoomLevels);
    };
    return MapResolutions;
}());
var MatrixIDs = (function () {
    function MatrixIDs(matrixName, levels) {
        this.matrixName = matrixName;
        this.levels = levels;
    }
    MatrixIDs.prototype.createArray = function () {
        var matrixids = new Array(this.levels);
        for (var i = 0; i <= this.levels - 1; ++i) {
            matrixids[i] = this.matrixName + ":" + i;
        }
    };
    MatrixIDs.prototype.getMatrixName = function () {
        return this.matrixName;
    };
    ;
    return MatrixIDs;
}());
var MelwaysTileLayer = (function () {
    function MelwaysTileLayer(layer, maxRes, minRes) {
        this.base = "http://182.160.154.221/dev/";
        this.baselast = "/{z}/{x}/{-y}.PNG";
        this.url = this.base + layer + this.baselast;
        this.maxRes = maxRes;
        this.minRes = minRes;
        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: this.url
            }),
            minResolution: this.minRes,
            maxResolution: this.maxRes
        });
    }
    return MelwaysTileLayer;
}());
