import React, { useContext, useState } from "react";
import { Platform } from "react-native";
import { Snackbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

import { CameraContext } from "../../services/camera/camera.context";


import { CameraViewStyle, ButtonsView, BigButton, SmallButton, ButtonIcon, SnackbarText } from "../camera/camera.style";

export const CameraScreen = ({ navigation }) => {
    const isAndroid = Platform.OS === "android";
    const isFocused = useIsFocused();

    const [visible, setVisible] = useState(false);

    const { type, photoList, setCamera, toggleCamera, snapAndSave, resetPhotoList} = useContext(CameraContext);
    console.log('current photolist:', photoList);

    const savingPhoto = async () => {
        setVisible(true);
        await snapAndSave();

        setTimeout(() => {
            setVisible(false);
            navigation.navigate('Add');
        }, 2000);
    };

    return (
        <>
        {isFocused && (
            <CameraViewStyle
            ref={(ref) => setCamera(ref)}
            type={type}
            useCamera2Api={isAndroid}
            ratio="2:1"
            >

            <ButtonsView>
                <SmallButton onPress={() => toggleCamera()}>
                    <ButtonIcon name="camera-reverse-outline" />
                </SmallButton>

                <BigButton onPress={() => savingPhoto() } />

                <SmallButton
                    disabled={photoList ? false : true}
                    onPress={() => navigation.navigate("Add")}
                >
                    <ButtonIcon name="chevron-back" />
                </SmallButton>
            </ButtonsView>
            
            <Snackbar visible={visible}>
                <SnackbarText>Image successfully saved!</SnackbarText>
            </Snackbar>
            
            </CameraViewStyle>
        )}
        </>
    );
};