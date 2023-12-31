import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { errorImage, successImage } from "../../assets/images";
import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import { Button, Text } from "../core-ui";
import { useTranslation } from "react-i18next";

export default function ModalBottomSheetMessage(props) {
  let { isError, message, onPressModalButton, buttonText } = props;
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.iconContainer}>
        {isError ? (
          <Image source={errorImage} style={styles.image} />
        ) : (
          <Image source={successImage} style={styles.image} />
        )}
      </View>
      <Text style={styles.message}>{message}</Text>
      {onPressModalButton ? (
        <Button style={styles.buttonStyle} onPress={onPressModalButton}>
          <Text weight="medium" style={styles.buttonText}>
            {buttonText ? buttonText : t("ModalBottomSheetMessage.Close")}
          </Text>
        </Button>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 84,
    height: 84,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  textInput: {
    marginTop: 8,
  },
  message: {
    textAlign: "center",
  },
  buttonStyle: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: "uppercase",
  },
});
