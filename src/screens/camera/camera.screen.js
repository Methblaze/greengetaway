import React, { useContext, useState } from "react";
import { Platform } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { CameraContext } from "../../services/camera/camera.context";
import { useVisits } from "../../services/visits/visits.context";
import { useToast } from "../../services/toast/toast.context";


import { CameraViewStyle, ButtonsView, BigButton, SmallButton, ButtonIcon } from "../camera/camera.style";

export const CameraScreen = ({ navigation }) => {
    const isAndroid = Platform.OS === "android";
    const isFocused = useIsFocused();
    const [busy, setBusy] = useState(false);

    const { type, setCamera, toggleCamera, snapAndSave } = useContext(CameraContext);
    const { updateDraft } = useVisits();
    const { showToast } = useToast();

    // The photo belongs to the visit being logged. In 2023 it went into a
    // separate list with no link to any visit, and the screen waited two
    // seconds before going back.
    const takePhoto = async () => {
        if (busy) return;
        setBusy(true);
        const asset = await snapAndSave();
        setBusy(false);
        if (!asset) {
            showToast("The camera is still starting. Try again in a moment.");
            return;
        }
        updateDraft({ photoUri: asset.uri });
        showToast("Photo added to your visit");
        navigation.navigate("Add");
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
                <SmallButton onPress={() => toggleCamera()} accessibilityRole="button" accessibilityLabel="Switch camera">
                    <ButtonIcon name="camera-reverse-outline" />
                </SmallButton>

                <BigButton onPress={takePhoto} disabled={busy} accessibilityRole="button" accessibilityLabel="Take photo" />

                <SmallButton onPress={() => navigation.navigate("Add")} accessibilityRole="button" accessibilityLabel="Back to your visit">
                    <ButtonIcon name="chevron-back" />
                </SmallButton>
            </ButtonsView>

            </CameraViewStyle>
        )}
        </>
    );
};
