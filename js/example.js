
/*
 * Camera Buttons
 */

var CameraButtons = function(blueprint3d) {

  var orbitControls = blueprint3d.three.controls;
  var three = blueprint3d.three;

  var panSpeed = 30;
  var directions = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  function init() {
    // Camera controls
    $("#zoom-in").click(zoomIn);
    $("#zoom-out").click(zoomOut);  
    $("#zoom-in").dblclick(preventDefault);
    $("#zoom-out").dblclick(preventDefault);

    $("#reset-view").click(three.centerCamera)

    $("#move-left").click(function(){
      pan(directions.LEFT)
    })
    $("#move-right").click(function(){
      pan(directions.RIGHT)
    })
    $("#move-up").click(function(){
      pan(directions.UP)
    })
    $("#move-down").click(function(){
      pan(directions.DOWN)
    })

    $("#move-left").dblclick(preventDefault);
    $("#move-right").dblclick(preventDefault);
    $("#move-up").dblclick(preventDefault);
    $("#move-down").dblclick(preventDefault);
  }

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function pan(direction) {
    switch (direction) {
      case directions.UP:
        orbitControls.panXY(0, panSpeed);
        break;
      case directions.DOWN:
        orbitControls.panXY(0, -panSpeed);
        break;
      case directions.LEFT:
        orbitControls.panXY(panSpeed, 0);
        break;
      case directions.RIGHT:
        orbitControls.panXY(-panSpeed, 0);
        break;
    }
  }

  function zoomIn(e) {
    e.preventDefault();
    orbitControls.dollyIn(1.1);
    orbitControls.update();
  }

  function zoomOut(e) {
    e.preventDefault;
    orbitControls.dollyOut(1.1);
    orbitControls.update();
  }

  init();
}

/*
 * Simplified Floorplan Manager - No sidebar needed
 */ 

var FloorplanManager = function(blueprint3d, floorplanControls) {
  var blueprint3d = blueprint3d;
  var floorplanControls = floorplanControls;

  var scope = this;
  this.stateChangeCallbacks = $.Callbacks();

  function init() {
    initFloorplanView();
    handleWindowResize();
  }

  function initFloorplanView() {
    // Show floorplan view directly
    $("#floorplanner").show();
    $("#viewer").hide();
    
    // Initialize floorplan controls
    floorplanControls.updateFloorplanView();
    floorplanControls.handleWindowResize();
    
    // Update the model
    blueprint3d.model.floorplan.update();
  }

  function handleWindowResize() {
    // Handle window resize for floorplan
    $(window).resize(function() {
      floorplanControls.handleWindowResize();
    });
    floorplanControls.handleWindowResize();
  };

  init();
}



/*
 * Floorplanner controls
 */

var ViewerFloorplanner = function(blueprint3d) {

  var canvasWrapper = '#floorplanner';

  // buttons
  var move = '#move';
  var remove = '#delete';
  var draw = '#draw';

  var activeStlye = 'btn-primary disabled';

  this.floorplanner = blueprint3d.floorplanner;

  var scope = this;

  function init() {

    $( window ).resize( scope.handleWindowResize );
    scope.handleWindowResize();

    // mode buttons
    scope.floorplanner.modeResetCallbacks.add(function(mode) {
      $(draw).removeClass(activeStlye);
      $(remove).removeClass(activeStlye);
      $(move).removeClass(activeStlye);
      if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
          $(move).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
          $(draw).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
          $(remove).addClass(activeStlye);
      }

      if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
        $("#draw-walls-hint").show();
        scope.handleWindowResize();
      } else {
        $("#draw-walls-hint").hide();
      }
    });

    $(move).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
    });

    $(draw).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
    });

    $(remove).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
    });

    // grid preset buttons
    function setPreset(activeId, gridXcm, gridYcm) {
      scope.floorplanner.view.gridSpacingXcm = gridXcm;
      scope.floorplanner.view.gridSpacingYcm = gridYcm;
      // update active style
      $("#grid-presets .btn").removeClass("btn-primary disabled");
      $("#"+activeId).addClass("btn-primary disabled");
      scope.floorplanner.view.draw();
    }

    // 1.8 x 1.0 → landscape (horizontal 1.8 m, vertical 1.0 m)
    $("#preset-1").click(function(){ setPreset("preset-1", 180.0, 100.0); });
    // 2.4 x 1.2 → landscape (horizontal 2.4 m, vertical 1.2 m)
    $("#preset-2").click(function(){ setPreset("preset-2", 240.0, 120.0); });
    // 1.1 x 2.3 → portrait (horizontal 1.1 m, vertical 2.3 m)
    $("#preset-3").click(function(){ setPreset("preset-3", 110.0, 230.0); });

    // initialize default preset button to match default spacings close to 2.1 x 1.2
    setPreset("preset-2", 240.0, 120.0);
  }

  this.updateFloorplanView = function() {
    scope.floorplanner.reset();
  }

  this.handleWindowResize = function() {
    $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
    scope.floorplanner.resizeView();
  };

  init();
}; 

var mainControls = function(blueprint3d) {
  var blueprint3d = blueprint3d;

  function newDesign() {
    // Start with a simple rectangle room without textures
    blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"c1":{"x":204.851,"y":289.052},"c2":{"x":672.211,"y":289.052},"c3":{"x":672.211,"y":-178.308},"c4":{"x":204.851,"y":-178.308}},"walls":[{"corner1":"c4","corner2":"c1"},{"corner1":"c1","corner2":"c2"},{"corner1":"c2","corner2":"c3"},{"corner1":"c3","corner2":"c4"}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
  }

  function loadDesign() {
    files = $("#loadFile").get(0).files;
    var reader  = new FileReader();
    reader.onload = function(event) {
        var data = event.target.result;
        blueprint3d.model.loadSerialized(data);
    }
    reader.readAsText(files[0]);
  }

  function saveDesign() {
    var data = blueprint3d.model.exportSerialized();
    var a = window.document.createElement('a');
    var blob = new Blob([data], {type : 'text'});
    a.href = window.URL.createObjectURL(blob);
    a.download = 'design.blueprint3d';
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
  }

  function init() {
    $("#new").click(newDesign);
    $("#loadFile").change(loadDesign);
    $("#saveFile").click(saveDesign);
  }

  init();
}

/*
 * Initialize!
 */

$(document).ready(function() {

  // main setup (2D only)
  var opts = {
    floorplannerElement: 'floorplanner-canvas',
    threeElement: null,
    threeCanvasElement: null,
    textureDir: "models/textures/",
    widget: true
  }
  var blueprint3d = new BP3D.Blueprint3d(opts);

  var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
  var floorplanManager = new FloorplanManager(blueprint3d, viewerFloorplanner);
  // 2D-only: do not initialize camera buttons / 3D controls
  mainControls(blueprint3d);

  // Autoload a simple rectangle room without textures
  blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"c1":{"x":204.851,"y":289.052},"c2":{"x":672.211,"y":289.052},"c3":{"x":672.211,"y":-178.308},"c4":{"x":204.851,"y":-178.308}},"walls":[{"corner1":"c4","corner2":"c1"},{"corner1":"c1","corner2":"c2"},{"corner1":"c2","corner2":"c3"},{"corner1":"c3","corner2":"c4"}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
});
