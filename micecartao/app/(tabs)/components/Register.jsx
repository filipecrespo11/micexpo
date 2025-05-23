import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://micelania-app.onrender.com/auth/register", formData);
      Alert.alert("Usuário registrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro ao registrar usuário: " + error.message);
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Registrar Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={formData.username}
          onChangeText={(value) => handleChange("username", value)}
          required
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
          required
        />
        <Button title="Registrar" onPress={handleSubmit} />
        <Button title="Voltar ao Login" onPress={() => navigation.navigate("Login")} />
      </View>
    </ScrollView>
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
});

export default Register;