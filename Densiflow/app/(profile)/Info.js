import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from 'expo-router'
import Arrow from '../../components/svg/Arrow'
const Info = () => {
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
      
      <View className="flex-2 mt-14">
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-center text-2xl mb-3 text-secondary">Info</Text>
            <View  className="flex-2 bg-gray-200 mt-2 p-4 rounded-lg">
             <Pressable onPress={()=>router.push('/(profile)/Terms')}>
             <View className="flex-row gap-3 items-center justify-between mb-4">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Terms of Use</Text>
                <Arrow/>
              </View>
             </Pressable>

             <Pressable onPress={()=>router.push('/(profile)/Privacy')}>
             <View className="flex-row gap-3 items-center justify-between mb-4">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Privacy Policy</Text>
                <Arrow/>
              </View>
             </Pressable>

             <Pressable onPress={()=>router.push('/(profile)/Help')}>
             <View className="flex-row gap-3 items-center justify-between ">
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Help</Text>
                <Arrow/>
              </View>
             </Pressable>
        
             
            </View>
          </View>
    </View>
  )
}

export default Info