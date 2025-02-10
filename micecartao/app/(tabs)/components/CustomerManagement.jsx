import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform } from "react-native";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';

let Signature;
if (Platform.OS === 'web') {
  Signature = require('react-signature-canvas').default;
} else {
  Signature = require('react-native-signature-canvas').default;
}

const CustomerManagement = () => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    purchaseDate: new Date(),
    returnDate: new Date(),
    password: "",
    observation: "",
    signature: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openPurchaseDatePicker, setOpenPurchaseDatePicker] = useState(false);
  const [openReturnDatePicker, setOpenReturnDatePicker] = useState(false);
  const signatureRef = useRef(null);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleClearSignature = () => {
    if (Platform.OS === 'web') {
      signatureRef.current.clear();
    } else {
      signatureRef.current.clearSignature();
    }
    setNewCustomer({ ...newCustomer, signature: "" });
  };

  const handleSignature = () => {
    if (Platform.OS === 'web') {
      setNewCustomer({ ...newCustomer, signature: signatureRef.current.getTrimmedCanvas().toDataURL('image/png') });
    } else {
      signatureRef.current.readSignature();
    }
  };

  const addCustomer = async () => {
    if (!cpfValidator.isValid(newCustomer.cpf)) {
      setErrorMessage("CPF inválido.");
      return;
    }

    const customerData = { ...newCustomer };

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post("http://192.168.1.7:5000/customers", customerData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        Alert.alert("Cliente adicionado com sucesso!");
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          cpf: "",
          purchaseDate: new Date(),
          returnDate: new Date(),
          password: "",
          observation: "",
          signature: "",
        });
        setErrorMessage("");
        handleClearSignature();
      }
    } catch (error) {
      setErrorMessage("Erro ao adicionar cliente: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Gerenciamento de Clientes</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={newCustomer.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={newCustomer.email}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={newCustomer.phone}
        onChangeText={(value) => handleChange("phone", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={newCustomer.cpf}
        onChangeText={(value) => handleChange("cpf", value)}
      />
      <Button title="Selecionar Data da Compra" onPress={() => setOpenPurchaseDatePicker(true)} />
      <Text>Data da Compra: {newCustomer.purchaseDate.toLocaleDateString()}</Text>
      <Button title="Selecionar Data de Devolução" onPress={() => setOpenReturnDatePicker(true)} />
      <Text>Data de Devolução: {newCustomer.returnDate.toLocaleDateString()}</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={newCustomer.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Observação"
        value={newCustomer.observation}
        onChangeText={(value) => handleChange("observation", value)}
      />
      <View style={styles.signatureContainer}>
        <Signature
          ref={signatureRef}
          onEnd={handleSignature}
          onClear={handleClearSignature}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={`
            .m-signature-pad--footer {
              display: none;
              margin: 0px;
            }
          `}
        />
      </View>
      <Button title="Limpar Assinatura" onPress={handleClearSignature} />
      <Button title="Adicionar Cliente" onPress={addCustomer} />
      <Button title="Ver Lista de Clientes" onPress={() => navigation.navigate("CustomerList")} />
      <DatePicker
        modal
        open={openPurchaseDatePicker}
        date={newCustomer.purchaseDate}
        onConfirm={(date) => {
          setOpenPurchaseDatePicker(false);
          handleChange("purchaseDate", date);
        }}
        onCancel={() => setOpenPurchaseDatePicker(false)}
      />
      <DatePicker
        modal
        open={openReturnDatePicker}
        date={newCustomer.returnDate}
        onConfirm={(date) => {
          setOpenReturnDatePicker(false);
          handleChange("returnDate", date);
        }}
        onCancel={() => setOpenReturnDatePicker(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
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
  signatureContainer: {
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});

export default CustomerManagement;