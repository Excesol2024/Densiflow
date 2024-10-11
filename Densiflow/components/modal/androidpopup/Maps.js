import { Modal, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import Permission from '../../svg/Permission';
import Fontloader from '../../Fontloader';

const Maps = ({ visible, onRequestPermission, onClose }) => {
  return (
    <Fontloader>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Permission />
            <Text style={styles.message}>
            Allow <Text style={{fontFamily: 'PoppinsBold'}}>Maps</Text> to access this device’s precise location?
            </Text>

                <View style={{flexDirection: 'row', gap: 8 }}>
                    <View>
                        <Image source={require('../../../assets/map1.png')} />
                        <Text style={{textAlign: 'center', fontFamily: 'PoppinsMedium'}}>Precise</Text>
                    </View>
                    <View>
                        <Image source={require('../../../assets/map2.png')} />
                        <Text style={{textAlign: 'center', fontFamily: 'PoppinsMedium'}}>Approximate</Text>
                    </View>
                </View>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.allowButton} onPress={onRequestPermission}>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 15}} >While using the app</Text>
              </Pressable>
              <Pressable style={styles.onlyBtn} onPress={onClose}>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 15}}>Only this Time</Text>
              </Pressable>
              <Pressable style={styles.denyButton} onPress={onClose}>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 15}}>Don't Allow</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Fontloader>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
  },
  message: {
    fontFamily: 'PoppinsMedium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'column', // Changed to column for vertical layout
    width: '100%',
    marginTop: 10,
  },
  allowButton: {
    backgroundColor: '#D2E4FC', // Customize your button color here
    padding: 15,
    marginBottom: 4, // Space between buttons
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  denyButton: {
    backgroundColor: '#D2E4FC', // Customize your button color here
    padding: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  onlyBtn: {
    backgroundColor: '#D2E4FC', // Customize your button color here
    padding: 15,
    alignItems: 'center',
    marginBottom: 4
  }
});

export default Maps;

Maps.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestPermission: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
