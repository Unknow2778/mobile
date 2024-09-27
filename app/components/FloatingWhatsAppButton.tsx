import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconBrandWhatsapp } from '@tabler/icons-react-native';

interface FloatingWhatsAppButtonProps {
  onPress: () => void;
}

const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <IconBrandWhatsapp size={30} color='#FFFFFF' />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#25D366',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FloatingWhatsAppButton;
