import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";


export const CameraViewStyle = styled(Camera)`
    flex: 1;
    align-items: center;
`;

export const ButtonsView = styled.View`
    position: absolute;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const BigButton = styled.TouchableOpacity`
    width: 60px;
    height: 60px;
    border-radius: 40px;
    border-width: 5px;
    background-color: grey;
    border-color: white;
    margin-top: 550px;
`;

export const SmallButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 40px;
    border-width: 3px;
    border-color: black;
    margin-top: 550px;
    margin-right: 30px;
    margin-left: 30px;
`;

export const ButtonIcon = styled(Ionicons).attrs({
    size: 30,
    color: "white",
})``;

export const SnackbarText = styled.Text`
    color: black;
`;