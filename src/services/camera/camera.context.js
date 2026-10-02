import React, { createContext, useEffect, useState } from "react";
import { CameraType } from "expo-camera";

import { hasCameraPermission, snapAndSavePhoto } from "./camera.service";

export const CameraContext = createContext();

export const CameraContextProvider = ({ children }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(CameraType.front);
    const [uri, setUri] = useState(null);
    const [photoList, setPhotoList] = useState([]);

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

    const snapAndSave = async () => {
        try {
            if (hasPermission) {
            let asset = await snapAndSavePhoto(camera);
            setPhotoList((prevList) => [... prevList, {uri: asset.uri}]);
            }
        } catch (e) {
            console.error("error in snapAndSave: ", e);
        }
    };

    const resetPhotoList = () => {
        setPhotoList([]);
    };

    return (
        <CameraContext.Provider value={{ type, photoList, setCamera, toggleCamera, snapAndSave, resetPhotoList }}>
        {children}
        </CameraContext.Provider>
    );
};