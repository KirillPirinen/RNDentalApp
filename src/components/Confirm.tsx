import { FC, ReactNode } from 'react';
import { Text, Dialog, Button as PaperButton, useTheme } from 'react-native-paper'

export type ConfirmProps = {
  title: string;
  question: string;
  onClose: () => void;
  visible: boolean;
  children: ReactNode;
}

export const Confirm: FC<ConfirmProps> = ({ title, question, onClose, visible, children }) => (
    <Dialog 
      visible={visible}
      onDismiss={onClose}
      style={{ backgroundColor: 'white' }}
    >
      <Dialog.Title>
        <Text variant="titleLarge">{title}</Text>
      </Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{question}</Text>
      </Dialog.Content>
      <Dialog.Actions style={{ flexWrap:'wrap' }}>
        {children}
      </Dialog.Actions>
    </Dialog>
)

export const ConfirmDelete: FC<ConfirmProps & { onDelete: () => void }> = ({ title, visible, question, onClose, onDelete }) => {
  const theme = useTheme()
  return (
    <Confirm 
      visible={visible} 
      title={title}
      question={question}
      onClose={onClose}
      
    > 
      <PaperButton
        icon="delete"
        textColor={theme.colors.error}
        onPress={onDelete}
      > 
        Удалить 
      </PaperButton>
      <PaperButton
        icon="window-close"
        textColor={theme.colors.backdrop}
        onPress={onClose}
      > 
        Отмена
      </PaperButton>
    </Confirm>
)
}
