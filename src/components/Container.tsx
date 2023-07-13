import { FC, ReactNode } from 'react'
import { View, ScrollView, ScrollViewProps } from 'react-native'

const defaultStyle = {
  padding: 25,
  flex: 1
}

type ContainerProps = ScrollViewProps & {
  children: ReactNode
  scroll?: boolean;
  style?: object;
}

const Container: FC<ContainerProps> = ({ children, scroll, style, ...rest }) => {
  const Component = scroll ? ScrollView : View
  return <Component style={style ? [style, defaultStyle] : defaultStyle} {...rest}>{children}</Component>
}


export default Container
