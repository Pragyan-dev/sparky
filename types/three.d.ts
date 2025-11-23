declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Loader, LoadingManager, Group } from 'three';

    export interface GLTF {
        animations: any[];
        scene: Group;
        scenes: Group[];
        cameras: any[];
        asset: any;
    }

    export class GLTFLoader extends Loader {
        constructor(manager?: LoadingManager);
        load(
            url: string,
            onLoad: (gltf: GLTF) => void,
            onProgress?: (event: ProgressEvent) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
        parse(
            data: ArrayBuffer | string,
            path: string,
            onLoad: (gltf: GLTF) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
    }
}

declare module 'expo-three' {
    import { WebGLRenderer } from 'three';

    export class Renderer extends WebGLRenderer {
        constructor(options: any);
    }

    export class TextureLoader {
        static load(asset: any): any;
    }
}
