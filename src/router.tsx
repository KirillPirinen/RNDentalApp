import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar, { AppHeaderProps } from './components/AppHeader'
import {
  Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient, ImportContacts, Settings, AddTemplate, TemplatesList, ConfirmAppointment, 
  DatabasesList, GroupList, AddGroup
} from './pages'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { Text } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TeethFormula from './pages/TeethFormula'
import { useGeneralControl } from './context/general-context'
import { useAppTheme } from './styles/themes'

const renderIcon = (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) => ({ color }: { color: string }) => (
  <MaterialCommunityIcons name={name} color={color} size={22} />
)

const renderHeader = (props: AppHeaderProps) => <CustomNavigationBar {...props} />

export const TabsName = {
  records: 'Записи',
  patients: 'Все пациенты',
  settings: 'Настройки',
}

const Icons = {
  records: renderIcon('calendar-check'),
  patients: renderIcon('account-injury'),
  settings: renderIcon('cog-outline'),
}

const Stack = createNativeStackNavigator()
const Tab = createMaterialBottomTabNavigator()

function BottomTabs () {
  const theme = useAppTheme()
  return (
      <Tab.Navigator
        sceneAnimationType="shifting"
        barStyle={{
          backgroundColor: theme.colors.primary,
          paddingTop: -2,
          paddingBottom: 4,
          maxHeight: 60
        }}
        activeColor="white"
        inactiveColor="white"
        /* @ts-ignore */
        renderLabel={({ focused, route }: { focused: boolean; route: { name: string } }) => (
            <Text
              variant="labelSmall"
              style={{
                textAlign: 'center',
                color: focused ? theme.colors.onPrimary : theme.colors.onSecondaryContainer,
                marginTop: -7
              }}
            >
            {route.name}
            </Text>
        )}
        shifting
      >
        <Tab.Screen
          name={TabsName.records}
          component={Appointments}
          options={{ tabBarIcon: Icons.records }}
        />
        <Tab.Screen
          name={TabsName.patients}
          component={PatientsList}
          options={{ tabBarIcon: Icons.patients }}
        />
        <Tab.Screen
          name={TabsName.settings}
          component={Settings}
          options={{ tabBarIcon: Icons.settings }}
        />
      </Tab.Navigator>
  )
}

const getEditTitle = (editTitle: string, defaultTitle: string) => ({ route }: { route: any }) => ({ headerTitle: route.params?.edit ? editTitle : defaultTitle })

const Router = () => {
  const [actions, dispatch] = useGeneralControl()
  return (
      <Stack.Navigator
        // @ts-ignore
        screenOptions={{ header: renderHeader }}
        screenListeners={{ focus: () => dispatch({ type: actions.CLEAR }) }}
      >
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={PatientDetail}
          options={{ headerTitle: 'Карточка пациента' }}
        />
        {/* @ts-ignore */}
        <Stack.Screen options={getEditTitle('Редактирование записи', 'Добавление записи')} name="AddAppointment" component={AddAppointment} />
        {/* @ts-ignore */}
        <Stack.Screen options={{ headerTitle: 'Добавление пациента' }} name="AddPatient" component={AddPatient} />
        <Stack.Screen options={{ headerTitle: 'Зубная формула' }} name="TeethFormula" component={TeethFormula} />
        <Stack.Screen options={{ headerTitle: 'Импорт контактов' }} name="ImportContacts" component={ImportContacts} />
        {/* @ts-ignore */}
        <Stack.Screen options={getEditTitle('Редактирование шаблона', 'Добавить новый шаблон')} name="AddTemplate" component={AddTemplate} />
        {/* @ts-ignore */}
        <Stack.Screen options={getEditTitle('Редактирование группы', 'Добавить новую группу')} name="AddGroup" component={AddGroup} />
        <Stack.Screen options={{ headerTitle: 'Управление шаблонами' }} name="TemplatesList" component={TemplatesList} />
        <Stack.Screen options={{ headerTitle: 'Управление БД' }} name="DatabasesList" component={DatabasesList} />
        <Stack.Screen options={{ headerTitle: 'Управление группами' }} name="GroupList" component={GroupList} />
        {/* @ts-ignore */}
        <Stack.Screen options={{ headerTitle: 'Подтверждение приема' }} name="ConfirmAppointment" component={ConfirmAppointment} />
      </Stack.Navigator>
  )
}

export default Router
