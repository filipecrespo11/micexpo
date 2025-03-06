import React, { useRef } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { WebView } from 'react-native-webview';

const SignatureComponent = ({ onSave }) => {
  const signatureRef = useRef(null);

  const handleClearSignature = () => {
    signatureRef.current.injectJavaScript(`signaturePad.clear(); true;`);
  };

  const handleSaveSignature = () => {
    signatureRef.current.injectJavaScript(`
      window.ReactNativeWebView.postMessage(signaturePad.toDataURL());
      true;
    `);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="signature-pad" width="300" height="100" style="border: 1px solid black;"></canvas>
      <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>
      <script>
        var canvas = document.getElementById('signature-pad');
        var signaturePad = new SignaturePad(canvas);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={signatureRef}
        source={{ html: htmlContent }}
        style={styles.signatureCanvas}
        onMessage={(event) => onSave(event.nativeEvent.data)}
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
  signatureCanvas: {
    width: 300,
    height: 100,
    marginBottom: 20,
  },
});

export default SignatureComponent;