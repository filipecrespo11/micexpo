import React, { useRef } from "react";
import { View, Button, Platform, StyleSheet, Alert } from "react-native";

let Signature;
if (Platform.OS === 'web') {
  Signature = require('react-signature-canvas').default;
} else {
  Signature = require('react-native-signature-canvas').default;
}

const SignatureComponent = ({ onSave }) => {
  const signatureRef = useRef(null);

  const handleClearSignature = () => {
    if (Platform.OS === 'web') {
      signatureRef.current.clear();
    } else {
      signatureRef.current.clearSignature();
    }
  };

  const handleSaveSignature = () => {
    if (Platform.OS === 'web') {
      const signatureData = signatureRef.current.getTrimmedCanvas().toDataURL("image/png");
      onSave(signatureData);
      Alert.alert("Assinatura Salva!", "Sua assinatura foi salva com sucesso.");
    } else {
      signatureRef.current.readSignature();
    }
  };

  return (
    <View style={styles.container}>
      <Signature
        ref={signatureRef}
        onOK={(img) => onSave(img)}
        onEmpty={() => Alert.alert("Erro", "Assinatura é obrigatória")}
        descriptionText="Assine aqui"
        clearText="Limpar"
        confirmText="Salvar"
        webStyle={`.m-signature-pad--footer { display: none; }`}
      />
      <Button title="Limpar Assinatura" onPress={handleClearSignature} />
      <Button title="Salvar Assinatura" onPress={handleSaveSignature} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default SignatureComponent;
