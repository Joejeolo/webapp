// Three basemaps: Lightmap(CartoDB), Streetmap(OSM), and Imagery(Esri)
// url basemap from leaflet provider https://leaflet-extras.github.io/leaflet-providers/preview/ 
	var lightmap = new ol.layer.Tile(
				{	title: "Light map",
					baseLayer: true,
					source: new ol.source.XYZ({
					url:'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', //https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
					attributions: [ "&copy; <a href='https://carto.com/'>CartoDB</a> Contributors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ],
					})
				});
	var streetmap = new ol.layer.Tile(
				{	title: "Steet map",
					baseLayer: true,
					visible: false,
				//	source: new ol.source.OSM()
					source: new ol.source.XYZ({
					url:'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					attributions: [ "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> Contributors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ],
					})
				});
	var imagery = new ol.layer.Tile(
				{	title: "Imagery",
					baseLayer: true,
					source: new ol.source.XYZ({
					url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
					attributions: [ "&copy; <a href='https://www.esri.com/en-us/home'>ESRI</a> Contributors&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ],
					}),
					visible: false
				});

// reuse code from ol-ext (https://viglino.github.io/ol-ext/) 
// Create map and Add view, controls, and layers 
	var map = new ol.Map({
    target: 'map',
    view: new ol.View({
      zoom: 12,
	  minZoom: 10,
	  maxZoom: 17,
      center: [12901385, -3764044]
    }),
	controls: ol.control.defaults().extend
			([	new ol.control.LayerPopup(), 
				new ol.control.ScaleLine({
						units: 'metric'})]),
    interactions: ol.interaction.defaults({ altShiftDragRotate:false, pinchRotate:false }),
    layers: [lightmap, streetmap, imagery]
  });
		
// get vector from FWS with geoJson format  
	var vectorSource = new ol.source.Vector({
			//	url: 'http://128.199.85.151:8080/geoserver/Takaew/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Takaew%3Aplaces_herbs_spices&outputFormat=application%2Fjson',
				url: 'http://128.199.85.151:8080/~Takaew/webapp/herbs.geojson',
				url: 'https://raw.githubusercontent.com/Joejeolo/webapp/main/herbs.geojson',
				format: new ol.format.GeoJSON()
				});
		
// style with function based on the 'type' attribute (Supermarket, Local supermarket, Community sharing)
// https://stackoverflow.com/questions/32010779/styling-features-based-on-attribute-values from Ivana
	var style = function(feature, resolution){
    var supermarket = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [147, 54, 23, 0.8]
            }),
            stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
        })
    });
    var local = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [113, 157, 121, 0.8]
            }),
            stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
        })
    });
	var community = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [202, 173, 18, 0.8]
            }),
            stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
        })
    });

    if ( feature.get('type') == 'Supermarket') {
        return [supermarket];
    } else if ( feature.get('type') == 'Local supermarket') {
        return [local];
    } else if ( feature.get('type') == 'Community sharing') {
        return [community];
    } 
	}
	
	map.addLayer(new ol.layer.Vector({
    name: 'Herbs & Spices',
    source: vectorSource,
    style: style,
	}));
		
	 // Overlay
	var help = new ol.control.Overlay ({ 
		closeBox : true, 
		className: "slide-left help", 
		content: $("#help").get(0)
	});
	map.addControl(help);

	// A toggle control to show/hide the menu
	var t = new ol.control.Toggle(
			{	html: '<i class="fa fa-question-circle-o" ></i>',
				className: "help",
				title: "Help",
				onToggle: function() { help.toggle(); }
			});
	map.addControl(t);
	
// Select  interaction
  var select = new ol.interaction.Select({
    hitTolerance: 5,
    multi: true,
    condition: ol.events.condition.singleClick
  });
  map.addInteraction(select);
  
