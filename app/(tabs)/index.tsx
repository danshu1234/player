import { FC, useEffect, useState } from "react";
import { Button, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerResult } from "expo-document-picker";
import { Audio } from "expo-av";
import Stopped from "../Stopped";
import Play from "../Play";
import Paused from "../Paused";
import Footer from "../Footer";

interface Audio{
  name: string,
  singer: string,
  uri: string,
  state: string,
}

const Home: FC = () => {

  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [audio, setAudio] = useState <string> ('')
  const [audios, setAudios] = useState <Audio[]> ([])
  const [modal, setModal] = useState <boolean> (false)
  const [name, setName] = useState <string> ('')
  const [singer, setSinger] = useState <string> ('')
  const [resultUri, setResultUri] = useState <string> ('')
  const [isPlay, setIsPlay] = useState <boolean> (false)
  const [foot, setFoot] = useState <boolean> (false)
  let footer;

  if (foot) {
    footer = <Footer isPlay = {isPlay} sound={sound} audio={audio} setAudio={setAudio} audios={audios} setAudios={setAudios} setIsPlay={setIsPlay} setSound={setSound}/>
  }

  const addAudio = async () => {
    const result: DocumentPickerResult = await DocumentPicker.getDocumentAsync({ 
      type: 'audio/*',
  })
  if (result.assets !== null) {
    setModal(true)
    setResultUri(result.assets[0].uri)
  }
}

  return (
    <View style={styles.main}>
      <TouchableOpacity style={styles.btn} onPress={addAudio}><Text>Добавить</Text></TouchableOpacity>
      <ScrollView>
        {audios.map((item, index) => {
          if (item.state === 'stopped') {
            return (
              <Stopped name={item.name} uri={item.uri} sound={sound} key={index} item={item} setSound={setSound} audios={audios} setAudios={setAudios} setIsPlay={setIsPlay} setFoot={setFoot} setAudio={setAudio}/>
            )
          } else if (item.state === 'play' && sound !== null) {
            return (
              <Play name={item.name} sound = {sound} key={index} audios={audios} setAudios={setAudios} uri={item.uri} setIsPlay={setIsPlay} setFoot={setFoot}/>
            ) 
          } else if (item.state === 'paused' && sound !== null) {
            return (
              <Paused name={item.name} sound={sound} key={index} audios={audios} setAudios={setAudios} uri={item.uri} setIsPlay={setIsPlay}/>
            )
          }
        })}
      </ScrollView>
      <Modal visible={modal}>
        <TextInput placeholder="Введите название" onChangeText={(text: string) => setName(text)}/>
        <TextInput placeholder="Введите исполнителя" onChangeText={(text: string) => setSinger(text)}/>
        <Button title="Сохранить" onPress={() => {
          if (name !== '' && singer !== '') {
            setAudios([{
              name: name,
              singer: singer,
              uri: resultUri,
              state: 'stopped'
            }, ...audios])
            setModal(false)
          }
        }}/>
      </Modal>
      {footer}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'plum',
  },
  btn: {
    padding: 11,
    width: 90,
    height: 40,
    backgroundColor: 'green',
    borderRadius: 15,
    marginVertical: 50
  }
})


export default Home;
