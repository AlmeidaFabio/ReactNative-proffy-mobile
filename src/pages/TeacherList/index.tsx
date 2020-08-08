import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput } from 'react-native'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'

import { Feather } from '@expo/vector-icons'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'

import styles from './styles'
import api from '../../services/api'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native'

function TeacherList() {
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [favorites, setFavorites] = useState<number[]>([])
    const [subject, setSubject] = useState('')
    const [week_day, setWeekDay] = useState('')
    const [time, setTime] = useState('')

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if(response) {
                const favoritedTeachers = JSON.parse(response)

                const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                })

                setFavorites(favoritedTeachersId)
            }
        })
    }

    useFocusEffect(() => {
        loadFavorites()
    })

    function toogleFilterVisible() {
        setIsFilterVisible(true)
    }

    async function filterSubmit() {
        loadFavorites()

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        })

        setTeachers(response.data)
        setIsFilterVisible(false)
    }

    return(
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={toogleFilterVisible}>
                        <Feather name="filter" size={20} color="#fff"/>
                    </BorderlessButton>
                )}
                
                >

                {isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput 
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            style={styles.input} 
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#c1bccc"
                        />

                        <View style={styles.inputGroup} >
                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Dia da semana</Text>
                                <TextInput 
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    style={styles.input} 
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>

                            <View style={styles.inputBlock} >
                                <Text style={styles.label} >Horário</Text>
                                <TextInput 
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    style={styles.input} 
                                    placeholder="Qual o horário?"
                                    placeholderTextColor="#c1bccc"
                                />
                            </View>
                        </View>

                        <RectButton onPress={filterSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                </View>
                )}
            </PageHeader>

            <ScrollView style={styles.teacherList} contentContainerStyle={
                {
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }
            }>
                {teachers.map((teacher: Teacher) => {
                    return <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)}/>
                })}
            </ScrollView>
        </View>
    )
}

export default TeacherList