// In 2023 the placeholders gave instructions ("Write your email here"), the
// Login button was a small 100 wide pill, the title was brand green on beige
// at 3.01:1, and "Sign Up" was default blue. Errors were stored but never
// shown.
import React, { useContext, useRef, useState } from "react";
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { friendlyAuthError } from "../../services/authentication/friendlyError";
import { colors, fonts, space, type } from "../../theme/tokens";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/Button";
import { DemoNote } from "../../components/DemoNote";

export const AuthLayout = ({ title, children }) => (
  <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.brandRow}>
            <Image source={require("../../../assets/Logo.png")} style={styles.logo} accessibilityIgnoresInvertColors />
            <Text style={styles.brand}>GreenGetaway</Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export const ErrorText = ({ error }) => {
  const message = friendlyAuthError(error);
  if (!message) return null;
  return (
    <Text style={styles.error} accessibilityLiveRegion="polite" aria-live="polite" role="alert">
      {message}
    </Text>
  );
};

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, isLoading, error, clearError } = useContext(AuthenticationContext);
  const passwordRef = useRef(null);

  const submit = () => onLogin(email, password);
  // The error lives in the shared auth context, so clear it on the way out
  // or Register would show Login's message.
  const goToRegister = () => {
    clearError();
    navigation.navigate("Register");
  };

  return (
    <AuthLayout title="Log in">
      <DemoNote style={styles.demo} />
      <TextField
        id="login-email"
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
        id="login-password"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        autoComplete="current-password"
        autoCapitalize="none"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <ErrorText error={error} />
      <Button title={isLoading ? "Logging in…" : "Log in"} onPress={submit} disabled={isLoading} style={styles.primary} />
      <Button title="Create an account" variant="secondary" onPress={goToRegister} style={styles.secondary} />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: space.lg, paddingVertical: space.xxl },
  form: { width: "100%", maxWidth: 400, alignSelf: "center" },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 32, height: 32, marginRight: space.sm },
  brand: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24, color: colors.ink },
  title: { ...type.title, marginTop: space.xl },
  demo: { marginTop: space.lg },
  error: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.band.high, marginTop: space.md },
  primary: { marginTop: space.xl },
  secondary: { marginTop: space.sm },
});
