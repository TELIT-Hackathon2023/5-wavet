// ThreeScene.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';

// Import the font file
import helvetikerRegularTypeface from 'three/examples/fonts/helvetiker_regular.typeface.json';

const ThreeScene = ({ parkingSpotsData, handleSpotClick }) => {
    const sceneRef = useRef();
    const rendererRef = useRef(null);
    const parkingSpotsRef = useRef([]);

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [z, setZ] = useState(0)

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f8f8); // Nice blue background

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Shadow configuration for the directional light
        directionalLight.castShadow = true;
        // Other shadow-related properties...

        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;

        const camera = new THREE.PerspectiveCamera(50, (window.innerWidth * 0.55) / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth * 0.55, window.innerHeight);
        new Interaction(renderer, scene, camera);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        let geometry = new THREE.BoxGeometry(12, 0.2, 3);
        let material = new THREE.MeshBasicMaterial({ color: 0x444444 });
        let spot = new THREE.Mesh(geometry, material);
        spot.position.set(5, 0, 4);
        scene.add(spot);
        spot.castShadow = true;
        spot.receiveShadow = true;

        geometry = new THREE.BoxGeometry(3, 0.2, 21);
        material = new THREE.MeshBasicMaterial({ color: 0x444444 });
        spot = new THREE.Mesh(geometry, material);
        spot.position.set(11, 0, 8.5);
        spot.castShadow = true;
        spot.receiveShadow = true;
        scene.add(spot);


        geometry = new THREE.BoxGeometry(12, 0.2, 3);
        material = new THREE.MeshBasicMaterial({ color: 0x444444 });
        spot = new THREE.Mesh(geometry, material);
        spot.position.set(5, 0, 16);
        scene.add(spot);
        spot.castShadow = true;
        spot.receiveShadow = true;



        // Append the renderer to the DOM
        sceneRef.current.appendChild(renderer.domElement);
        let parkingSpots = parkingSpotsData.map((spotData) => {
            let geometry = new THREE.BoxGeometry(1.6, spotData.height, 3.4);
            let material = new THREE.MeshBasicMaterial({ color: spotData.color });
            let spot = new THREE.Mesh(geometry, material);
            spot.position.set(spotData.x, 0, spotData.z);
            scene.add(spot);





            if (spotData.color !== 0x999999) {
                spot.cursor = "pointer";
            }
            spot.castShadow = true;
            spot.receiveShadow = true;

            // Adjust the position based on the size of the text
            const textGeometry = new THREE.TextGeometry(spotData.lable, {
                font: new THREE.Font(helvetikerRegularTypeface),
                size: 0.6, // Increase the size for higher resolution
                height: 0.05, // Adjust the height of the text
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc }); // Set text color
            // Get the bounding box of the text
            const textBoundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(textGeometry));

            // Calculate the center of the bounding box
            const centerX = (textBoundingBox.max.x - textBoundingBox.min.x) / 2;
            const centerY = (textBoundingBox.max.y - textBoundingBox.min.y) / 2;

            // Set the position of the textMesh
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(spotData.x - centerX, spotData.height * 0.85, spotData.z - centerY + 0.5);
            textMesh.rotation.set(-1.5, 0, 0);
            scene.add(textMesh);




            spot.on('click', function (ev) {
                handleSpotClick(spot.userData.id);
                console.log("xd");
            });

            spot.userData = { id: spotData.id };

            return { spot, textMesh };
        });

        parkingSpotsRef.current = parkingSpots;
        rendererRef.current = renderer;

        camera.position.set(16, 19, 15); // Adjust the camera position
        camera.lookAt(new THREE.Vector3(8, 0, 9)); // Look at the center of your scene


        const animate = () => {
            requestAnimationFrame(animate);

            // Render the scene
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth * 0.4, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);

            parkingSpotsRef.current.forEach(({ spot, textMesh }) => {
                scene.remove(spot);
                scene.remove(textMesh);
                spot.geometry.dispose();
                spot.material.dispose();
                textMesh.geometry.dispose();
                textMesh.material.dispose();
            });

            // Dispose of the renderer explicitly
            rendererRef.current.dispose();
            rendererRef.current.forceContextLoss(); // Force context loss to release GPU resources
            if (!!sceneRef.current) {
                sceneRef.current.removeChild(rendererRef.current.domElement);
            }

        };
    }, [parkingSpotsData, handleSpotClick, x, y, z]);

    return (<div>
        {/* <input type="number" value={x} onChange={e => setX(e.target.value)} />
        <input type="number" value={y} onChange={e => setY(e.target.value)} />
        <input type="number" value={z} onChange={e => setZ(e.target.value)} /> */}
        <div ref={sceneRef} />
    </div>);
};

export default ThreeScene;
