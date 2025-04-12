import { useState } from "react";
import { View, Button, Modal, StyleSheet, TouchableOpacity, Text } from "react-native";
import Signature from "react-native-signature-canvas";

const SignatureComponent = ({ onSave }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOK = (signature) => {
    if (onSave) {
      onSave(signature); // Salva a assinatura
    } else {
      console.warn("A função onSave não foi passada como prop.");
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Botão para abrir a assinatura */}
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} 
        style={styles.signatureBox}
        activeOpacity={0.7}
      >
        <Text style={styles.text}>Toque para assinar</Text>
      </TouchableOpacity>

      {/* Modal para exibir a assinatura */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Signature
              onOK={handleOK} 
              onClear={() => console.log("Assinatura limpa")}
              onEmpty={() => console.log("Sem assinatura")}
              descriptionText="Assine aqui"
              clearText="Limpar"
              confirmText="Salvar"
              webStyle={styles.signatureCanvas}
            />
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  signatureBox: { 
    height: 100, 
    width: "80%",
    borderWidth: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
  },
  text: { 
    color: "#000", 
    fontSize: 16 
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { 
    width: "100%", 
    height: "100%", 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 10, 
    alignItems: "center",
  },
  signatureCanvas: `
    .m-signature-pad--footer { 
      display: flex; 
    }
  `
});

export default SignatureComponent;
