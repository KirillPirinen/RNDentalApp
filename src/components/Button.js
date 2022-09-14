import React, { useState } from 'react'
import styled from 'styled-components/native'
import { StyleSheet, SafeAreaView } from 'react-native'
import { AnimatedFAB } from 'react-native-paper'

const Button = ({ children, color, onPress }) => (
  <ButtonWrapper onPress={onPress} color={color}>
    <ButtonText>{children}</ButtonText>
  </ButtonWrapper>
);

Button.defaultProps = {
  color: '#2a86ff',
}

const ButtonWrapper = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background: ${props => props.color};
  height: 45px;
`

const ButtonText = styled.Text`
  color: white;
  font-weight: 400;
  font-size: 16px;
`

export default Button;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
  },
});
