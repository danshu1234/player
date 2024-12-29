import { FC, useEffect, useState } from "react";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from 'expo-document-picker';
import { DocumentPickerResult } from "expo-document-picker";
import { Audio } from "expo-av";
import Stopped from "../Stopped";
import Play from "../Play";
import Paused from "../Paused";
import Footer from "../Footer";
import RandomFooter from "../RandomFooter";
import RemoveBtn from "../RemoveBtn";

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
  const [randomFoot, setRandomFoot] = useState <boolean> (false)
  const [warn, setWarn] = useState <string> ('')
  const [singerSort, setSingerSort] = useState <string> ('Все')
  const [singers, setSingers] = useState <string[]> ([])
  const [randomSong, setRandomSong] = useState <string> ('')
  const [isSongs, setIsSongs] = useState <boolean> (false)
  let addBtn;
  let songsList;
  let footer;
  let randomFooter;
  let okBtn;
  let randomBtn;
  let someSongs;

  const addAudio = async () => {
    const result: DocumentPickerResult = await DocumentPicker.getDocumentAsync({ 
      type: 'audio/*',
  })
  if (result.assets !== null) {
    setModal(true)
    setResultUri(result.assets[0].uri)
  }
}

  if (singerSort === 'Все' && audios.length !== 0) {
    randomBtn = <Button title="Выбрать случайный трек ✦" onPress={() => {
        goRandomSong()
    }}/>
  }

  if (singerSort === 'Все') {
    addBtn = <TouchableOpacity style={styles.btn} onPress={addAudio}><Text style={{color: 'aqua', fontSize: 25}}>+</Text></TouchableOpacity>
  }

  if (isSongs) {
    someSongs = <Text style={{color: 'gray', opacity: 0.8, marginBottom: 350, fontSize: 20}}>Треков пока нет</Text>
  }

  if (singerSort === 'Все') {
    songsList = <ScrollView style={{width: '100%'}}>
    {audios.map((item, index) => {
      if (item.state === 'stopped') {
        return (
          <View key={index} style={styles.audio}>
          <Stopped name={item.name} uri={item.uri} sound={sound} key={index} item={item} setSound={setSound} audios={audios} setAudios={setAudios} setIsPlay={setIsPlay} setFoot={setFoot} setAudio={setAudio} setRandomFoot={setRandomFoot}/>
          <RemoveBtn uri={item.uri} sound={sound} audios={audios} audio={audio} name={item.name} setAudios={setAudios} setFoot={setFoot} singerSort={singerSort} singer={item.singer} setSingerSort={setSingerSort}/>
          </View>
        )
      } else if (item.state === 'play' && sound !== null) {
        return (
          <View key={index} style={styles.audio}>
          <Play name={item.name} sound={sound} key={index} audios={audios} setAudios={setAudios} uri={item.uri} setIsPlay={setIsPlay} setFoot={setFoot}/>
          <RemoveBtn uri={item.uri} sound={sound} audios={audios} audio={audio} name={item.name} setAudios={setAudios} setFoot={setFoot} singerSort={singerSort} singer={item.singer} setSingerSort={setSingerSort}/>
          </View>
        ) 
      } else if (item.state === 'paused' && sound !== null) {
        return (
          <View key={index} style={styles.audio}>
          <Paused name={item.name} sound={sound} key={index} audios={audios} setAudios={setAudios} uri={item.uri} setIsPlay={setIsPlay}/>
          <RemoveBtn uri={item.uri} sound={sound} audios={audios} audio={audio} name={item.name} setAudios={setAudios} setFoot={setFoot} singerSort={singerSort} singer={item.singer} setSingerSort={setSingerSort}/>
          </View>
        )
      }
    })}
  </ScrollView>
  } else {
    songsList = <ScrollView style={{width: '100%'}}>
    {audios.map((item, index) => {
      if (item.state === 'stopped') {
        return (
          <View key={index} style={styles.audio}>
          <Stopped name={item.name} uri={item.uri} sound={sound} key={index} item={item} setSound={setSound} audios={audios} setAudios={setAudios} setIsPlay={setIsPlay} setFoot={setFoot} setAudio={setAudio} setRandomFoot={setRandomFoot}/>
          </View>
        )
      } else if (item.state === 'play' && sound !== null) {
        return (
          <View key={index} style={styles.audio}>
          <Play name={item.name} sound = {sound} key={index} audios={audios} setAudios={setAudios} uri={item.uri} setIsPlay={setIsPlay} setFoot={setFoot}/>
          </View>
        ) 
      } else if (item.state === 'paused' && sound !== null) {
        return (
          <View key={index} style={styles.audio}>
          <Paused name={item.name} sound={sound} key={index} audios={audios} setAudios={setAudios} uri={item.uri} setIsPlay={setIsPlay}/>
          </View>
        )
      }
    })}
  </ScrollView>
  }

  if (warn === 'Вы уже добавляли этот трек') {
    okBtn = <Button title="Понятно, выбрать другой" onPress={() => setModal(false)}/>
  }

  if (randomFoot) {
    randomFooter = <RandomFooter sound={sound} setRandomFoot={setRandomFoot} setSound={setSound}/>
  }

  if (foot) {
    footer = <Footer isPlay = {isPlay} sound={sound} audio={audio} setAudio={setAudio} audios={audios} setAudios={setAudios} setIsPlay={setIsPlay} setSound={setSound}/>
  }

