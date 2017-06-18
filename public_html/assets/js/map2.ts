declare var ol: any;
class MapResolutions {
    private resArray: number[];
    private espgCode: string;
    private wmArray: number[] = [
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
    ]
    constructor(epsgCode, zoomLevels) {
        this.espgCode = epsgCode;
    }
    public createResolutionArray(zoomLevels) {
        if (this.espgCode === 'EPSG:3857' || this.espgCode === 'WM') {
            return this.createWebMercArray(zoomLevels);
        } else {
            throw new TypeError("EPSG Code does not match any in this function: " + this.espgCode);
        }
    }
    private createWebMercArray(zoomLevels) {
        return this.wmArray.slice(0, zoomLevels)
    }
}

class MatrixIDs {
    private matrixName: string;
    private levels: number;
    public matrixArray: number[];
    constructor(matrixName, levels) {
        this.matrixName = matrixName;
        this.levels = levels;
    }
    createArray(): void {
        var matrixids = new Array(this.levels);
        for (var i = 0; i <= this.levels - 1; ++i) {
            matrixids[i] = this.matrixName + ":" + i;
        }
    }
    getMatrixName(): string {
        return this.matrixName;
    };
}
class MelwaysTileLayer {

    private base: string = "http://182.160.154.221/dev/";
    private baselast: string = "/{z}/{x}/{-y}.PNG";
    private url: string;
    private maxRes: number;
    private minRes: number;
    constructor(layer: string, maxRes: number, minRes: number) {
        this.url = this.base + layer + this.baselast;
        this.maxRes = maxRes;
        this.minRes = minRes;
        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: this.url,
            }),
            minResolution: this.minRes,
            maxResolution: this.maxRes

        });
    }
}