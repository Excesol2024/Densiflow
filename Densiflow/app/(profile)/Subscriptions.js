import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from 'expo-router'

const Subscriptions = () => {
  const router = useRouter();
  return (
    <View className="flex-1 p-4">
        <View className="mt-8 flex-row items-center">
        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/Settings")}>
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text
          style={{ fontFamily: "PoppinsMedium" }}
          className="text-lg text-center ml-2"
        >
         Settings
        </Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-2 mt-7">
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-center text-2xl mb-3 text-secondary">Subscription</Text>
            <View  className="flex-2 bg-gray-200 mt-2 p-5 rounded-lg">
             <Pressable>
             <View className="flex-row gap-3 items-center justify-between mb-4">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Status</Text>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg text-secondary">Active</Text>
              </View>
             </Pressable>

             <Pressable>
             <View className="flex-row gap-3 items-center justify-between mb-4">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Renews on:</Text>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg text-secondary">10/15/2025</Text>
              </View>
             </Pressable>

             <Pressable>
             <View className="flex-row gap-3 items-center justify-between mb-4">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg text-red-500">Manage Subscriptions</Text>
              </View>
             </Pressable>

             <Pressable>
             <View className="flex-row gap-3 items-center justify-between ">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg text-red-500">Restore Purchase</Text>
              </View>
             </Pressable>

             
             
            </View>
          </View>
    </View>
  )
}

export default Subscriptions