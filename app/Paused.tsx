import { FC } from "react";
import { View, Text, Button } from "react-native";
import { Audio } from "expo-av";

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
        <View>
            <Text>{props.name}</Text>
            <Button title="Возобновить" onPress={continueMusic}/>
        </View>
    )
}

export default Paused