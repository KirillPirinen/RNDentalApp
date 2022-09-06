import { Text, Dialog, Button as PaperButton } from 'react-native-paper'

export const Confirm = ({ title, question, onClose, visible, children }) => (
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

export const ConfirmDelete = ({  title, visible, question, onClose, onDelete }) => (
      <Confirm 
        visible={visible} 
        title={title}
        question={question}
        onClose={onClose}
        
      > 
        <PaperButton
          icon="delete"
          textColor="red"
          size={30}
          onPress={onDelete}
        > 
          Удалить 
        </PaperButton>
        <PaperButton
          icon="window-close"
          textColor="gray"
          size={30}
          onPress={onClose}
        > 
          Отмена
        </PaperButton>
      </Confirm>
)
