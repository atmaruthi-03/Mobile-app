import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Colors } from "../constants/Colors";

interface InputFieldProps extends TextInputProps {
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export default function InputField({ iconName, isPassword, ...props }: InputFieldProps) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
    <View style={styles.container}>
        <Ionicons name={iconName} size={24} color={Colors.textSecondary} style={styles.icon} />
        <TextInput
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
            secureTextEntry={isPassword && !showPassword}
            {...props}
        />
        {isPassword && (
            <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={Colors.textSecondary}
                style={styles.rightIcon}
                onPress={() => setShowPassword(!showPassword)}
                />
        )}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.inputBackground,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        marginBottom: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    icon:{
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.textPrimary,
    },
    rightIcon: {
        marginLeft: 10,
    },
});
