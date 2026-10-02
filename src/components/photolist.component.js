import React, { useContext } from 'react';
import { View, FlatList, Image, StyleSheet, Text } from 'react-native';
import { CameraContext } from '../services/camera/camera.context';

const PhotoList = () => {
  const { photoList } = useContext(CameraContext);

  if (!photoList || photoList.length === 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>You haven't taken any photos yet :(</Text>
      </View>
    );
  }
  return (
    <FlatList
        numColumns={2}
        data={photoList}
        renderItem={({ item }) => (
            <View style={styles.photoContainer}>
                {item.uri && <Image source={{ uri: item.uri }} style={styles.photo} /> }
            </View>
        )}
        keyExtractor={(item) => item.uri.toString()}
        contentContainerStyle={styles.photoListStyle}
    />
  );
};

const styles = StyleSheet.create({
  photoListStyle: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
        height: 250,
        width: 150,
        marginBottom: 50,
      
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 15,
    color: 'gray',
  },
});

export default PhotoList;