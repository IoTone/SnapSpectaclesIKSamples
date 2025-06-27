import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class CalculatorSceneManager extends BaseScriptComponent {
    @input
    @hint("Audio Soundtrack")
    public mainAudioLoop: AudioComponent;
    
    onAwake() {
        this.setupCallbacks();
        this.mainAudioLoop.play(-1 /* forever */);
    }
    
    private setupCallbacks = (): void => {
        
    }
}
