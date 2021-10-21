import React, {memo, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';

const PolygonNameModal = memo(
  ({modalVisible, setModalVisible, polygoneName, setPolygoneName, onPress}) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <TextInput
                value={polygoneName}
                style={styles.input}
                placeholder="Name of polygon"
                onChangeText={text => setPolygoneName(text)}
              />
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onPress}>
              <Text style={styles.textStyle}>Save Data</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {},
  modalView: {
    Top: 50,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {height: 40, width: '100%'},
  input: {
    paddingLeft: 10,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    color: '#111111',

    fontSize: 16,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 15,
    width: '50%',
  },
});

export default PolygonNameModal;