// Popup 
  var popup = new ol.Overlay.PopupFeature({
    popupClass: 'default anim',
    select: select,
    canFix: true,
    template: {
        title: 
         // only display the name
          function(f) {
            return f.get('name');
          },
        attributes: // [ 'type', 'address', 'suburb', 'descriptio']
        {
          'type': { title: 'Type' },
          'address': { title: 'Address' },
          'suburb': { title: 'Suburb' },
          'descriptio': { title: 'Description' },
		  'Chilli': { title: 'Chilli' },
		  'Chinese_ch': { title: 'Chinese chives' },
		  'Coriander': { title: 'Coriander' },
		  'Fingerroot': { title: 'Fingerroot' },
		  'Galangal': {title : 'Galangal' },
		  'Kaffir_lim': { title: 'Kaffirlime leave' },
		  'Lemongrass': { title: 'Lemongrass' },
		  'Pandan': { title: 'Pandan' },
		  'Pennywort': { title: 'Pennywort' },
		  'Turmeric': { title: 'Turmeric' },
		  'Vietnamese': { title: 'Vietnamese' },
		  'Fennel_see': { title: 'Fennel seed' }
        }
    }
  });
  map.addOverlay (popup);
  
  
 // Define a new legend
  var legend = new ol.legend.Legend({ 
    title: 'Legend',
    margin: 5
  });
  var legendCtrl = new ol.control.Legend({
    legend: legend,
    collapsed: false
  });
  map.addControl(legendCtrl);
  //legend.on('select', function(e){ console.log(e) });

    legend.addItem({ 
      title: 'Supermarket', 
      typeGeom: 'Point',
      style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [147, 54, 23, 0.8]
            }),
            stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
        })
    })
    });
	
	legend.addItem({ 
      title: 'Local supermarket', 
      typeGeom: 'Point',
      style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [113, 157, 121, 0.8]
            }),
            stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
        })
    })
    });
	
	legend.addItem({ 
      title: 'Community sharing', 
      typeGeom: 'Point',
      style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [202, 173, 18, 0.8]
            }),
            stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
        })
    })
    });
	
 // Select control
  var selectCtrl = new ol.control.SelectMulti({
    //target: $('.options').get(0),
    controls: [
      new ol.control.SelectFulltext({
        label: 'Name:',
        property: 'name',
      }),
      new ol.control.SelectPopup({
        defaultLabel: 'all',
        label: 'Suburb:',
        property: 'suburb'
      }),
      new ol.control.SelectCheck({
        label: 'Type:',
        property: 'type',
        // type: 'radio',
        values: {
          'Supermarket': 'Supermarket',
          'Local supermarket': 'Local supermarket',
          'Community Sharing': 'Community Sharing'
        },
        sort: true 
      }),
      new ol.control.SelectCondition({ //http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SelectCondition.html 
        label: 'Chilli (พริก)',
        condition: { attr: 'Chilli', op:'contain', val:'Y' } // op:'=' doesn't work, but use 'contain' work! 
      }),
	  new ol.control.SelectCondition({ 
        label: 'Chinese chives (กุ้ยช่าย)',
        condition: { attr: 'Chinese_ch', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Coriander (ผักชี)',
        condition: { attr: 'Coriander', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Fingerroot (กระชาย)',
        condition: { attr: 'Fingerroot', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Galangal (ข่า)',
        condition: { attr: 'Galangal', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Kaffir lime leaves (ใบมะกรูด)',
        condition: { attr: 'Kaffir_lim', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Lemongrass (ตะไคร้)',
        condition: { attr: 'Lemongrass', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Pandan (ใบเตย)',
        condition: { attr: 'Pandan', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Pennywort (ใบบัวบก)',
        condition: { attr: 'Pennywort', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Turmeric (ขมิ้น)',
        condition: { attr: 'Turmeric', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Vietnamese coriander (ผักไผ่)',
        condition: { attr: 'Vietnamese', op:'contain', val:'Y' }
      }),
	  new ol.control.SelectCondition({
        label: 'Fennel seed (เทียนข้าวเปลือก)',
        condition: { attr: 'Fennel_see', op:'contain', val:'Y' }
      }),
    ]
  });
  // Add control
  map.addControl (selectCtrl);

// Do something on select
  selectCtrl.on('select', function(e) {
    select.getFeatures().clear();
    if ($('#select').prop('checked')) {
      // Select features
      e.features.forEach(function(f) {
        select.getFeatures().push(f);
      });
    } else {
      // Hide features
      vectorSource.getFeatures().forEach(function(f) {
        f.setStyle([]);
      });
      // Show current
      e.features.forEach(function(f) {
        f.setStyle(null);
      });
    }
  });
  // Show all features
  function reset() {
    select.getFeatures().clear();
    vectorSource.getFeatures().forEach(function(f) {
      f.setStyle(null);
    });
    selectCtrl.doSelect();
  }
  // Set values when loaded
  var listenerKey = vectorSource.on('change',function(e){
    if (vectorSource.getState() === 'ready') {
      ol.Observable.unByKey(listenerKey);
      // Fill the popup with the features values
      selectCtrl.getControls()[1].setValues({ sort: true });
    }
  });
  