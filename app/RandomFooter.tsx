import { FC, useEffect, useState } from "react";
import { Text, View, Pressable, Image } from "react-native";

interface Props{
    sound: any,
    setRandomFoot: Function,
    setSound: Function,
}

const RandomFooter: FC <Props> = (props) => {

    const [isPlay, setIsPlay] = useState <boolean> (true)
    let isPlaying;
    
    const checkPlay = async () => {
        const status = await props.sound.getStatusAsync();
        if (status.isLoaded) {
            if (!status.isPlaying && !status.isBuffering && status.isPlaying !== false) {
                await props.sound.stopAsync();
                await props.sound.unloadAsync();
                props.setRandomFoot(false);
                props.setSound(null);
            }
        }
    }
    
    

    const pauseSong = async () => {
        await props.sound.pauseAsync()
        setIsPlay(false)
    }

    const playSong = async () => {
        await props.sound.playAsync()
        setIsPlay(true)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            checkPlay()
        }, 1000);
        return(() => clearInterval(interval))
    }, [])

    if (isPlay) {
        isPlaying = <Pressable onPress={pauseSong}><Image source={{ uri: "https://img.icons8.com/?size=100&id=9987&format=png&color=000000" }} style={{width: 20, height: 20}}/></Pressable>
    } else {
        isPlaying = <Pressable onPress={playSong}><Image source={{ uri: "https://img.icons8.com/?size=100&id=9978&format=png&color=000000" }} style={{width: 20, height: 20}}/></Pressable>
    }

    return (
        <View>
            {isPlaying}
        </View>
    )
}

export default RandomFooter