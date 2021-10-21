import {Modal, Pressable, View, StyleSheet, Text} from 'react-native';
import React, {memo} from 'react';
import CloseIcon from '../assets/icons/CloseIcon';
const CalculationModal = memo(({isVisible, setIsVisible, param, paramName}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
      }}>
      <View style={styles.modalView}>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            setIsVisible(false);
          }}>
          <CloseIcon />
        </Pressable>
        {paramName === 'Area' && (
          <View>
            <Text style={styles.title}>Area</Text>
            <Text>{`${param} sqmtr`}</Text>
          </View>
        )}
        {paramName === 'Perimeter' && (
          <View>
            <Text style={styles.title}>Perimeter</Text>
            <Text>{`${param} m`}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
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
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: -10,
    overflow: 'hidden',
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    color: '#222222',
  },
});
export default CalculationModal;
