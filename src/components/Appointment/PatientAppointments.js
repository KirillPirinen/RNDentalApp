import styled from 'styled-components/native'
import { Foundation, Ionicons } from '@expo/vector-icons'
import { Text } from 'react-native-paper'
import { Badge, Container } from '../'

export const PatientAppointment = () => (
    <Container>
          <AppointmentCard>
            <AppointmentCardRow>
              <Ionicons name="md-medical" size={16} color="#A3A3A3" />
              <AppointmentCardLabel>
                Зуб:{' '}
                <Text style={{ fontWeight: '600' }}>
                  32
                </Text>
              </AppointmentCardLabel>
            </AppointmentCardRow>
            <AppointmentCardRow>
              <Foundation
                name="clipboard-notes"
                size={16}
                color="#A3A3A3"
              />
              <AppointmentCardLabel>
                Диагноз:{' '}
                <Text style={{ fontWeight: '600' }}>
                  чет полечила
                </Text>
              </AppointmentCardLabel>
            </AppointmentCardRow>
            <AppointmentCardRow
              style={{ marginTop: 15, justifyContent: 'space-between' }}
            >
              <Badge style={{ width: 155 }} active>
                11 июля
              </Badge>
              <Badge color="green">3 500 Р</Badge>
            </AppointmentCardRow>
          </AppointmentCard>
    </Container>
)

const AppointmentCardLabel = styled.Text`
  font-size: 16px;
  margin-left: 10px;
`;

const AppointmentCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 3.5px;
  margin-bottom: 3.5px;
`;

const AppointmentCard = styled.View`
  shadow-color: gray;
  elevation: 0.5;
  shadow-opacity: 0.4;
  shadow-radius: 10;
  padding: 20px 25px;
  border-radius: 10px;
  background: white;
  margin-bottom: 20px;
`;