const saveInStorage = async () => {
  const getStorage = await AsyncStorage.getItem('songs')
  if (getStorage) {
    const parsedStorage = await JSON.parse(getStorage)
    await AsyncStorage.setItem('songs', JSON.stringify([{
      name: name,
      singer: singer,
      uri: resultUri,
      state: 'stopped',
    }, ...parsedStorage]))
  } else {
    await AsyncStorage.setItem('songs', JSON.stringify([{
      name: name,
      singer: singer,
      uri: resultUri,
      state: 'stopped',
    }]))
  }
  getFromStorage()
}

const getSongs = async () => {
  const getStorage = await AsyncStorage.getItem('songs')
  if (getStorage) {
    setAudios(JSON.parse(getStorage))
  }
}

useEffect(() => {
  if (audios.length === 0) {
    setIsSongs(true)
    setRandomFoot(false)
  } else {
    setIsSongs(false)
  }
}, [audios])

useEffect(() => {
  getSongs()
}, [])

useEffect(() => {
  getFromStorage()
}, [audios])

const stopSong = async () => {
  if (sound) {
    await sound.stopAsync()
    await sound.unloadAsync()
    setSound(null)
  }
}

useEffect(() => {
  if (randomFoot) {
    setFoot(false)
  }
}, [randomFoot])

const goRandomSong = async () => {
  await stopSong(); 
  const randomNum = Math.floor(Math.random() * audios.length);
  const randomSong = audios[randomNum];
  setRandomSong(randomSong.uri); 
  const { sound } = await Audio.Sound.createAsync({uri: randomSong.uri});
  await sound.playAsync(); 
  setSound(sound); 
  setRandomFoot(true); 
}



const getFromStorage = async () => {
  const getStorage = await AsyncStorage.getItem('songs')
  if (getStorage) {
    const parsedStorage = await JSON.parse(getStorage)
    const onlySingers = await parsedStorage.map((item: Audio) => item.singer)
    const uniqueSingers = new Set(onlySingers)
    const arrSingers = Array.from(uniqueSingers)
    const checkTypes = arrSingers.every(item => typeof item === 'string')  
    if (checkTypes) {
      setSingers(arrSingers)
    }
  }
}

const getSinger = async () => {
  const getStorage = await AsyncStorage.getItem('songs')
  if (getStorage) {
    const parsedStorage = await JSON.parse(getStorage)
    const filteredArr = await parsedStorage.filter((item: Audio) => item.singer === singerSort)
    setAudios(filteredArr)
  }
}

useEffect(() => {
  if (singerSort === 'Все') {
    getSongs()
  } else {
    getSinger()
  }
}, [singerSort])

  return (
    <View style={styles.main}>
      {addBtn}
      {randomBtn}
      <Picker selectedValue={'Все'} style={{
        width: 200,
        marginTop: 50,
      }} onValueChange={(text: string) => setSingerSort(text)}>
        <Picker.Item label="Все" value="Все"/>
        {singers.map((item, index) => <Picker.Item label={item} value={item} key={index}/>)}
      </Picker>
      {songsList}
      {someSongs}
      <Modal visible={modal}>
        <TextInput placeholder="Введите название" onChangeText={(text: string) => {
          setName(text)
          setWarn('')
          }}/>
        <TextInput placeholder="Введите исполнителя" onChangeText={(text: string) => {
          setSinger(text)
          setWarn('')
          }}/>
        <Button title="Сохранить" onPress={() => {
          if (name !== '' && singer !== '' && name.length < 15) {
            const isThisSong = audios.find(item => item.name === name)
            if (isThisSong === undefined) {
              setAudios([{
                name: name,
                singer: singer,
                uri: resultUri,
                state: 'stopped'
              }, ...audios])
              setModal(false)
              saveInStorage()
            } else {
              setWarn('Вы уже добавляли трек с таким названием')
            }
          } else {
            setWarn('Введите название трека и исполнителя')
          }
        }}/>
        <Text>{warn}</Text>
        {okBtn}
      </Modal>
      {footer}
      {randomFooter}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
  btn: {
    paddingBottom: 14,
    paddingLeft: 12,
    width: 40,
    height: 40,
    backgroundColor: 'green',
    borderRadius: 15,
    marginVertical: 50
  },
  btnSort: {
    width: 230,
    height: 40,
    backgroundColor: 'green',
    borderRadius: 15,
    marginVertical: 50
  },
  audio: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 20, 
    justifyContent: 'space-between', 
    width: 300, 
    marginLeft: 30, 
    backgroundColor: 'rgba(128, 128, 128, 0.7)', 
    borderRadius: 10, 
    height: 60
  }
})


export default Home;
