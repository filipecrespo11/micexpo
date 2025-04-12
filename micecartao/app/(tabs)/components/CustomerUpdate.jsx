import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, SafeAreaView } from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';
const API_URL = "https://micelania-app.onrender.com/customers";
const CustomerUpdate = () => {
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    purchaseDate: "",
    returnDate: "",
    observation: "",
    signature: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const signatureRef = useRef(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get(`http://172.16.76.255:5000/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(response.data);
        if (response.data.signature) {
          signatureRef.current.injectJavaScript(`
            signaturePad.fromDataURL("${response.data.signature}");
            true;
          `);
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (name, value) => {
    setCustomer({ ...customer, [name]: value });
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.injectJavaScript(`signaturePad.clear(); true;`);
      setCustomer({ ...customer, signature: "" });
    } else {
      console.error("WebView não está pronto para limpar a assinatura.");
      Alert.alert("Erro", "O campo de assinatura não está pronto. Tente novamente.");
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.injectJavaScript(`
        if (typeof signaturePad !== 'undefined' && signaturePad) {
          const dataUrl = signaturePad.toDataURL();
          if (dataUrl) {
            window.ReactNativeWebView.postMessage(dataUrl);
          } else {
            window.ReactNativeWebView.postMessage('Erro: Assinatura vazia ou inválida');
          }
        } else {
          window.ReactNativeWebView.postMessage('Erro: SignaturePad não inicializado');
        }
        true;
      `);
    } else {
      console.error("WebView não está pronto para salvar a assinatura.");
      Alert.alert("Erro", "O campo de assinatura não está pronto. Tente novamente.");
    }
  };

  const handleSubmit = async () => {
    const token = await SecureStore.getItemAsync("token");
    try {
      await axios.put(`http://172.16.76.255:5000/customers/${id}`, {
        ...customer,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Cliente atualizado com sucesso!");
      navigation.navigate("CustomerList");
    } catch (error) {
      setErrorMessage("Erro ao atualizar cliente: " + error.message);
      console.error(error);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </head>
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
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <View>
        <Text style={styles.heading}>Atualizar Cliente</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={customer.name}
          onChangeText={(value) => handleChange("name", value)}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={customer.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={customer.phone}
          onChangeText={(value) => handleChange("phone", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={customer.cpf}
          onChangeText={(value) => handleChange("cpf", value)}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Data da Compra"
          value={customer.purchaseDate}
          onChangeText={(value) => handleChange("purchaseDate", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Devolução"
          value={customer.returnDate}
          onChangeText={(value) => handleChange("returnDate", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Observação"
          value={customer.observation}
          onChangeText={(value) => handleChange("observation", value)}
        />
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureLabel}>Assinatura:</Text>
          <WebView
            ref={signatureRef}
            source={{ html: htmlContent }}
            style={styles.signatureCanvas}
            onMessage={(event) => {
              const message = event.nativeEvent.data;
              if (message.startsWith('data:image/')) {
                setCustomer({ ...customer, signature: message });
                Alert.alert("Sucesso", "Assinatura salva com sucesso!");
              } else if (message.startsWith('Erro:')) {
                Alert.alert("Erro", message.replace('Erro: ', ''));
              }
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <View style={styles.signatureButtons}>
            <Button title="Limpar Assinatura" onPress={handleClearSignature} />
            <Button title="Salvar Assinatura" onPress={handleSaveSignature} />
          </View>
        </View>
        <Button title="Atualizar Cliente" onPress={handleSubmit} />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  signatureContainer: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  signatureCanvas: {
    width: 300,
    height: 100,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  signatureButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default CustomerUpdate;