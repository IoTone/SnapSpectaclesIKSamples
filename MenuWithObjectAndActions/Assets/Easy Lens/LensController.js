// Main Controller
//
// Made with Easy Lens

//@input Component.ScriptComponent button1
//@input Component.ScriptComponent button2
//@input Component.ScriptComponent picture1
//@input Component.ScriptComponent picture2
//@input Component.ScriptComponent touchEvents


try {

script.picture1.enabled = false;
script.picture2.enabled = false;

// Button 1 click event
script.touchEvents.onTouchDown.add(function(id, x, y) {
    if (x > 0.45 && x < 0.55 && y > 0.85 && y < 0.95) { // Assuming button1 is centered at (0.5, 0.9)
        script.picture1.enabled = true;
        script.picture2.enabled = false;
    }
});

// Button 2 click event
script.touchEvents.onTouchDown.add(function(id, x, y) {
    if (x > 0.65 && x < 0.75 && y > 0.85 && y < 0.95) { // Assuming button2 is centered at (0.7, 0.9)
        script.picture2.enabled = true;
        script.picture1.enabled = false;
    }
});

} catch(e) {
  print("error in controller");
  print(e);
}
