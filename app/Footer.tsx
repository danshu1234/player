import { FC, useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { StyleSheet } from "react-native";
import { Audio } from "expo-av";

interface Props{
    isPlay: boolean,
    sound: any,
    audio: string,
    audios: Audio[],
    setAudios: Function,
    setIsPlay: Function,
    setSound: Function,
    setAudio: Function,
}

interface Audio{
    name: string,
    singer: string,
    uri: string,
    state: string,
}

const Footer: FC <Props> = (props) => {

    const pauseMusic = async () => {
        await props.sound.pauseAsync()
        const pausedEl = props.audios.map(item => {
            if (item.uri === props.audio) {
                return {
                    name: item.name,
                    singer: item.singer,
                    uri: item.uri,
                    state: 'paused',
                }
            } else {
                return {
                    name: item.name,
                    singer: item.singer,
                    uri: item.uri,
                    state: item.state,
                }
            }
        })
        props.setAudios(pausedEl)
        props.setIsPlay(false)
    }

    const playMusic = async () => {
        await props.sound.playAsync()
        const playEl = props.audios.map(item => {
            if (item.uri === props.audio) {
                return {
                    name: item.name,
                    singer: item.singer,
                    uri: item.uri,
                    state: 'play',
                }
            } else {
                return {
                    name: item.name,
                    singer: item.singer,
                    uri: item.uri,
                    state: item.state,
                }
            }
        })
        props.setAudios(playEl)
        props.setIsPlay(true)
    }


    const nextMusic = async () => {
        const index = await props.audios.findIndex(el => el.uri === props.audio)
        const nextTrack = await props.audios[index + 1]
        if (nextTrack !== undefined) {
            if (props.sound !== null) {
                await props.sound.stopAsync()
            }
            const {sound} = await Audio.Sound.createAsync({uri: nextTrack.uri})
            await sound.playAsync()
            props.setSound(sound)
            const nextEl = props.audios.map(item => {
                if (item.uri === nextTrack.uri) {
                    return {
                        name: item.name,
                        singer: item.singer,
                        uri: item.uri,
                        state: 'play',
                    }
                } else {
                    return {
                        name: item.name,
                        singer: item.singer,
                        uri: item.uri,
                        state: 'stopped',
                    }
                }
            })
            props.setAudios(nextEl)
            props.setAudio(nextTrack.uri)
            if (props.isPlay === false) {
                props.setIsPlay(true)
            }
        }
    }

    const prevMusic = async () => {
        const index = await props.audios.findIndex(el => el.uri === props.audio)
        const prevTrack = await props.audios[index - 1]
        if (prevTrack !== undefined) {
            if (props.sound !== null) {
                await props.sound.stopAsync()
            }
            const {sound} = await Audio.Sound.createAsync({uri: prevTrack.uri})
            await sound.playAsync()
            props.setSound(sound)
            const nextEl = props.audios.map(item => {
                if (item.uri === prevTrack.uri) {
                    return {
                        name: item.name,
                        singer: item.singer,
                        uri: item.uri,
                        state: 'play',
                    }
                } else {
                    return {
                        name: item.name,
                        singer: item.singer,
                        uri: item.uri,
                        state: 'stopped',
                    }
                }
            })
            props.setAudios(nextEl)
            props.setAudio(prevTrack.uri)
            if (props.isPlay === false) {
                props.setIsPlay(true)
            }
        }
    }

    let playing;
    let back;
    let next;

    if (props.audios.length > 1) {
        back = <Pressable onPress={prevMusic}><Image style={{marginRight: 50, width: 20, height: 20, transform: [{rotate: '180deg'}]}} source={{ uri: "https://img.icons8.com/?size=100&id=9990&format=png&color=000000" }}/></Pressable>
    }

    if (props.audios.length > 1) {
        next = <Pressable onPress={nextMusic}><Image style={{marginLeft: 50, width: 20, height: 20}} source={{ uri: "https://img.icons8.com/?size=100&id=9990&format=png&color=000000" }}/></Pressable>
    }

    if (props.isPlay) {
        playing = <Pressable onPress={pauseMusic}><Image source={{ uri: "https://img.icons8.com/?size=100&id=9987&format=png&color=000000" }} style={{width: 20, height: 20}}/></Pressable>
    } else {
        playing = <Pressable onPress={playMusic}><Image source={{ uri: "https://img.icons8.com/?size=100&id=9978&format=png&color=000000" }} style={{width: 20, height: 20}}/></Pressable>
    }

    return (
        <View style = {{
            flexDirection: 'row',
        }}>
            {back}
            {playing}
            {next}
        </View>
    )
}

export default Footer