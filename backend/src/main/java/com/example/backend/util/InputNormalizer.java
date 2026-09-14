package com.example.backend.util;

public final class InputNormalizer {
    private InputNormalizer () {
    }

    public static String removeSpaces(String value) {
        if (value == null) {
            return null;
        }

        return value.replaceAll("[ \\u3000]", "");
    }
}
