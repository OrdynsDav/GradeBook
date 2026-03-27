import { ActivityIndicator, View, StyleSheet } from "react-native"
import { ScreenContainer } from "../layout"
import { Typography } from "../typography"
import { spacing, Theme } from "@shared/config"

export const Loader = ({theme, title}: {theme: Theme, title?: string}) => {
    return (
        <ScreenContainer>
            <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
                <Typography variant="body2" color="secondary">{title !== '' ? title : 'Загрузка...'}</Typography>
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
      },
})