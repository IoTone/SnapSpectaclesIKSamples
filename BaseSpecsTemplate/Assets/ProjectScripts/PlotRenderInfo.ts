import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class PlotRenderInfo extends BaseScriptComponent {
    // TODO: Switch this to be a dynamic asset loaded from the scene
    @input
    @hint("Choose an Interactable Mesh")
    public interactableMesh!: Interactable;

    @input
    @hint("Choose a Text Scene Object")
    public functionText: Text;
    
    @input
    @hint("Audio Soundtrack")
    public mainAudioLoop: AudioComponent;
    
    onAwake() {
        this.setupCallbacks();
        this.mainAudioLoop.play(1);
    }
    
    private setupCallbacks = (): void => {
        this.interactableMesh.onTriggerEnd.add(this.onTriggerEndEvent)
    }

    // Convert flat number array to vec3 array
    private numberArrayToVec3Array(numbers: number[]): vec3[] {
        const vec3Array: vec3[] = [];
        if (numbers.length % 3 !== 0) {
            print(`Error: Number array length (${numbers.length}) is not a multiple of 3, cannot convert to vec3.`);
            return vec3Array;
        }

        for (let i = 0; i < numbers.length; i += 3) {
            const x = numbers[i];
            const y = numbers[i + 1];
            const z = numbers[i + 2];
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                print(`Warning: Invalid vec3 at index ${i / 3}: (${x}, ${y}, ${z}). Skipping.`);
                continue;
            }
            vec3Array.push(new vec3(x, y, z));
        }
        return vec3Array;
    }

    // Compute normal from three vertices using cross product
    private computeNormalFromVertices(v0: vec3, v1: vec3, v2: vec3): vec3 | null {
        const edge1 = v1.sub(v0);
        const edge2 = v2.sub(v0);
        const normal = edge1.cross(edge2);
        const length = normal.length;
        if (isNaN(length) || length < 0.0001) {
            print("Warning: Cross product produced invalid normal (degenerate triangle or collinear points).");
            return null;
        }
        return normal.normalize();
    }
    
    // Generate the formula
    // TODO
    private computeNormalFromVertices2(v0: vec3, v1: vec3, v2: vec3): vec3 | null {
        const edge1 = v1.sub(v0);
        const edge2 = v2.sub(v0);
        const normal = edge1.cross(edge2);
        const length = normal.length;
        if (isNaN(length) || length < 0.0001) {
            print("Warning: Cross product produced invalid normal (degenerate triangle or collinear points).");
            return null;
        }
        return normal.normalize();
    }
    
    // {x: -0.5, y: 0.5, z: 0.5},{x: 0.5, y: 0.5, z: 0.5},{x: 0.5, y: 0.5, z: -0.5}
    // returns a vec3 (normal)
    private normalOfPlane(vertices: vec3[]) : vec3 | null {
    	// x , y , z
        // const vec3Array: vec3[] = [];
        // var vec = new vec3(x, y, z)
    	const a = vertices[0]
    	const b = vertices[1];
    	const c = vertices[2];
        let result = [
    		(
    			((b.y-a.y)*(c.z-a.z))-((b.z-a.z)*(c.y-a.y)) // X
    		),
    		(
    			((b.z-a.z)*(c.x-a.x))-((b.x-a.x)*(c.z-a.z)) // Y
    		),
    		(
    			((b.x-a.x)*(c.y-a.y))-((b.y-a.y)*(c.x-a.x)) // Z
    		)
        ];
    	return new vec3(result[0], result[1], result[2]);

    }
    
    // returns a number
    private solveForValueOfAPlane(normal: vec3, pointinplane: vec3) : number {
    	// x , y , z
        // const vec3Array: vec3[] = [];
        // var vec = new vec3(x, y, z)
        let a = pointinplane;
    	
    	return normal.x*a.x+normal.y*a.y+normal.z*a.z;
    }
        
    private onTriggerEndEvent = (): void => {
        // interactableMesh
        print("End trigger");
        const sceneObj = this.interactableMesh.sceneObject;
        var meshVisual = sceneObj.getComponent("Component.RenderMeshVisual");
        if(meshVisual)
        {
        	// ...
            print("Mesh visual found");
            
            // Get the transform
            const transform = meshVisual.getTransform();
            
            const mesh = meshVisual.mesh;
            
            const worldPos = transform.getWorldPosition();
            const localPos = transform.getLocalPosition();
            print(
              "PlotRenderInfo " +
                " - World: (" +
                worldPos.x.toFixed(2) +
                ", " +
                worldPos.y.toFixed(2) +
                ", " +
                worldPos.z.toFixed(2) +
                ") Local: (" +
                localPos.x.toFixed(2) +
                ", " +
                localPos.y.toFixed(2) +
                ", " +
                localPos.z.toFixed(2) +
                ")"
            );
            
             // Extract vertex positions using VertexAttribute.Position
            // Extract vertex positions using attribute "position"
            const vertexData: number[] = mesh.extractVerticesForAttribute("position") as number[];
            if (!vertexData || vertexData.length === 0) {
                print("Error: Failed to extract vertex positions from RenderMesh or mesh has no vertices.");
                return;
            }
            /*
            // Convert number[] to vec3[]
            const vertices: vec3[] = this.numberArrayToVec3Array(vertexData);
            if (vertices.length === 0) {
                print("Error: No valid vertex positions extracted.");
                return;
            }

            // Log vertex count and data (limit to first 5 for brevity)
            const vertexCount: number = vertices.length;
            print(`Found ${vertexCount} vertex positions in RenderMesh.`);
            for (let i = 0; i < Math.min(vertexCount, 5); i++) {
                const vertex: vec3 = vertices[i];
                print(`Vertex ${i}: (${vertex.x}, ${vertex.y}, ${vertex.z})`);
            }
            */
                
            // Log indeces
            
            /*
            const indeces = mesh.extractIndeces();
            print(`Found ${indeces.length} indeces in mesh.`);
            for (let i = 0; i < Math.min(indeces.length, 5); i++) { // Limit to first 5 for brevity
                const vertex: vec3 = indeces[i];
                print(`indeces ${i}: (${indeces.x}, ${indeces.y}, ${indeces.z})`);
            }
            */
            
            // Extract indices
            const indices: number[] = mesh.extractIndices();
            if (!indices || indices.length === 0) {
                print("Error: Failed to extract indices from RenderMesh or mesh has no indices.");
                return;
            }
        
            // Validate indices length (must be multiple of 3 for triangles)
            if (indices.length % 3 !== 0) {
                print(`Warning: Indices length (${indices.length}) is not a multiple of 3, which is unexpected for triangle meshes.`);
            }
        
            // Log total number of indices and triangles
            const indexCount: number = indices.length;
            const triangleCount: number = Math.floor(indexCount / 3);
            print(`Found ${indexCount} indices, forming ${triangleCount} triangles in RenderMesh.`);
        
            // Print indices grouped by triangles
            /*
            for (let i = 0; i < indexCount; i += 3) {
                if (i + 2 < indexCount) {
                    const triangleIndices = [indices[i], indices[i + 1], indices[i + 2]];
                    print(`Triangle ${Math.floor(i / 3)}: Indices [${triangleIndices.join(", ")}]`);
                } else {
                    // Handle any leftover indices (shouldn't occur in a valid triangle mesh)
                    print(`Leftover indices at end: [${indices.slice(i).join(", ")}]`);
                }
            } */
            
            // Get world transform matrix
            const worldTransform: mat4 = transform.getWorldTransform();
    
            /*
            // --- Get Normal Vector ---
            // Try extracting vertex normals
            let normal: vec3 | null = null;
            const normalData: number[] = mesh.extractVerticesForAttribute("normal") as number[];
            if (normalData && normalData.length >= 3) {
                const normals: vec3[] = this.numberArrayToVec3Array(normalData);
                if (normals.length > 0) {
                    // Average normals (should be similar for a plane)
                    let avgNormal = new vec3(0, 0, 0);
                    for (const n of normals) {
                        avgNormal = avgNormal.add(n);
                    }
                    avgNormal = avgNormal.uniformScale(1 / normals.length).normalize();
                    normal = avgNormal;
                    print(`Normal vector (from vertex normals): (${normal.x}, ${normal.y}, ${normal.z})`);
                }
            }
            */
            
            
            // Fallback: Compute normal from vertex positions
            const positionData: number[] = mesh.extractVerticesForAttribute("position") as number[];
            if (!positionData || positionData.length < 12) { // 4 vertices * 3 components
                print("Error: Failed to extract vertex positions or insufficient vertices for a plane.");
                return;
            }
    
            const vertices: vec3[] = this.numberArrayToVec3Array(positionData);
            if (vertices.length <= 3) {
                print(`Error need 3 points on the plane: ${vertices} ${vertices.length}`);
                // vertices.length;
            } else {
                print(`Found 3+ points on a plane: ${vertices} ${vertices.length}`);
            }
    
            
            
            /*
            if (vertices.length === 4) {
                // Compute normal using first three vertices
                normal = this.computeNormalFromVertices(vertices[0], vertices[1], vertices[2]);
                print(`Normal vector (computed from vertices): (${normal.x}, ${normal.y}, ${normal.z})`);
            }
            */
    
            
            // --- Get World Coordinates of Four Corners ---
            print("World coordinates of plane corners:");
            const worldverts: vec3[] = [];
            for (let i = 0; i < vertices.length; i++) {
                // Transform local position to world space
                const localPos: vec3 = vertices[i];
                const worldPos: vec3 = worldTransform.multiplyPoint(localPos);
                worldverts.push(worldPos);
                print(`Corner ${i}: (${worldPos.x}, ${worldPos.y}, ${worldPos.z})`);
            }
             // compute from 3 points
            
            
            const normal = this.normalOfPlane(worldverts);
            const normal2 = this.computeNormalFromVertices(worldverts[0], worldverts[1], worldverts[2]);
            print(`new normal (${normal.x.toFixed(2)}, ${normal.y.toFixed(2)}, ${normal.z.toFixed(2)})`);
            print(`new normal2 (${normal2.x.toFixed(2)}, ${normal2.y.toFixed(2)}, ${normal2.z.toFixed(2)})`);
                     
            
            const solved = this.solveForValueOfAPlane(normal2, worldverts[3]);
            print(`solved = ${solved}`);
            // TODO: reposition the text to be above the plane
            // new normal (-545.7544555664062, -141.00242614746094, 388.95611572265625)

            this.functionText.text = `${normal2.x.toFixed(2)}x+${normal2.y.toFixed(2)}y+${normal2.z.toFixed(2)}z=${solved.toFixed(2)}`;
            // Optional: Debug indices to understand vertex order
            // const indices: number[] = mesh.extractIndices();
            if (indices && indices.length >= 6) { // >= 6 for 2 triangles
                print(`Indices: [${indices.join(", ")}]`);
            }
            
            /*
            // Get vertex count
            const vertexCount: number = mesh.getVertexCount();
            if (vertexCount === 0) {
                print("Error: Mesh has no vertices.");
                return;
            }
        
            
            // Get vertices (returns vec3 array)
            const vertices: vec3[] = mesh.getVertices();
            if (!vertices || vertices.length === 0) {
                print("Error: Failed to retrieve vertices.");
                return;
            }
        
            // Log vertex data
            print(`Found ${vertices.length} vertices in mesh.`);
            for (let i = 0; i < Math.min(vertices.length, 5); i++) { // Limit to first 5 for brevity
                const vertex: vec3 = vertices[i];
                print(`Vertex ${i}: (${vertex.x}, ${vertex.y}, ${vertex.z})`);
            }
            */
        }
    }
}
