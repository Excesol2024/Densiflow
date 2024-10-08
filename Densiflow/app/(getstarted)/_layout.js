
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
        <Tabs.Screen
        name="Start"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
        <Tabs.Screen
        name="Steptwo"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
        <Tabs.Screen
        name="Stepthree"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
    </Tabs>
  );
}