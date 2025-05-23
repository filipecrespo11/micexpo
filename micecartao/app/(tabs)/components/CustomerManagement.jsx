import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, SafeAreaView, SafeAreaViewBase } from "react-native";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { WebView } from "react-native-webview";
import SignatureComponent from "./SignatureComponent";

// URL do servidor (mude para o endereço real)
const API_URL = "https://micelania-app.onrender.com/customers";

const CustomerManagement = () => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    purchaseDate: "",
    delivery: false,
    returnDate: "",
    password: "",
    observation: "",
    signature: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const signatureRef = useRef(null);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      setTimeout(() => {
        signatureRef.current.injectJavaScript(`signaturePad.clear(); true;`);
      }, 500);
      setNewCustomer({ ...newCustomer, signature: "" });
    } else {
      Alert.alert("Erro", "O campo de assinatura não está pronto. Tente novamente.");
    }
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.injectJavaScript(`
        if (typeof signaturePad !== 'undefined' && signaturePad) {
          const dataUrl = signaturePad.toDataURL();
          window.ReactNativeWebView.postMessage(dataUrl);
        } else {
          window.ReactNativeWebView.postMessage('Erro: SignaturePad não inicializado');
        }
        true;
      `);
    } else {
      Alert.alert("Erro", "O campo de assinatura não está pronto. Tente novamente.");
    }
  };

  const addCustomer = async () => {
    // Remover caracteres não numéricos do CPF antes da validação
    const cleanedCpf = newCustomer.cpf.replace(/\D/g, "");

    if (!cpfValidator.isValid(cleanedCpf)) {
      setErrorMessage("CPF inválido.");
      return;
    }

    const token = await SecureStore.getItemAsync("token");
    const customerData = { ...newCustomer, cpf: cleanedCpf };

    try {
      const response = await axios.post(API_URL, customerData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        Alert.alert("Cliente adicionado com sucesso!");
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          cpf: "",
          purchaseDate: "",
          delivery: false,
          returnDate: "",
          password: "",
          observation: "",
          signature: "",
        });
        setErrorMessage("");
        handleClearSignature();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao adicionar cliente: " + (error.response?.data?.message || error.message));
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <View style={{minHeight: 1000}}>
        <Text style={styles.heading}>Gerenciamento de Clientes</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <TextInput style={styles.input} placeholder="Nome" value={newCustomer.name} onChangeText={(value) => handleChange("name", value)} />
        <TextInput style={styles.input} placeholder="Email" value={newCustomer.email} onChangeText={(value) => handleChange("email", value)} />
        <TextInput style={styles.input} placeholder="Telefone" value={newCustomer.phone} onChangeText={(value) => handleChange("phone", value)} />
        <TextInput style={styles.input} placeholder="CPF" value={newCustomer.cpf} onChangeText={(value) => handleChange("cpf", value)} />
        <TextInput style={styles.input} placeholder="Data da Compra" value={newCustomer.purchaseDate} onChangeText={(value) => handleChange("purchaseDate", value)} />
        <TextInput style={styles.input} placeholder="Data de Devolução" value={newCustomer.returnDate} onChangeText={(value) => handleChange("returnDate", value)} />
        <TextInput style={styles.input} placeholder="Senha" value={newCustomer.password} onChangeText={(value) => handleChange("password", value)} secureTextEntry />
        <TextInput style={styles.input} placeholder="Observação" value={newCustomer.observation} onChangeText={(value) => handleChange("observation", value)} />
          
        <SignatureComponent style={styles.signatureCanvas} /> 
        
        <Button title="Adicionar Cliente" onPress={addCustomer} />
        <Button title="Ver Lista de Clientes" onPress={() => navigation.navigate("CustomerList")} />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 40 },
  heading: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { height: 40, borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
  error: { color: "red", marginBottom: 20 },
  signatureButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});

export default CustomerManagement;
