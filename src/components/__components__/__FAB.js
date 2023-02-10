import * as React from 'react'
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  Text,
  Platform,
} from 'react-native'
import { 
  Surface, TouchableRipple, withTheme,
} from 'react-native-paper'
import Icon from 'react-native-paper/lib/commonjs/components/Icon'
import AnimatedText from 'react-native-paper/lib/commonjs/components/Typography/AnimatedText'
import { getCombinedStyles, getFABColors } from 'react-native-paper/lib/commonjs/components/FAB/utils'

const SIZE = 50

const AnimatedFAB = ({
  icon,
  label,
  accessibilityLabel = label,
  accessibilityState,
  color: customColor,
  disabled,
  onPress,
  onLongPress,
  theme,
  style,
  visible = true,
  uppercase = !theme.isV3,
  testID,
  animateFrom = 'right',
  extended = false,
  iconMode = 'dynamic',
  variant = 'primary',
  ...rest
}) => {

  const isIOS = Platform.OS === 'ios'
  const isAnimatedFromRight = animateFrom === 'right'
  const isIconStatic = iconMode === 'static'
  const { current: visibility } = React.useRef(
    new Animated.Value(visible ? 1 : 0)
  )
  const { current: animFAB } = React.useRef(
    new Animated.Value(0)
  )
  const { isV3, animation } = theme
  const { scale } = animation

  const [textWidth, setTextWidth] = React.useState(0)
  const [textHeight, setTextHeight] = React.useState(0)

  const borderRadius = SIZE / (isV3 ? 3.5 : 2)

  React.useEffect(() => {
    if (visible) {
      Animated.timing(visibility, {
        toValue: 1,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(visibility, {
        toValue: 0,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, scale, visibility])

  const { backgroundColor, foregroundColor, rippleColor } = getFABColors({
    theme,
    variant,
    disabled,
    customColor,
    style,
  })

  const extendedWidth = textWidth + SIZE + borderRadius

  const distance = isAnimatedFromRight ? -textWidth - borderRadius : textWidth + borderRadius

  React.useEffect(() => {
    Animated.timing(animFAB, {
      toValue: !extended ? 0 : distance,
      duration: 150 * scale,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start()

    if(!extended) {
      setTextWidth(0)
    }

  }, [animFAB, scale, distance, extended])

  const onTextLayout = ({
    nativeEvent,
  }) => {

    const currentWidth = Math.ceil(nativeEvent.lines[0].width)
    const currentHeight = Math.ceil(nativeEvent.lines[0].height)

    if (currentWidth !== textWidth || currentHeight !== textHeight) {
      setTextHeight(currentHeight)

      if (isIOS) {
        return setTextWidth(currentWidth - 12)
      }

      setTextWidth(extended ? currentWidth : 0)
    }

  }

  const propForDirection = (right) => {
    if (isAnimatedFromRight) {
      return right
    }

    return right.reverse()
  }

  const combinedStyles = getCombinedStyles({
    isAnimatedFromRight,
    isIconStatic,
    distance,
    animFAB,
  })

  const textStyle = {
    color: foregroundColor,
    ...(isV3 ? theme.typescale.labelLarge : theme.fonts.medium),
  }

  const md3Elevation = disabled || !isIOS ? 0 : 3

  return (
    <Surface
      {...rest}
      style={
        [{ opacity: visibility,
            transform: [
              {
                scale: visibility,
              },
            ],
            borderRadius},
          styles.container,
          style,
        ]
      }
      {...(isV3 && { elevation: md3Elevation })}
    >
      <Animated.View
        style={[
          styles.standard,
          { borderRadius },
        ]}
      >
        <View 
          style={[StyleSheet.absoluteFill, styles.shadowWrapper]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              disabled ? styles.disabled : styles.shadow,
              {
                width: extendedWidth,
                opacity: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0.9 * distance, 0]),
                  outputRange: propForDirection([1, 0.15, 0]),
                }),
                borderRadius,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              disabled ? styles.disabled : styles.shadow,
              {
                opacity: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0.9 * distance, 0]),
                  outputRange: propForDirection([0, 0.85, 1]),
                }),
                width: SIZE,
                borderRadius: animFAB.interpolate({
                  inputRange: propForDirection([distance, 0]),
                  outputRange: propForDirection([
                    SIZE / (extendedWidth / SIZE),
                    borderRadius,
                  ]),
                }),
              },
              combinedStyles.absoluteFill,
            ]}
          />
        </View>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.innerWrapper, { borderRadius }]}
        >
          <Animated.View
            style={[
              styles.standard,
              {
                width: extendedWidth,
                backgroundColor,
                borderRadius,
              },
              combinedStyles.innerWrapper,
            ]}
          >
            <TouchableRipple
              borderless
              onPress={onPress}
              onLongPress={onLongPress}
              rippleColor={rippleColor}
              disabled={disabled}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="button"
              accessibilityState={{ ...accessibilityState, disabled }}
              testID={testID}
              style={{ borderRadius }}
            >
              <View
                style={[
                  styles.standard,
                  {
                    width: extendedWidth,
                    borderRadius,
                  },
                ]}
              />
            </TouchableRipple>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[styles.iconWrapper, combinedStyles.iconWrapper]}
        pointerEvents="none"
      >
        <Icon source={icon} size={24} color={foregroundColor} />
      </Animated.View>

      <View pointerEvents="none">
        <AnimatedText
          variant="labelLarge"
          numberOfLines={1}
          onTextLayout={isIOS ? onTextLayout : undefined}
          ellipsizeMode={'tail'}
          style={[
            {
              [isAnimatedFromRight ? 'right' : 'left']: isIconStatic
                ? textWidth - SIZE + borderRadius
                : borderRadius,
            },
            {
              minWidth: !extended ? 0 : textWidth,
              top: -SIZE / 2 - textHeight / 2,
              opacity: animFAB.interpolate({
                inputRange: propForDirection([distance, 0.7 * distance, 0]),
                outputRange: propForDirection([1, 0, 0]),
              }),
              transform: [
                {
                  translateX: animFAB.interpolate({
                    inputRange: propForDirection([distance, 0]),
                    outputRange: propForDirection([0, SIZE]),
                  }),
                },
              ],
            },
            styles.label,
            uppercase && styles.uppercaseLabel,
            textStyle,
            !extended && styles.none
          ]}
        >
          {label}
        </AnimatedText>
      </View>

      {!isIOS && (
        <View 
          style={[styles.textPlaceholderContainer, !extended && styles.none]}
          pointerEvents="none"
        >
          <Text onTextLayout={onTextLayout}>{label}</Text>
        </View>
      )}
    </Surface>
  )
}

const styles = StyleSheet.create({
  none: { display: 'none', width: 0 },
  standard: {
    height: SIZE,
  },
  disabled: {
    elevation: 0,
  },
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  innerWrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  shadowWrapper: {
    elevation: 0,
  },
  shadow: {
    elevation: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    height: SIZE,
    width: SIZE,
  },
  label: {
    position: 'absolute',
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  textPlaceholderContainer: {
    height: 0,
    position: 'absolute',
  },
})

export default withTheme(AnimatedFAB)
