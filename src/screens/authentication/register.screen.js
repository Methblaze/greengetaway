// Matches the login screen: visible labels, no instructions in placeholders,
// a full-width primary action, and a way back in the brand's accessible green.
import React, { useContext, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { space } from "../../theme/tokens";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/Button";
import { DemoNote } from "../../components/DemoNote";
import { AuthLayout, ErrorText } from "./login.screen";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const { onRegister, isLoading, error, clearError } = useContext(AuthenticationContext);
  const passwordRef = useRef(null);
  const repeatRef = useRef(null);

  const submit = () => onRegister(email, password, repeatedPassword);
  // The error lives in the shared auth context, so clear it on the way out
  // or Login would show Register's message.
  const goToLogin = () => {
    clearError();
    navigation.navigate("Login");
  };

  return (
    <AuthLayout title="Create an account">
      <DemoNote style={styles.demo} />
      <TextField
        id="register-email"
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
        inputMode="email"
        textContentType="emailAddress"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
      />
      <TextField
        ref={passwordRef}
        id="register-password"
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => repeatRef.current && repeatRef.current.focus()}
      />
      <TextField
        ref={repeatRef}
        id="register-repeat"
        label="Repeat password"
        value={repeatedPassword}
        onChangeText={setRepeatedPassword}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        autoCapitalize="none"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <ErrorText error={error} />
      <Button title={isLoading ? "Creating your account…" : "Create account"} onPress={submit} disabled={isLoading} style={styles.primary} />
      <Button title="I already have an account" variant="secondary" onPress={goToLogin} style={styles.secondary} />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  demo: { marginTop: space.lg },
  primary: { marginTop: space.xl },
  secondary: { marginTop: space.sm },
});
