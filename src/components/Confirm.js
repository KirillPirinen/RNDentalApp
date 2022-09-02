import { Paragraph, Dialog, Button as PaperButton } from 'react-native-paper'

export const Confirm = ({ title, question, onClose, visible, children }) => (
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{question}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          {children}
        </Dialog.Actions>
      </Dialog>
  )

export const ConfirmDelete = ({  title, visible, question, onClose, onDelete }) => (
      <Confirm 
        visible={visible} 
        title={title}
        question={question}
        onClose={onClose}
      > 
        <PaperButton
          icon="delete"
          color="red"
          size={30}
          onPress={onDelete}
          style={{ padding: 0 }}
        > 
          удалить 
        </PaperButton>
        <PaperButton
          icon="window-close"
          color="gray"
          size={30}
          onPress={onClose}
          style={{ padding: 0 }}
        > 
          отмена
        </PaperButton>
      </Confirm>
)
