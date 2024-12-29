import { FC, useState } from "react"
import { Button, View, Text, TouchableOpacity, Image, Pressable } from "react-native"
import { Audio } from "expo-av"
import { StyleSheet } from "react-native";

interface Props{
    name: string,
    uri: string,
    item: Audio,
    setSound: Function,
    audios: Audio[],
    setAudios: Function,
    sound: any,
    setIsPlay: Function,
    setFoot: Function,
    setAudio: Function,
    setRandomFoot: Function,
}

interface Audio{
    name: string,
    singer: string,
    uri: string,
    state: string,
}

const Stopped: FC <Props> = (props) => {

    const playMusic = async () => {
        if (props.sound !== null) {
            await props.sound.stopAsync()
        }
        const {sound} = await Audio.Sound.createAsync({uri: props.uri})
        await sound.playAsync()
        props.setSound(sound)
        const newArr = props.audios.map(el => {
            if (el.uri === props.uri) {
                return {
                    name: el.name,
                    singer: el.singer,
                    uri: el.uri,
                    state: 'play',
                }
            } else {
                return {
                    name: el.name,
                    singer: el.singer,
                    uri: el.uri,
                    state: 'stopped',
                }
            }
        })
        props.setAudios(newArr)
        props.setIsPlay(true)
        props.setFoot(true)
        props.setAudio(props.uri)
        props.setRandomFoot(false)
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={playMusic}>
                <Image 
                    source={{ uri: "https://img.icons8.com/?size=100&id=9978&format=png&color=000000" }} 
                    style={stoppedStyles.playBtn} 
                />
            </Pressable>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 20, color: 'aqua' }}>{props.name}</Text>
            </View>
        </View>
    );
    
}

const stoppedStyles = StyleSheet.create({
    playBtn: {
        width: 30,
        height: 30,
    }
})

export default Stopped