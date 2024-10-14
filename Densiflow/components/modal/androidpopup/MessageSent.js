import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import Sent from '../../svg/Sent';
import Fontloader from '../../Fontloader';

const MessageSent = ({ visible }) => {
  return (
    <Fontloader>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Sent />
            <Text style={{fontFamily: 'PoppinsBold', fontSize: 20, marginTop: 10}}>
            Sent Successfully
            </Text>
            <Text style={styles.message}>
            Your message has been
            sent successfully
            </Text>
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
    paddingTop: 40,
    paddingBottom: 40
  },
  message: {
    fontFamily: 'PoppinsMedium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
});

export default MessageSent;

MessageSent.propTypes = {
  visible: PropTypes.bool.isRequired
};
