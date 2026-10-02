// Web build only. A browser has no photo library to save into, so photos are
// kept in memory for the session. Permission is not requested up front: the
// camera prompt appears when the camera screen opens, not on page load.
export const hasCameraPermission = async () => true;

export const snapAndSavePhoto = async (camera) => {
  const { uri } = await camera.takePictureAsync({ quality: 0.8 });
  return { uri };
};
