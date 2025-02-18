import React, { useState, useRef } from "react";
import { Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform } from "react-native";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

let Signature;
let WebDatePicker;
if (Platform.OS === 'web') {
  Signature = require('react-signature-canvas').default;
  WebDatePicker = require('react-datepicker').default;
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
  };

  const handleSubmit = async () => {
    try {
      if (!cpfValidator.isValid(newCustomer.cpf)) {
        setErrorMessage("CPF inválido");
        return;
      }

<<<<<<< HEAD
      const response = await axios.post('https://localhost:5000/customers', newCustomer);
=======
      const response = await axios.post('http://localhost:5000/customers', newCustomer);
>>>>>>> eeed1c0e0e57c8fcdb73dd690ab0991673afb00f
      if (response.status === 200) {
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
        Alert.alert("Sucesso", "Cliente adicionado com sucesso");
      }
    } catch (error) {
      setErrorMessage("Erro ao adicionar cliente: " + error.message);
      console.log("Detalhes do erro:", error.response ? error.response.data : error.message);
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
      {Platform.OS === 'web' ? (
        <>
          <Text>Data de Compra</Text>
          <WebDatePicker
            selected={newCustomer.purchaseDate}
            onChange={(date) => handleChange('purchaseDate', date)}
            dateFormat="dd/MM/yyyy"
          />
          <Text>Data de Devolução</Text>
          <WebDatePicker
            selected={newCustomer.returnDate}
            onChange={(date) => handleChange('returnDate', date)}
            dateFormat="dd/MM/yyyy"
          />
        </>
      ) : (
        <>
          <Button title="Selecionar Data de Compra" onPress={() => setOpenPurchaseDatePicker(true)} />
          <Button title="Selecionar Data de Devolução" onPress={() => setOpenReturnDatePicker(true)} />
          <DatePicker
            modal
            open={openPurchaseDatePicker}
            date={newCustomer.purchaseDate}
            onConfirm={(date) => {
              setOpenPurchaseDatePicker(false);
              handleChange('purchaseDate', date);
            }}
            onCancel={() => {
              setOpenPurchaseDatePicker(false);
            }}
            mode="date"
            locale="pt-BR"
          />
          <DatePicker
            modal
            open={openReturnDatePicker}
            date={newCustomer.returnDate}
            onConfirm={(date) => {
              setOpenReturnDatePicker(false);
              handleChange('returnDate', date);
            }}
            onCancel={() => {
              setOpenReturnDatePicker(false);
            }}
            mode="date"
            locale="pt-BR"
          />
        </>
      )}
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
      <Signature
        ref={signatureRef}
        onOK={(img) => handleChange("signature", img)}
        onEmpty={() => setErrorMessage("Assinatura é obrigatória")}
        descriptionText="Assine aqui"
        clearText="Limpar"
        confirmText="Salvar"
        webStyle={`.m-signature-pad--footer { display: none; }`}
      />
      <Button title="Limpar Assinatura" onPress={handleClearSignature} />
      <Button title="Adicionar Cliente" onPress={handleSubmit} />
      <Button title="Ver Lista de Clientes" onPress={() => navigation.navigate("CustomerList")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    flex: 1,
    margin:"auto",
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CustomerManagement;


