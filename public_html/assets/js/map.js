
var map;
$(function () {

    var proj = ol.proj.get("EPSG:3857");
    var resosOb = new MapResolutions("EPSG:3857", 21);
    var resosWM = resosOb.createResolutionArray();
    var apiMatrixArr = new MatrixIDs("EPSG:3857_WEB_MERCATOR", 21);
    var api = new ol.layer.Tile({
        opacity: 0.3,
        source: new ol.source.WMTS({
            url: "//api.maps.vic.gov.au/geowebcacheWM/service/wmts",
            layer: "WEB_MERCATOR",
            matrixSet: apiMatrixArr.getMatrixName(),
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
//    var melways = new ol.layer.Tile({
//        source: new ol.source.XYZ({
//            url: "http://182.160.154.221/dev/mel_39_20kmaps/{z}/{x}/{-y}.PNG",
//        }),
//        minResolution: resosWM[17],
//        maxResolution: resosWM[13]
//
//    });
    var melways = new MelwayTileLayer("mel_39_20kmaps", resosWM[13], resosWM[17]);
    console.log(melways.getMaxResolution(), melways.getMinResolution());
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

//    var melways_inner = new ol.layer.Tile({
//        source: new ol.source.XYZ({
//            url: "http://182.160.154.221/dev/mel_39_inner/{z}/{x}/{-y}.PNG",
//        }),
//        minResolution: resosWM[20],
//        maxResolution: resosWM[17]
//
//    });
    var melways_inner = new MelwayTileLayer("mel_39_inner", resosWM[17], resosWM[20] / 2);
    console.log(melways_inner);
    console.log(melways_inner.getMaxResolution(), melways_inner.getMinResolution());
    var melways_key = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: "http://182.160.154.221/dev/mel_39_keymaps/{z}/{x}/{-y}.PNG",
        }),
        minResolution: resosWM[13],
        maxResolution: resosWM[10]
    });
    var melways_tour = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: "http://182.160.154.221/dev/mel_39_tours/{z}/{x}/{-y}.PNG",
        }),
        minResolution: resosWM[10],
        maxResolution: resosWM[8]
    });
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
            zoom: 15,
            minZoom: 7,
            maxZoom: 20
        })
    });
    var hoverInteraction = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: [mw_grd_20],
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
    slider = new ol.control.ZoomSlider({

    });
    map.addControl(slider);
    var move = $(".ol-zoomslider-thumb").height();
    var ins = $("<div class='zoom-inner' style='width: 100%; height: 100%; margin-top: -" + move + "px'></div>").appendTo(".ol-zoomslider")
    var perc = 100 / 13;
    var stepHeight = $(".zoom-inner").innerHeight()/13;
    for (var i = 0; i < 13; i++) {

        ins.append("<div style='width: 100%; height: " + stepHeight + "px;' class='zoom-steps'></div>");
    }
    var all = $('.zoom-steps');
//    for (var i = 0; i < 14; i++) {
//        
//    }
    $(all[0]).css("background-color", "#2e62fa").css("border-radius",'2px 2px 0 0');
    $(all[1]).css("background-color", "#2e62fa");
    $(all[2]).css("background-color", "#2e62fa");
    $(all[3]).css("background-color", "#4fb7ff");
    $(all[4]).css("background-color", "#4fb7ff");
    $(all[5]).css("background-color", "#4fb7ff");
    $(all[6]).css("background-color", "#4fb7ff");
    $(all[7]).css("background-color", "#fa9724");
    $(all[8]).css("background-color", "#fa9724");
    $(all[9]).css("background-color", "#fa9724");
    $(all[10]).css("background-color", "#5b9d45");
    $(all[11]).css("background-color", "#5b9d45");
    $(all[12]).css("background-color", "#5b9d45");
    $(all[12]).css("background-color", "#5b9d45").css("border-radius",'2px 2px 0 0');
    //$(all[14]).css("background-color","#5b9d45");
    hoverInteraction.on('select', function (evt) {
        if (evt.selected[0]) {
            $(".mw-ref").show();
            $(".mw-ref-val").remove();
            $(".mw-ref-map").append("<p class='mw-ref-val val-map'>&nbsp " + evt.selected[0].values_.MAP_NO + "</p>");
            $(".mw-ref-grid").html("<p class='mw-ref-val'>" + evt.selected[0].values_.MAP_SQUARE + "</p>");
        } else {
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
});
