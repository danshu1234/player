import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, useEffect } from "react";
import { Button, View, Image, Pressable } from "react-native";

interface Props{
    uri: string,
    sound: any,
    audios: Audio[],
    audio: string,
    name: string,
    setAudios: Function,
    setFoot: Function,
    singerSort: string,
    singer: string,
    setSingerSort: Function,
}

interface Audio{
    name: string,
    singer: string,
    uri: string,
    state: string,
}

const RemoveBtn: FC <Props> = (props) => {

    const removeSong = async () => {
        if (props.audio === props.uri) {
            await props.sound.stopAsync()
            props.setFoot(false)
        }
        const filteredArr = props.audios.filter(item => item.name !== props.name)
        props.setAudios(filteredArr)
        await AsyncStorage.setItem('songs', JSON.stringify(filteredArr))
    }

    return (
        <View>
            <Pressable onPress={removeSong}><Image source={{ uri: "https://img.icons8.com/?size=100&id=13086&format=png&color=000000"}} style={{width: 30, height: 30}}/></Pressable>
        </View>
    )
}

export default RemoveBtn