import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import MapSvg from './svg/map';
import HomeSvg from './svg/home';
import WorldSvg from './svg/world';
import NotifSvg from './svg/notification';
import ProfileSvg from './svg/profile';

const TabBar = ({ state, descriptors, navigation }) => {

    const icons = {
      Home: (props) => <HomeSvg {...props} />,
      Saved: (props) => <MapSvg {...props} />,
      Map: (props) => <WorldSvg {...props} />,
      Alerts: (props) => <NotifSvg {...props} />,
      Settings: (props) => <ProfileSvg {...props} />,
    }

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'white', position: 'absolute', bottom: 0, width: '100%', 
    padding: 2, alignItems: 'center', alignContent: 'center'}}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
          >
            {
                icons[route.name]({
                    color: isFocused ? '#007AFF' : '#E0E0E0'
                })
            }
             <Text style={{ color: isFocused ? '#007AFF' : '#E0E0E0', fontFamily: 'PoppinsThin' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
