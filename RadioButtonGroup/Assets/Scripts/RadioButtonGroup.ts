import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
// import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

/* import { reportError } from "../Helpers/ErrorUtils";
import { HelperFuntions } from "../Helpers/HelperFunctions";
import { Logger } from "../Helpers/Logger";
import { setTimeout } from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils";
*/


@component
export class RadioButtonGroup extends BaseScriptComponent {
    @input
    @hint("Array of RadioButtons/toggle buttons to use")
    public radiobuttonGroupMembers!: ToggleButton[]
        
    private selectedIndex: Number = -1;
    
    onAwake() {
        print("onAwake()");
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart()
        })
    }
    
    onStart() {
        print("onStart()");
        
        if (!this.radiobuttonGroupMembers || this.radiobuttonGroupMembers.length < 2) {
          print("Error: At least 2 radio button group members (as ToggleButtons) are required!");
          return;
        }
        //
        // Set up the rules for radio buttons
        // Any selected button will cause other buttons
        // to become unselected
        //
        // There is a method that can be called to get the
        // index or label of the selected button
        for (let i = 0; i < this.radiobuttonGroupMembers.length; i++) {
          this.radiobuttonGroupMembers[i].onStateChanged.add(
            (isToggledOn: boolean) => {
                if (isToggledOn) {
                    print("radio button is on: " + i);
                    this.selectedIndex = i; 
                    // this.doSelect(i);
                    this.doDeselect(i);
                }
             },
            )
        }
        
    }
    
    doDeselect(selectedIndex: Number) {
        // Deselect the otehrs
        for (let i = 0; i < this.radiobuttonGroupMembers.length; i++) {
          if (i != this.selectedIndex) {
            print("toggling off: " + i);
            this.radiobuttonGroupMembers[i].isToggledOn = false;      
          }
        }
    }
    
    doGetSelectedIndex(): Number {
        return this.selectedIndex;
    }
    
}
