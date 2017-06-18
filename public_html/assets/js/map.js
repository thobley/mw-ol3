
var map;
$(function () {
    
    var proj = ol.proj.get("EPSG:3857");
    var resosOb = new MapResolutions("EPSG:3857",21);
    var resosWM = resosOb.createResolutionArray();
    var apiMatrixArr = new MatrixIDs("EPSG:3857_WEB_MERCATOR",21);
    var api = new ol.layer.Tile({
        opacity: 0.3,
        source: new ol.source.WMTS({
            url: "//api.maps.vic.gov.au/geowebcacheWM/service/wmts",
            layer: "WEB_MERCATOR",
            matrixSet: apiMatrixArr.getName(),
            format: "image/png",
            projection: proj,
            style: "_null",
            tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(proj.getExtent()),
                matrixIds: apiMatrixArr.matrixArray,
                resolutions: resosWM,
                tileSize: 512
            })
        })
    });
    var melways = new MelwayTileLayer("mel_39_20kmaps",resosWM[17],resosWM[13]);
    var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        
        url: function (extent) {
            return 'http://services.land.vic.gov.au/catalogue/publicproxy/guest/dv_geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=mped39&' +
                    'outputFormat=application/json&srsname=EPSG:3857&' +
                    'bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox
    });
    var mw_grd_20 = new ol.layer.Vector({
        source: vectorSource,
        minResolution: resosWM[17],
        maxResolution: resosWM[13],
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.0)',
                width: 0
            })
        })
    })
    var melways_inner = new MelwayTileLayer("mel_39_inner",resosWM[20],resosWM[17]);
    var melways_key = new MelwayTileLayer("mel_39_keymaps",resosWM[13],resosWM[10]);
    var melways_tour = new MelwaysTileLyer("mel_39_tours",resosWM[10],resosWM[8])
    var foiSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        
        url: function (extent) {
            return 'http://services.land.vic.gov.au/catalogue/publicproxy/guest/dv_geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=VMFEAT_FOI_POLYGON&' +
                    'outputFormat=application/json&srsname=EPSG:3857&' +
                    'bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox
    });
    var foi = new ol.layer.Vector({
        source: foiSource,
        minResolution: resosWM[17],
        maxResolution: resosWM[13],
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                width: 1
            })
        })
    });
    map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        layers: [
            api, melways, melways_inner, melways_key, melways_tour, mw_grd_20
        ],
        view: new ol.View({
            center: [16139257.516644, -4553659.0277665],
            zoom: 15
        })
    });
    var hoverInteraction = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: [mw_grd_20],  //Setting layers to be hovered,
        multi: false,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.0)',
                width: 0
            })
        })
        //features: 
    });
    map.addInteraction(hoverInteraction);
    
    hoverInteraction.on('select', function (evt) {
        if(evt.selected[0]){
            $(".mw-ref").show();
            $(".mw-ref-val").remove();
            $(".mw-ref-map").append("<p class='mw-ref-val val-map'>&nbsp "+evt.selected[0].values_.MAP_NO+"</p>");
            $(".mw-ref-grid").html("<p class='mw-ref-val'>"+evt.selected[0].values_.MAP_SQUARE+"</p>");
        } else{
            console.log(evt);
            $(".mw-ref").hide();
        }
        //console.log(evt.selected[0].values_.MAP_NO,evt.selected[0].values_.MAP_SQUARE);
        
        
        
        //console.log(evt.selected[0]);
//        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
//            //you can add a condition on layer to restrict the listener
//            return feature;
//        });
//        if (feature) {
//            //here you can add you code to display the coordinates or whatever you want to do
//            console.log(feature);
//        }
    });
})
