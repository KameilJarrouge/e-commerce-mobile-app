import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { lock } from "../../assets/images";
import { COLORS } from "../constants/colors";
import { defaultButton, defaultButtonLabel } from "../constants/theme";
import { Button, Text } from "../core-ui";
import { useTranslation } from "react-i18next";

export default function LockScene() {
  let { navigate, setOptions } = useNavigation();
  let { isRTL } = useTheme();
  // useEffect(() => {
  //   setOptions({
  //     headerLeft: () => (
  //       <IconButton
  //         icon={isRTL ? "chevron-right" : "chevron-left"}
  //         color={COLORS.primaryColor}
  //         size={24}
  //         onPress={() => navigate("Home")}
  //       />
  //     ),
  //   });
  // });
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.scene}>
      <View style={styles.imageContainer}>
        <Image source={lock} style={styles.image} />
        <Text style={styles.descriptionText}>
          {t(
            "LockScene.Hey there! To continue please log in or create an account."
          )}
        </Text>
      </View>
      <Button
        style={[defaultButton, styles.buttonMargin]}
        labelStyle={defaultButtonLabel}
        onPress={() => {
          navigate("Auth", { initialRouteKey: "Register" });
        }}
      >
        {t("LockScene.Register")}
      </Button>
      <View
        style={[
          styles.flexRow,
          {
            flexDirection: t("dir") === "ltr" ? "row" : "row-reverse",
            gap: "2px",
          },
        ]}
      >
        <Text>{t("LockScene.Already have an account?")}</Text>
        <TouchableOpacity
          onPress={() => navigate("Auth", { initialRouteKey: "Login" })}
        >
          <Text style={styles.loginText} weight="medium">
            {t("LockScene.Log In")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    maxWidth: 240,
    maxHeight: 180,
  },
  descriptionText: {
    textAlign: "center",
    marginTop: 24,
    lineHeight: 24,
    opacity: 0.6,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  loginText: {
    color: COLORS.primaryColor,
  },
  buttonMargin: {
    marginHorizontal: 24,
  },
});
