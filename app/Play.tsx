import { FC, useEffect } from "react";
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
    setFoot: Function,
}

interface Audio{
    name: string,
    singer: string,
    uri: string,
    state: string,
}


const Play: FC <Props> = (props) => {

    const checkPlay = async () => {
        const status = await props.sound.getStatusAsync()
        if (status.isLoaded) {
            if (!status.isPlaying) {
                const allStopped = props.audios.map(el => {
                    return {
                        name: el.name,
                        singer: el.singer,
                        uri: el.uri,
                        state: 'stopped',
                    }
                })
                props.setAudios(allStopped)
                props.setFoot(false)
            }
        }
    }
     
    useEffect(() => {
        const interval = setInterval(() => {
            checkPlay()
        }, 1000);
        return(() => clearInterval(interval))
    }, [])

    const pauseMusic = async () => {
        await props.sound.pauseAsync()
        const newArr = props.audios.map(el => {
            if (el.uri === props.uri) {
                return {
                    name: el.name,
                    singer: el.singer,
                    uri: el.uri,
                    state: 'paused',
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
        props.setIsPlay(false)
    }
    
    return (
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Pressable onPress={pauseMusic}><Image source={{ uri: "https://img.icons8.com/?size=100&id=9987&format=png&color=000000" }} style={playStyles.playBtn}/></Pressable>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 20, color: 'aqua' }}>{props.name}</Text>
            </View>
            </View>
    )
}

const playStyles = StyleSheet.create({
    playBtn: {
        width: 30,
        height: 30,
    }
})

export default Play