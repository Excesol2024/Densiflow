import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const Terms = () => {
  const router = useRouter();

 const Definitions = [
  {
    name: "Content",
    description: "refers to text, images, photos, audio, video, and all other forms of data or communication."
  },
  {
    name: "Your Content",
    description: "refers to Content that you submit or transmit to, through, or in connection with the App."
  },
  {
    name: "User Content",
    description: "refers to Content that users submit or transmit to, through, or in connection with the App."
  },
  {
    name: "Densiflow Content",
    description: "refers to Content that we create and make available in connection with the App."
  },
  {
    name: "Third Party Content",
    description: "refers to Content that originates from parties other than Densiflow or its users and is made available in connection with the App."
  },
  {
    name: "App Content",
    description: "refers to all of the Content that is made available in connection with the App, including Your Content, User Content, Third Party Content, and Densiflow Content."
  }
 ]

 const usingTheApp = [
    {
      name: "A. Eligibility",
      description: "You must be at least 13 years old to use the App. By using the App, you represent and warrant that you have the right, authority, and capacity to enter into this Agreement and to abide by all of the terms and conditions set forth herein.",
    },
    {
      name: "B. Permission to Use the App",
      description: "We grant you permission to use the App subject to the restrictions in this Agreement. Your use of the App is at your own risk, including the risk that you might be exposed to Content that is offensive, indecent, inaccurate, objectionable, incomplete, or otherwise inappropriate.",
    },
    {
      name: "C. App Availability",
      description: "We may modify, update, interrupt, suspend or discontinue the App at any time without notice or liability.",
    },
 ]

 const content = [
  {
    name: "A. Responsibility for Your Content",
    description: "You alone are responsible for Your Content. You assume all risks associated with Your Content, including anyone's reliance on its accuracy, completeness or usefulness, or any disclosure by you of information in Your Content that makes you personally identifiable."
  },
  {
    name: "B. Our Right to Use Your Content",
    description: "By submitting Your Content to the App, you hereby grant us a worldwide, non-exclusive, perpetual, irrevocable, royalty-free, fully paid, sublicensable and transferable license to use, modify, reproduce, distribute, prepare derivative works of, display, and perform Your Content in connection with the App and our business, including without limitation for promoting and redistributing part or all of the App (and derivative works thereof) in any media formats and through any media channels."
  },
  {
    name: "C. Ownership",
    description: "As between you and Densiflow, you own Your Content. We own the Densiflow Content, including but not limited to visual interfaces, interactive features, graphics, design, compilation, computer code, products, software, aggregate user review ratings, and all other elements and components of the App excluding Your Content, User Content and Third Party Content. We also own the copyrights, trademarks, service marks, trade names, trade secrets, and other intellectual and proprietary rights throughout the world associated with the Densiflow Content and the App, which are protected by copyright, trade dress, patent, trademark laws and all other applicable intellectual and proprietary rights and laws."
  },
]

const restrictions = [
  {
    description: " Violate our Content Guidelines, for example, by writing a fake or defamatory review, trading reviews with other businesses, or compensating someone or being compensated to write or remove a review;",
    number: "a)"
  },
  {
    description: " Violate any third party's rights, including any breach of confidence, copyright, trademark, patent, trade secret, moral right, privacy right, right of publicity, or any other intellectual property or proprietary right;",
    number: "b)"
  },
  {
    description: "Threaten, stalk, harm, or harass others, or promote bigotry or discrimination;",
    number: "c)"
  },
  {
    description: "Promote a business or other commercial venture or event, or otherwise use the App for commercial purposes, except as expressly permitted by Densiflow;",
    number: "d)"
  },
  {
    description: "Send bulk emails, surveys, or other mass messaging, whether commercial in nature or not;",
    number: "e)"
  },
  {
    description: "Engage in keyword spamming, or otherwise attempt to manipulate the App's search results or any third party website;",
    number: "f)"
  },
  {
    description: "Solicit personal information or personal information from minors, or submit or transmit pornography; or",
    number: "g)"
  },
  {
    description: "Violate any applicable law.",
    number: "g)"
  },

]

  return (
    <SafeAreaView className="flex-1">
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity
          onPress={() => {
            router.push("/Info");
          }}
        >
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "PoppinsMedium", fontSize: 20, marginLeft: 10 }}
        >
          Back
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <Text
            className="text-center text-secondary"
            style={{ fontFamily: "PoppinsMedium", fontSize: 23 }}
          >
            Terms of Use and End User License Agreement
          </Text>
          <View className="p-5">
          <View className="">
          <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
          I. Introduction
                   </Text>
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
            Welcome to Densiflow (the "App"). This mobile application is operated by ExceSol LLC ("we," "us," or "our"). By downloading, accessing, or using our App, you agree to be bound by these Terms of Use and End User License Agreement (collectively, the "Agreement"). If you do not agree to this Agreement, please do not use the App.
            </Text>
          </View>
        


            <View className="mt-5"> 
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              II. Definitions
              </Text>
              {Definitions.map((info, index)=>(
               <View key={index} className="flex-row gap-1 mb-1">
               <View
                 style={{
                   marginTop: 20,
                   position: "absolute",
                   width: 7,
                   height: 7,
                   backgroundColor: "black",
                   top: 6.4,
                   borderRadius: 100,
                 }}
               ></View>
               <Text
                 className="pl-4"
                 style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
               >
                 <Text className="text-secondary">{info.name}</Text>  {info.description}
               </Text>
             </View>
             ))}
            </View> 

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              III. Using the App
              </Text>
             {usingTheApp.map((item, index)=>(
               <View key={index} className="mt-2">
               <Text style={{ fontFamily: "PoppinsBold", fontSize: 17 }}>{item.name}</Text>
               <Text className="" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                {item.description}
         </Text>
         </View>
             ))}
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              IV. Content
              </Text>
             {content.map((item, index)=>(
               <View key={index} className="mt-2">
               <Text style={{ fontFamily: "PoppinsBold", fontSize: 17 }}>{item.name}</Text>
               <Text className="" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                {item.description}
         </Text>
         </View>
             ))}
            </View>

            <View className="mt-5"> 
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              V. Restrictions
              </Text>
              <Text className="mb-2" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              You agree not to, and will not assist, encourage, or enable others to use the App to:  
              </Text>
              {restrictions.map((info, index)=>(
               <View key={index} className="flex-row gap-1 mb-1">
               <View
                 style={{
                   marginTop: 20,
                   position: "absolute",
                   width: 7,
                   height: 7,
                   backgroundColor: "black",
                   top: 6.4,
                   borderRadius: 100,
                 }}
               ></View>
               <Text
                 className="pl-4"
                 style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
               >
                 {info.description}
               </Text>
             </View>
             ))}
            </View> 




            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              VI. Privacy
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
             You consent to the collection, processing, and storage of your personal information in accordance with our Privacy Policy, which is incorporated into this Agreement by reference.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              VII. Security
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
             We work to protect the security of your information during transmission by using Secure Sockets Layer (SSL) software, which encrypts information you input. However, no data transmission over the Internet can be guaranteed to be 100% secure. As a result, while we strive to protect your personal information, we cannot ensure or warrant the security of any information you transmit to us, and you do so at your own risk.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              VIII. Third-Party Links, Sites, and Services
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
             The App may contain links to third-party websites, advertisers, services, special offers, or other events or activities that are not owned or controlled by us. We do not endorse or assume any responsibility for any such third-party sites, information, materials, products, or services. If you access any third party website, service, or content from the App, you do so at your own risk and you agree that we will have no liability arising from your use of or access to any third-party website, service, or content.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              IX. Termination
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
             We may terminate or suspend your access to the App, without prior notice or liability, for any reason whatsoever, including without limitation if you breach this Agreement. Upon termination, your right to use the App will immediately cease.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              X. Disclaimer of Warranties
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
            THE APP AND ALL CONTENT AND SERVICES PROVIDED THROUGH IT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              XI. Limitation of Liability
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DENSIFLOW, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THIS APP.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              XII. Governing Law and Jurisdiction
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
            This Agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the courts located within [Your Jurisdiction].
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              XIII. Changes to This Agreement
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              XIV. Contact Us
              </Text>
              <View className="flex-row mt-1 mb-2">
                <Text
                  className=""
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
            If you have any questions about this Agreement, please contact us at <Text className="text-secondary">info@excesolution.com</Text> {" "}

By using the Densiflow App, you acknowledge that you have read this Agreement, understood it, and agree to be bound by its terms and conditions.
                </Text>
              </View>
            </View>


          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Terms;
