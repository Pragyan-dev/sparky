import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Asset } from 'expo-asset';
import {
    Scene,
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    GridHelper,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface StoreMap3DProps {
    modelPath: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

export const StoreMap3D: React.FC<StoreMap3DProps> = ({ onLoad, onError }) => {
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const onContextCreate = async (gl: any) => {
        try {
            console.log('=== 3D Map: Starting context creation ===');

            // Validate GL context
            if (!gl || !gl.drawingBufferWidth || !gl.drawingBufferHeight) {
                throw new Error('Invalid WebGL context');
            }

            const { drawingBufferWidth, drawingBufferHeight } = gl;
            console.log('3D Map: GL context dimensions:', drawingBufferWidth, 'x', drawingBufferHeight);

            // Create renderer with safer options
            const renderer = new Renderer({
                gl,
                antialias: true,
                alpha: false,
            });

            console.log('3D Map: Renderer created');

            // @ts-ignore - expo-three has different API than standard three.js
            if (typeof renderer.setSize === 'function') {
                renderer.setSize(drawingBufferWidth, drawingBufferHeight);
            }
            // @ts-ignore
            if (typeof renderer.setClearColor === 'function') {
                renderer.setClearColor(0xf5f5f5, 1);
            }


            // Create scene
            const scene = new Scene();
            console.log('3D Map: Scene created');

            // Create camera
            const camera = new PerspectiveCamera(
                75,
                drawingBufferWidth / drawingBufferHeight,
                0.1,
                1000
            );
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);
            console.log('3D Map: Camera created and positioned');

            // Add lights
            const ambientLight = new AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 5);
            scene.add(directionalLight);
            console.log('3D Map: Lights added');

            // Add grid helper for reference
            const gridHelper = new GridHelper(20, 20, 0xcccccc, 0xeeeeee);
            scene.add(gridHelper);
            console.log('3D Map: Grid helper added');

            // Load GLB model
            console.log('3D Map: Starting to load GLB model...');
            const asset = Asset.fromModule(require('../../assets/11_22_2025.glb'));
            await asset.downloadAsync();
            console.log('3D Map: Asset downloaded');

            const loader = new GLTFLoader();

            const modelUri = asset.localUri || asset.uri;
            if (!modelUri) {
                throw new Error('Failed to load asset URI');
            }

            console.log('3D Map: Loading model from:', modelUri);

            loader.load(
                modelUri,
                (gltf: any) => {
                    console.log('3D Model loaded successfully');

                    // Add model to scene
                    const model = gltf.scene;

                    // Center and scale the model
                    model.position.set(0, 0, 0);
                    model.scale.set(1, 1, 1);

                    scene.add(model);

                    if (onLoad) {
                        onLoad();
                    }
                },
                (progress: any) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    console.log('Loading progress:', percent.toFixed(2), '%');
                },
                (error: any) => {
                    console.error('Error loading 3D model:', error);
                    if (onError) {
                        onError(error as Error);
                    }
                }
            );

            // Animation loop
            let rotation = 0;
            const render = () => {
                animationFrameRef.current = requestAnimationFrame(render);

                // Slowly rotate camera around the scene
                rotation += 0.005;
                camera.position.x = Math.sin(rotation) * 10;
                camera.position.z = Math.cos(rotation) * 10;
                camera.lookAt(0, 0, 0);

                // @ts-ignore - expo-three has different API
                renderer.render(scene, camera);
                gl.endFrameEXP();
            };
            render();

        } catch (error) {
            console.error('Error setting up 3D context:', error);
            if (onError) {
                onError(error as Error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <GLView
                style={styles.glView}
                onContextCreate={onContextCreate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    glView: {
        flex: 1,
    },
});
