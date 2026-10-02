import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useState, useContext } from "react";
import { AuthenticationContext } from "../../services/authentication/authentication.context";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const { onRegister, isLoading, error } = useContext(AuthenticationContext);

  return (
    <View style={styles.container}>

      <Image
          source={require('../../../assets/Logo.png')}
          style={{width: 100, height: 100, marginTop: 117}}
      />
      <Text style={{fontSize: 32, color: "#688A6F",fontWeight: "700", marginTop: 50, marginBottom: 50}}>Sign Up</Text>
      
      <View>
      <Text style={{marginBottom: 10}}>E-mail</Text>
      <TextInput
        style={styles.input}
        label="E-mail"
        value={email}
        placeholder="type your email here"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(user) => setEmail(user)}
      />

      <Text style={{marginBottom: 10}}>Password</Text>
       <TextInput
        style={styles.input}
        label="Password"
        value={password}
        placeholder="type your password here"
        textContentType="password"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={(pass) => setPassword(pass)}
      />

      <Text style={{marginBottom: 10}}>Repeat password</Text>
      <TextInput
        style={styles.input}
        label="Repeat Password"
        value={repeatedPassword}
        placeholder="repeat your password here"
        textContentType="password"
        secureTextEntry
        autoCapitalize="none"
        onChangeText={(pass) => setRepeatedPassword(pass)}
      />
      <Pressable style={styles.nav_button} onPress={() => onRegister(email, password, repeatedPassword)}>
        <Text style={{ color: "white", fontWeight: "800" }}>Sign Up</Text>
      </Pressable>

      <View style={styles.signUpContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.text}>
              Already a user?{" "}
              <Text style={styles.sign}>Log in</Text>
            </Text>
      </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe2d9",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  nav_button: {
    backgroundColor: "#688A6F",
    width: 100,
    marginLeft: 70,
    height: 37,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    color: "white",
    marginTop: 20
  },
  input: {
    backgroundColor: "white",
    width: 256,
    height: 51,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20
  },

  sign:{
    color: "#005BFF",
    textDecorationLine: "underline",
  },

  
  signUpContainer:{
    alignItems: "center",
    marginTop: 10
  },

});