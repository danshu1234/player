import { FC, useState } from "react"
import { Button, View, Text } from "react-native"
import { Audio } from "expo-av"

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
    }

    return (
        <View>
            <Text>{props.name}</Text>
            <Button title="Играть" onPress={playMusic}/>
        </View>
    )
}

export default Stopped