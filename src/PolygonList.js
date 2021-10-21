import React, {useState} from 'react';
import {View, StyleSheet, Text, FlatList, Modal, Pressable} from 'react-native';
import CloseIcon from './assets/icons/CloseIcon';

export const PolygonList = ({
  PolygonData,
  polygonListModal,
  setPolygonListModal,
}) => {
  //const {PolygonData} = props;

  const [isVisible, setVisible] = useState(polygonListModal);
  console.log('polygon data from props==>', PolygonData);

  const onCloseModal = () => {
    setVisible(false);
  };

  const renderItem = ({item}) => {
    console.log('item======>', item);
    return (
      <View style={styles.modelview}>
        <Text style={styles.title}>{`Name: ${item.polyName}`}</Text>
        <Text style={styles.data}>{`Area: ${item.area} sqmtr.`}</Text>
        <Text style={styles.data}>{`Perimeter: ${item.perimeter} m.`}</Text>
      </View>
    );
  };

  console.log('modal visibility===>', isVisible);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCloseModal}>
      <View>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            onCloseModal();
            setPolygonListModal(false);
          }}>
          <CloseIcon />
        </Pressable>
        <View style={styles.modalContainer}>
          <FlatList
            data={PolygonData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  title: {
    fontSize: 20,
    color: '#111111',
  },
  data: {
    fontSize: 16,
    color: '#111111',
  },
  modalContainer: {
    top: 20,
    marginTop: 35,
    //flex: 1,
  },
  modelview: {
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
