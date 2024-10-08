
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Login"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
         <Tabs.Screen
        name="Registration"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
            <Tabs.Screen
        name="Forgotpassword"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />

        <Tabs.Screen
        name="Resetpassword"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
       <Tabs.Screen
        name="Success"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // This hides the tab bar
        }}
      />
    </Tabs>
  );
}