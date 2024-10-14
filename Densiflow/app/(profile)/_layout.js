
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Privacy"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
        <Tabs.Screen
        name="Terms"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
         <Tabs.Screen
        name="Account"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
         <Tabs.Screen
        name="Feedback"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
            <Tabs.Screen
        name="Details"
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}