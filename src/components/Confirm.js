import { Paragraph, Dialog, Portal } from 'react-native-paper'

export const Confirm = ({ title, question, onClose, visible, children }) => (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{question}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          {children}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
