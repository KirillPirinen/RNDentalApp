import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  patientListWrapper: { paddingHorizontal: 25, paddingTop: 5 },
  pageWrapper: { zIndex: 100, },
  patientDetails: { maxHeight: 300, padding: 25 },
  formulaButtonView: { flex: 1 },
  patientButtons: { flexDirection: 'row', marginTop: 20 },
  nameWrapper: { flexShrink: 2 },
  patientFullname: {
    fontWeight:'800',
    fontSize: 24,
    lineHeight: 30,    
    marginBottom: 3
  },
  phoneListWrapper: { flexDirection: 'row', flexWrap:'wrap', justifyContent:'space-between' },
  metaWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  }
})
