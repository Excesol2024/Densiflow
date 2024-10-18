import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const Privacy = () => {

  const infoWeCollectAutomatically = [
    {
      name: "Your Use of the Services.",
      description: "We keep track of certain information about you when you visit and interact with any of our Services. This information includes the features you use; the links you click on; the type, size and filenames of attachments you upload to the Services; frequently used search terms; and how you interact with others on the Services.",
      number: "1."
    },
    {
      name: "Device Information.",
      description: "We collect information about your device, including the hardware model, operating system and version, unique device identifiers, mobile network information, and information about the device's interaction with our Services.",
      number: "2."
    },
    {
      name: "Log Data.",
      description: "Our servers automatically collect information when you access or use our Services and record it in log files. This log data may include the Internet Protocol (IP) address, the address of the web page visited before using the Services, browser type and settings, the date and time the Services were used, information about browser configuration and plugins, language preferences and cookie data.",
      number: "3."
    },
    {
      name: "Location Information.",
      description: "We receive information from you and other third-parties that helps us approximate your location. We may, for example, use a business address submitted by your employer, or an IP address received from your browser or device to determine approximate location.",
      number: "4."
    },
    {
      name: "Cookie Information. ",
      description: "We use cookies and similar technologies in our Services that help us collect other information. The Services may also include cookies and similar tracking technologies of third parties, which may collect information about you via the Services and across other websites and online services.",
      number: "5."
    },
  ]
  
  const infoWithThirdParties = [
    {
      name: "Third-Party Accounts.",
      description: " If you choose to link our Services to a third-party account, we will receive information about that account, such as your authentication token from the third-party account, to authorize linking. If you wish to limit the information available to us, you should visit the privacy settings of your third-party accounts to learn about your options.",
      number: "1."
    },
    {
      name: "Third-Party Partners.",
      description: "We may also receive publicly available information about you from our third-party partners and combine it with data that we have about you.",
      number: "2."
    },
  ]

  const howWeUseYourInfo = [
    {
      description: "Provide, operate, and maintain our Services;",
    },
    {
      description: "Improve, personalize, and expand our Services;",
    },
    {
      description: "Understand and analyze how you use our Services",
    },
    {
      description: "Develop new products, services, features, and functionality;",
    },
    {
      description: "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes;",
    },
    {
      description: "Process your transactions;",
    },
    {
      description: "Send you text messages and push notifications;",
    },
    {
      description: "Find and prevent fraud; and",
    },
    {
      description: "For compliance purposes, including enforcing our Terms of Service, or other legal rights, or as may be required by applicable laws and regulations or requested by any judicial process or governmental agency.",
    }
  ]

  const howWeShareYourInfo = [
    {
      name: "Vendors and Service Providers.",
      description: "We may share information with third-party vendors and service providers that provide services on our behalf, such as hosting, billing, payment processing, customer service, email delivery, and database management services.",
      number: "A."
    },
    {
      name: "Business Transfers.",
      description: "Information may be disclosed and otherwise transferred to any potential acquirer, successor, or assignee as part of any proposed merger, acquisition, debt financing, sale of assets, or similar transaction, or in the event of insolvency, bankruptcy, or receivership in which information is transferred to one or more third parties as one of our business assets.",
      number: "B."
    },
    {
      name: "As Required By Law and Similar Disclosures. ",
      description: "We may also share information to (i) satisfy any applicable law, regulation, legal process, or governmental request; (ii) enforce this Privacy Policy and our Terms of Service, including investigation of potential violations hereof; (iii) detect, prevent, or otherwise address fraud, security, or technical issues; (iv) respond to your requests; or (v) protect our rights, property or safety, our users and the public. This includes exchanging information with other companies and organizations for fraud protection and spam/malware prevention.",
      number: "C."
    },
    {
      name: "With Your Consent. ",
      description: "We may share information with your consent.",
      number: "D."
    },
  ]

  const dataProtection = [
    {
      description: "To access, correct, update or request deletion of your personal information.",
    },
    {
      description: "To object to processing of your personal information, ask us to restrict processing of your personal information or request portability of your personal information.",
    },
    {
      description: "To opt-out of marketing communications we send you at any time.",
    },
    {
      description: "To withdraw your consent at any time if we have collected and processed your personal information with your consent. Withdrawing your consent will not affect the lawfulness of any processing we conducted prior to your withdrawal, nor will it affect processing of your personal information conducted in reliance on lawful processing grounds other than consent.",
    },
    {
      description: "To complain to a data protection authority about our collection and use of your personal information. For more information, please contact your local data protection authority.",
    },
    {
      description: "To exercise any of these rights, please contact us at [contact email]. We will respond to your request to change, correct, or delete your information within a reasonable timeframe and notify you of the action we have taken.",
    },

  ]

  const router = useRouter();
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
            style={{ fontFamily: "PoppinsMedium", fontSize: 24 }}
          >
            Privacy Policy
          </Text>
          <View className="p-6">
          <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              I. Introduction
              </Text>
            <Text className="mb-2" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              This Privacy Policy describes how ExceSol LLC ("we," "our," or
              "us") collects, uses, and shares information in connection with
              your use of our websites, services, and applications
              (collectively, the "Services"). This Privacy Policy (the "Privacy
              Policy") does not apply to information our customers may process
              when using our Services.
            </Text>
            <Text className="mb-2" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
            We may collect and receive information about users of our Services ("users," "you," or "your") from various sources, including: (i) information you provide through your user account on the Services (your "Account") if you register for the Services; (ii) your use of the Services; and (iii) from third-party websites, services, and partners.
            </Text>
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
            We recommend that you read this Privacy Policy in full to ensure you are fully informed. If you have any questions about this Privacy Policy or Densiflow's data collection, use, and disclosure practices, please contact us at {" "} <Text className="text-secondary">info@excesolution.com</Text> 
            </Text>
            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              II. Information We Collect
              </Text>
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              A. Information You Provide
              </Text>
              <View className="flex-row mt-2 mb-2">
               <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>1.</Text>
                <Text
                  className="pl-2"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                 <Text className="text-secondary">Account Registration.</Text> When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
                </Text>
              </View>
              <View className="flex-row mb-2">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>2.</Text>
                <Text
                  className="pl-2"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                  <Text className="text-secondary">Payment Information.</Text> When you add your financial account information to your Account, that information is directed to our third-party payment processor. We do not store your financial account information on our systems; however, we have access to, and may retain, subscriber information through our third-party payment processor.
                </Text>
              </View>
              <View className="flex-row">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>3.</Text>
                <Text
                  className="pl-2"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                  <Text className="text-secondary">User Content.</Text> Our "Community" feature allows you to publicly post content on our Services. By registering for our Community, you agree that your profile information and the content you post may be viewed and used by other users and third parties we do not control.
                </Text>
              </View>
      
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              B. Information We Collect Automatically
              </Text>
            {infoWeCollectAutomatically.map((info, index)=>(
                <View key={index} className="flex-row mb-2">
                <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>{info.number}</Text>
                 <Text
                   className="pl-2"
                   style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                 >
                  <Text className="text-secondary">{info.name}</Text>
                  {info.description}
                 </Text>
               </View>
            ))}
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              C. Information We Receive from Third Parties
              </Text>
            {infoWithThirdParties.map((info, index)=>(
                <View key={index} className="flex-row mb-2">
                <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>{info.number}</Text>
                 <Text
                   className="pl-2"
                   style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                 >
                  <Text className="text-secondary">{info.name}</Text>
                  {info.description}
                 </Text>
               </View>
            ))}
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              III. How We Use Information
              </Text>
              <Text className="mb-2" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              We use the information we collect in various ways, including to:  
              </Text>
             {howWeUseYourInfo.map((info, index)=>(
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
              IV. How We Share Information
              </Text>
            {howWeShareYourInfo.map((info, index)=>(
                <View key={index} className="flex-row mb-2">
                <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>{info.number}</Text>
                 <Text
                   className="pl-2"
                   style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                 >
                  <Text className="text-secondary">{info.name}</Text>
                  {info.description}
                 </Text>
               </View>
            ))}
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              V. Legal Basis for Processing Personal Information
              </Text>
              <View className="flex-row mt-2 mb-2">
                <Text
                  className="pl-5"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                  Our legal basis for collecting and using the personal information described above will depend on the personal information concerned and the specific context in which we collect it. However, we will normally collect personal information from you only (i) where we need the personal information to perform a contract with you; (ii) where the processing is in our legitimate interests and not overridden by your rights; or (iii) where we have your consent to do so.
                </Text>
              </View>
        
         
      
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              VI. Security
              </Text>
              <View className="flex-row mt-2 mb-2">
                <Text
                  className="pl-5"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                  Densiflow is committed to protecting your information. To do so, we employ a variety of security technologies and measures designed to protect information from unauthorized access, use, or disclosure. The measures we use are designed to provide a level of security appropriate to the risk of processing your personal information. However, please bear in mind that the Internet cannot be guaranteed to be 100% secure.
                </Text>
              </View>
        
         
      
            </View>


            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              VII. Data Retention
              </Text>
              <View className="flex-row mt-2 mb-2">
                <Text
                  className="pl-5"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                  We retain personal information we collect from you where we have an ongoing legitimate business need to do so (for example, to provide you with a service you have requested or to comply with applicable legal, tax, or accounting requirements). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                </Text>
              </View>
        
         
      
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              VIII. Your Data Protection Rights
              </Text>
              <Text className="mb-2" style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              You have the following data protection rights:
              </Text>
             {dataProtection.map((info, index)=>(
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
              IX. Changes and Updates to this Privacy Policy
              </Text>
              <View className="flex-row mt-2 mb-2">
                <Text
                  className="pl-5"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                 We may update this Privacy Policy from time to time in response to changing legal, technical or business developments. When we update our Privacy Policy, we will take appropriate measures to inform you, consistent with the significance of the changes we make. We will obtain your consent to any material Privacy Policy changes if and where this is required by applicable data protection laws.
You can see when this Privacy Policy was last updated by checking the "last updated" date displayed at the top of this Privacy Policy.
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              X. Contact Us
              </Text>
              <View className="flex-row mt-2 mb-2">
                <Text
                  className="pl-5"
                  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                >
                 If you have any questions or concerns about our use of your personal information, please contact us using the following details: info@excesolution.com.
The data controller of your personal information is ExceSol LLC.
                </Text>
              </View>
            </View>


          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Privacy;
