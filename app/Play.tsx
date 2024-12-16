import { FC, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Audio } from "expo-av";

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
        <View>
            <Text>{props.name}</Text>
            <Button title="Пауза" onPress={pauseMusic}/>
        </View>
    )
}

export default Play