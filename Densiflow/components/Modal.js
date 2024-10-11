import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

const Lodingscreen = ({ isLoading }) => {
    return (
      
            <Modal
                transparent={true}
                animationType="fade"
                visible={isLoading}
                onRequestClose={() => {}}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                </View>
            </Modal>

    );
};

Lodingscreen.propTypes = {
    isLoading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '80%', // Responsive width
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 18,
        color: '#555',
    },
});

export default Lodingscreen;
