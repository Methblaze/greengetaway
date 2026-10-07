import React, { createContext, useEffect, useState } from "react";
import { CameraType } from "expo-camera";

import { hasCameraPermission, snapAndSavePhoto } from "./camera.service";

export const CameraContext = createContext();

export const CameraContextProvider = ({ children }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(CameraType.front);

    useEffect(() => {
        (async () => {
            const permission = await hasCameraPermission();
            setHasPermission(permission);
        })();
    }, []);

    const toggleCamera = () => {
        const newType =
            type === CameraType.back ? CameraType.front : CameraType.back;
        setType(newType);
    };

    // Returns the saved photo, or null if no photo was taken (no permission,
    // or a browser camera that has not delivered a frame yet), so the
    // caller can attach the photo to the visit being logged.
    const snapAndSave = async () => {
        try {
            if (!hasPermission || !camera) return null;
            return await snapAndSavePhoto(camera);
        } catch (e) {
            console.warn("No photo taken: ", e && e.message);
            return null;
        }
    };

    return (
        <CameraContext.Provider value={{ type, setCamera, toggleCamera, snapAndSave }}>
        {children}
        </CameraContext.Provider>
    );
};