import React from 'react'
import { Tabs } from "expo-router"
import TabBar from '../../components/TabBar'
const TabsHomeScreen = () => {
  return (
    <Tabs
    tabBar={props=> <TabBar {...props}/>}
    >
        <Tabs.Screen name='Home' options={{
            title: 'home',
            headerShown: false
        }} />
          <Tabs.Screen name='Saved' options={{
            title: 'Saved',
            headerShown: false
        }} />

      <Tabs.Screen name='Map' options={{
            title: 'Map',
            headerShown: false
        }} />
        
          <Tabs.Screen name='Alerts' options={{
            title: 'Alerts',
            headerShown: false
        }} />
          <Tabs.Screen name='Profile' options={{
            title: 'Profile',
            headerShown: false
        }} />
    </Tabs>
  )
}

export default TabsHomeScreen