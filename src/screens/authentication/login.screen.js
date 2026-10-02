import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { AuthenticationContext } from "../../services/authentication/authentication.context";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, isLoading, error } = useContext(AuthenticationContext);


  return (
    <View style={styles.container}>
      <Image
          source={require('../../../assets/Logo.png')}
          style={{width: 100, height: 100, marginTop: 117}}
        />
      <Text style={{fontSize: 32, color: "#688A6F",fontWeight: "700", marginTop: 50, marginBottom: 50}}>Log in</Text>

      <View>
      <Text style={{marginBottom: 10}}>E-mail</Text>
      <TextInput
        style={styles.input}
        label="E-mail"
        value={email}
        placeholder="Write your email here"
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

      <Pressable style={styles.nav_button} onPress={() => onLogin(email, password)}>
        <Text style={{ color: "white", fontWeight: "800" }}>Login</Text>
      </Pressable>

      <View style={styles.signUpContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.text}>
              Not a user?{" "}
              <Text style={styles.sign}>Sign Up</Text>
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

  signUpContainer:{
    alignItems: "center",
    marginTop: 10
  },

  sign:{
    color: "#005BFF",
    textDecorationLine: "underline"
  }
});