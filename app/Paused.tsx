import { FC } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Audio } from "expo-av";
import { StyleSheet } from "react-native";

interface Props{
    name: string,
    sound: Audio.Sound,
    audios: Audio[],
    setAudios: Function,
    uri: string,
    setIsPlay: Function,
}

interface Audio{
    name: string,
    singer: string,
    uri: string,
    state: string,
}

const Paused: FC <Props> = (props) => {

    const continueMusic = async () => {
        props.sound.playAsync()
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
    }
    
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={continueMusic}><Image source={{ uri: "https://img.icons8.com/?size=100&id=9978&format=png&color=000000" }} style={pausedStyles.playBtn}/></Pressable>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 20, color: 'aqua' }}>{props.name}</Text>
            </View>
        </View>
    )
}

const pausedStyles = StyleSheet.create({
    playBtn: {
        width: 30,
        height: 30,
    }
})

export default Paused