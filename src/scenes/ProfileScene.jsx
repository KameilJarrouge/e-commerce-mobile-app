import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { ErrorPage } from "../components";
import { COLORS } from "../constants/colors";
import { FONT_FAMILY, FONT_SIZE } from "../constants/fonts";
import { Avatar, Text } from "../core-ui";
import { useAuth } from "../helpers/useAuth";
import { useGetAuthenticatedUser } from "../hooks/api/useAuthenticatedUser";
import { useDeactivateCustomerToken } from "../hooks/api/useCustomer";
import { useGetShop } from "../hooks/api/useCustomerAddress";
import { useResetCart } from "../hooks/api/useShoppingCart";
import { useTranslation } from "react-i18next";

export default function ProfileScene() {
  let { navigate } = useNavigation();
  let { authToken, setAuthToken } = useAuth();
  let { data } = useGetShop();
  const { t, i18n } = useTranslation();

  let { resetShoppingCart } = useResetCart();

  let {
    data: authenticatedUser,
    error: getAuthenticatedUserError,
    loading: getAuthenticatedUserLoading,
    refetch: getAuthenticatedUserRefetch,
  } = useGetAuthenticatedUser();

  let { deactivateCustomerToken } = useDeactivateCustomerToken({
    variables: { customerAccessToken: authToken },
    onCompleted: () => onLogout(),
  });

  if (getAuthenticatedUserError) {
    return <ErrorPage onRetry={getAuthenticatedUserRefetch} />;
  }

  if (getAuthenticatedUserLoading || !authenticatedUser?.authenticatedUser.id) {
    return <ActivityIndicator style={styles.centered} />;
  }

  let onLogout = () => {
    setAuthToken("");
    navigate("HomeTab");
  };

  let { email, firstName, lastName } = authenticatedUser.authenticatedUser;
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={[
          styles.profileContainer,
          // uncomment to align the profile to the right
          // note: it doesn't look good on the right :)
          // { flexDirection: "row-reverse", gap: 5 },
        ]}
        onPress={() =>
          navigate("EditProfile", { customerAccessToken: authToken })
        }
      >
        <Avatar firstName={firstName} lastName={lastName} size={84} />
        <View style={styles.profile}>
          <Text style={styles.nameTextStyle}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.emailTextStyle}>{email}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={[
          styles.menuContainer,
          styles.divider,
          i18n.language === "ar" && { alignItems: "flex-end" },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigate("EditProfile", { customerAccessToken: authToken })
          }
        >
          <Text style={styles.buttonLabelStyle}>
            {t("ProfileScene.Edit Profile")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigate("AddressManagement", { customerAccessToken: authToken })
          }
        >
          <Text style={styles.buttonLabelStyle}>
            {t("ProfileScene.Manage Addresses")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigate("OrderHistory", { customerAccessToken: authToken })
          }
        >
          <Text style={styles.buttonLabelStyle}>
            {t("ProfileScene.Order History")}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.buttonLabelStyle}>
            {t("ProfileScene.About Us")}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigate("WebView", {
              webUrl: data?.shop.termsOfService?.url,
              type: "terms",
            });
          }}
        >
          <Text style={styles.buttonLabelStyle}>
            {t("ProfileScene.Terms & Conditions")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigate("WebView", {
              webUrl: data?.shop.privacyPolicy?.url,
              type: "policy",
            });
          }}
        >
          <Text style={styles.buttonLabelStyle}>
            {t("ProfileScene.Privacy & Policy")}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.menuContainer,
          i18n.language === "ar" && { alignItems: "flex-end" },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={async () => {
            await resetShoppingCart();
            deactivateCustomerToken();
          }}
        >
          <Text style={[styles.buttonLabelStyle, styles.redTextColor]}>
            {t("ProfileScene.Log Out")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: "row",
    padding: 24,
  },
  profile: {
    justifyContent: "center",
    paddingLeft: 16,
  },
  menuContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGrey,
  },
  buttonLabelStyle: {
    fontSize: FONT_SIZE.medium,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
  redTextColor: {
    color: COLORS.red,
  },
  menuItem: {
    marginVertical: 12,
  },
  nameTextStyle: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 6,
  },
  emailTextStyle: {
    opacity: 0.6,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
