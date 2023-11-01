import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomNavigationBar, { AppHeaderProps } from './components/AppHeader'
import {
  Appointments, PatientDetail, AddAppointment, PatientsList,
  AddPatient, ImportContacts, Settings, AddTemplate, TemplatesList, ConfirmAppointment, 
  DatabasesList, GroupList, AddGroup, AppointmentsCalendar
} from './pages'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { Text } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TeethFormula from './pages/TeethFormula'
import { useGeneralControl } from './context/general-context'
import { useAppTheme } from './styles/themes'
import { t, msg } from '@lingui/macro'
import { useMemo } from 'react'
import { i18n } from "@lingui/core"
import { children } from '@nozbe/watermelondb/decorators'

const renderIcon = (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) => ({ color }: { color: string }) => (
  <MaterialCommunityIcons name={name} color={color} size={22} />
)

const renderHeader = (props: AppHeaderProps) => <CustomNavigationBar {...props} />

export const TabsName = {
  records: msg`Записи`,
  patients: msg`Все пациенты`,
  groups: msg`Группы`,
  settings: msg`Настройки`,
}

const Icons = {
  records: renderIcon('calendar-check'),
  patients: renderIcon('account-injury'),
  groups: renderIcon('crowd'),
  settings: renderIcon('cog-outline'),
}

const Stack = createNativeStackNavigator()
const Tab = createMaterialBottomTabNavigator()

const getTabs = () => [
  <Tab.Screen
    key={TabsName.records.id}
    name={i18n._(TabsName.records)}
    component={Appointments}
    options={{ tabBarIcon: Icons.records }}
  />,
  <Tab.Screen
    key={TabsName.patients.id}
    name={i18n._(TabsName.patients)}
    component={PatientsList}
    options={{ tabBarIcon: Icons.patients }}
  />,
  <Tab.Screen
    key={TabsName.groups.id}
    name={i18n._(TabsName.groups)}
    component={GroupList}
    options={{ tabBarIcon: Icons.groups }}
  />,
  <Tab.Screen
    key={TabsName.settings.id}
    name={i18n._(TabsName.settings)}
    component={Settings}
    options={{ tabBarIcon: Icons.settings }}
  />,
]

function BottomTabs () {
  const theme = useAppTheme()
  const navProps = useMemo(() => {
    return {
      barStyle: {
        backgroundColor: theme.colors.primary,
        paddingTop: -2,
        paddingBottom: 4,
        maxHeight: 60
      },
      renderLabel: ({ focused, route }: { focused: boolean; route: { name: string } }) => (
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
      ),
      children: getTabs()
    }
  }, [theme, i18n.locale])

  return (
      <Tab.Navigator
        sceneAnimationEnabled={true}
        activeColor="white"
        inactiveColor="white"
        shifting
        {...navProps}
      />
  )
}

const getEditTitle = (editTitle: string, defaultTitle: string) => ({ route }: { route: any }) => ({ headerTitle: route.params?.edit ? editTitle : defaultTitle })

const getScreens = () => [
  <Stack.Screen
    key="Home"
    name="Home"
    component={BottomTabs}
    // options={{ headerShown: false }}
  />,
  <Stack.Screen
    key="Detail"
    name="Detail"
    component={PatientDetail}
    options={{ headerTitle: t`Карточка пациента` }}
  />,
  //@ts-ignore
  <Stack.Screen key="AddAppointment" options={getEditTitle(t`Редактирование записи`, t`Добавление записи`)} name="AddAppointment" component={AddAppointment} />,
  //@ts-ignore
  <Stack.Screen key="AddPatient" options={{ headerTitle: t`Добавление пациента` }} name="AddPatient" component={AddPatient} />,
  <Stack.Screen key="TeethFormula" options={{ headerTitle: t`Зубная формула` }} name="TeethFormula" component={TeethFormula} />,
  <Stack.Screen key="ImportContacts" options={{ headerTitle: t`Импорт контактов` }} name="ImportContacts" component={ImportContacts} />,
  //@ts-ignore
  <Stack.Screen key="AddTemplate" options={getEditTitle(t`Редактирование шаблона`, t`Добавить новый шаблон`)} name="AddTemplate" component={AddTemplate} />,
  //@ts-ignore
  <Stack.Screen key="AddGroup" options={getEditTitle(t`Редактирование группы`, t`Добавить новую группу`)} name="AddGroup" component={AddGroup} />,
  <Stack.Screen key="TemplatesList" options={{ headerTitle: t`Управление шаблонами` }} name="TemplatesList" component={TemplatesList} />,
  <Stack.Screen key="DatabasesList" options={{ headerTitle: t`Управление БД` }} name="DatabasesList" component={DatabasesList} />,
  //@ts-ignore
  <Stack.Screen key="ConfirmAppointment" options={{ headerTitle: t`Подтверждение приема` }} name="ConfirmAppointment" component={ConfirmAppointment} />,
  //@ts-ignore
  <Stack.Screen key="AppointmentsCalendar" options={{ headerTitle: t`Календарь приема` }} name="AppointmentsCalendar" component={AppointmentsCalendar} />,
]

const screenOptions = { header: renderHeader }

const Router = () => {
  const [actions, dispatch] = useGeneralControl()
  const navigatorProps = useMemo(() => ({
    screenListeners: ({ focus: () => dispatch({ type: actions.CLEAR }) }),
    children: getScreens()
  }), [i18n.locale])
  return (
      <Stack.Navigator
        // @ts-ignore
        screenOptions={screenOptions}
        {...navigatorProps}
      />
  )
}

export default Router
