import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput as TextInputType,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { ModalBottomSheetMessage } from "../components";
import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import {
  defaultButton,
  defaultButtonLabel,
  flatTextInputContainerStyle,
  flatTextInputStyle,
  textInputLabel,
} from "../constants/theme";
import { Button, ModalBottomSheet, Text, TextInput } from "../core-ui";
import { ScreenSize, useDimensions } from "../helpers/dimensions";
import { useAuth } from "../helpers/useAuth";
import { useSetAuthenticatedUser } from "../hooks/api/useAuthenticatedUser";
import {
  useCustomerCreateToken,
  useGetCustomerData,
} from "../hooks/api/useCustomer";
import { useSetShoppingCart } from "../hooks/api/useShoppingCart";
import { useTranslation } from "react-i18next";

export default function LoginScene() {
  let { navigate, reset } = useNavigation();
  let { setAuthToken } = useAuth();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [expiresDate, setExpiresDate] = useState("");
  let [errorMessage, setErrorMessage] = useState("");
  let [isModalVisible, setIsModalVisible] = useState(false);

  let emailRef = useRef(null);
  let passwordRef = useRef(null);

  let { screenSize } = useDimensions();

  let containerStyle = () => {
    let styleApplied;

    switch (screenSize) {
      case ScreenSize.Small: {
        styleApplied = styles.normal;
        break;
      }
      case ScreenSize.Medium: {
        styleApplied = styles.tabPortrait;
        break;
      }
      case ScreenSize.Large: {
        styleApplied = styles.landscape;
        break;
      }
    }
    return styleApplied;
  };

  let { setShoppingCart, loading: setShoppingCartLoading } =
    useSetShoppingCart();

  let { setUser, loading: setAuthenticatedUserLoading } =
    useSetAuthenticatedUser({
      onCompleted: () => {
        reset({
          index: 0,
          routes: [
            {
              name: "Home",
              state: {
                routes: [{ name: "ProfileTab" }],
              },
            },
          ],
        });
      },
    });

  let { createToken, loading: createTokenLoading } = useCustomerCreateToken({
    variables: { email, password },
    onCompleted: ({ customerAccessTokenCreate }) => {
      if (
        customerAccessTokenCreate &&
        customerAccessTokenCreate.customerAccessToken
      ) {
        let { accessToken, expiresAt } =
          customerAccessTokenCreate.customerAccessToken;
        setExpiresDate(expiresAt);
        setAuthToken(accessToken);
        login({ variables: { accessToken } });
      } else {
        setErrorMessage(t("LoginScene.Your email or password might be wrong!"));
        toggleModalVisible();
      }
    },
  });

  let { getCustomer: login, loading: getCustomerLoading } = useGetCustomerData({
    onCompleted: async ({ customer }) => {
      if (customer) {
        let { email, id, firstName, lastName, lastIncompleteCheckout } =
          customer;
        let items = [];
        if (lastIncompleteCheckout) {
          let { id: cartID } = lastIncompleteCheckout;
          items = lastIncompleteCheckout.lineItems.edges.map(({ node }) => {
            let { quantity, variant } = node;
            let variantId = "";
            if (variant) {
              variantId = variant.id;
            }
            return { quantity, variantId };
          });
          await setShoppingCart({ variables: { items, id: cartID } });
        }
        if (email && firstName && lastName) {
          setUser({
            variables: {
              user: {
                email,
                id,
                expiresAt: expiresDate,
                firstName,
                lastName,
              },
            },
          });
        }
      }
    },
  });

  let onSubmit = () => {
    createToken();
  };

  let isLoading =
    createTokenLoading ||
    getCustomerLoading ||
    setAuthenticatedUserLoading ||
    setShoppingCartLoading;

  let toggleModalVisible = () => setIsModalVisible(!isModalVisible);
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.flex}>
      <ModalBottomSheet
        title={t("LoginScene.Something went wrong!")}
        isModalVisible={isModalVisible}
        toggleModal={toggleModalVisible}
      >
        <ModalBottomSheetMessage
          isError={true}
          message={errorMessage}
          onPressModalButton={toggleModalVisible}
        />
      </ModalBottomSheet>
      <View style={[containerStyle(), styles.container]}>
        <View>
          <TextInput
            onSubmitEditing={() => {
              passwordRef.current && passwordRef.current.focus();
            }}
            returnKeyType="next"
            ref={emailRef}
            mode="flat"
            label={t("LoginScene.Email Address")}
            value={email}
            onChangeText={setEmail}
            labelStyle={textInputLabel}
            autoCapitalize="none"
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
          <TextInput
            returnKeyType="done"
            ref={passwordRef}
            label={t("LoginScene.Password")}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={true}
            mode="flat"
            labelStyle={textInputLabel}
            containerStyle={flatTextInputContainerStyle}
            style={flatTextInputStyle}
          />
          <TouchableOpacity
            style={styles.forgetPassword}
            onPress={() => navigate("ForgotPassword")}
          >
            <Text
              style={[styles.colorPrimary, styles.textSize]}
              weight="medium"
            >
              {t("LoginScene.Forgot Password?")}
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          loading={isLoading}
          style={defaultButton}
          labelStyle={defaultButtonLabel}
          onPress={onSubmit}
        >
          {!isLoading && t("LoginScene.Log in")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  forgetPassword: { alignSelf: "flex-end", marginTop: 24 },
  textSize: { fontSize: FONT_SIZE.medium },
  colorPrimary: { color: COLORS.primaryColor },
  normal: {
    paddingHorizontal: 24,
  },
  tabPortrait: {
    paddingHorizontal: 36,
  },
  landscape: {
    paddingHorizontal: 36,
  },
});
