import { Utils } from "./Utils";

@component
export class ExtendMarkerTrackingController extends BaseScriptComponent {
  @input markerTrackingComponent: MarkerTrackingComponent;

  @input()
  @hint("Drop the parent of MarkerTrackingComponent here")
  parentObject: SceneObject;

  onAwake() {
    let mainCamera: SceneObject =
      Utils.getRootCamera(); /* Ensure the camera is set up correctly */

    /* Check if the camera is found */
    if (mainCamera) {
      let deviceTrackingComponent = mainCamera.getComponent(
        "Component.DeviceTracking"
      );
      /* Check if the device tracking component is found and if the actual device tracking mode is World */
      if (
        deviceTrackingComponent &&
        deviceTrackingComponent.getActualDeviceTrackingMode() ==
          DeviceTrackingMode.World
      ) {
        /* Set the parent of this object to the main camera */
        this.getSceneObject().setParent(mainCamera);
        this.createEvent("OnStartEvent").bind(() => {
          if (this.markerTrackingComponent.enabled) {
            this.markerTrackingComponent.onMarkerFound = () => {
              this.onMarkerFoundCallback();
            };
          }
        });
      } else {
        throw new Error(
          "You are missing a DeviceTrackingComponent with World tracking mode. Please add one to the camera."
        );
      }
    } else {
      /* If no camera is found, log an error from the Utils */
      return null;
    }
  }

  onMarkerFoundCallback() {
    print("Marker Found");

    /* Create a new parent object outside of Camera object and set the parentObject to the new parent object */
    let newParent = global.scene.createSceneObject("NewParent");
    var delayedEvent = this.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(() => {
      this.parentObject.setParentPreserveWorldTransform(newParent);
      this.markerTrackingComponent.enabled = false;
    });

    delayedEvent.reset(0.5);
  }
}
