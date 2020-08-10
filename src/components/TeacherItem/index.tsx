import React, { useState } from 'react'

import {View, Image, Text, Linking} from 'react-native'
import styles from './styles'
import { RectButton } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png'
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png'
import whatsappIcon from '../../assets/images/icons/whatsapp.png'
import api from '../../services/api'


export interface Teacher{
    id: number,
    avatar: string,
    bio: string,
    cost: number,
    name: string,
    subject: string
    whatsapp: string

}

interface TeacherItemProps{
    teacher: Teacher,
    favorited: boolean
}


const TeacherItem: React.FC<TeacherItemProps> = ({teacher, favorited})=>{

    const [isFavortited , setIsFavoritited] = useState(favorited)

    function handleLinkToWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`)
        api.post('connections',  {
            user_id: teacher.id
        })
        
    }

    async function handleToggleFavorite(){
       
            const favorites = await AsyncStorage.getItem('favorites')

            let favoritesArray = []
            
            if(favorites){
               favoritesArray = JSON.parse(favorites)
            }

            if(isFavortited){
                const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher)=>{
                    return teacherItem.id === teacher.id
                })
            

            favoritesArray.splice(favoriteIndex, 1)

            setIsFavoritited(false)

        }else{
                favoritesArray.push(teacher)

                setIsFavoritited(true)
            }


        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray))
    }

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image 
                    style={styles.avatar} 
                    source={{ uri: teacher.avatar}}
                />
                
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{teacher.name}</Text>
                    <Text style={styles.subject}>{teacher.subject}</Text>
                </View>

            </View>

            <Text style={styles.bio}>
                {teacher.bio}
            </Text>

            <View style={styles.footer}> 
                <Text style={styles.price}>
                    Preço/Hora {'    '}
                    <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
                </Text>

                <View style={styles.buttonsContainer}>
                    <RectButton 
                    onPress={handleToggleFavorite}
                    style={[
                            styles.favoriteButton,
                            isFavortited ? styles.favorited: {},
                        ]}
                    >
                        {isFavortited
                            ? <Image source={unfavoriteIcon}/> 
                            :<Image source={heartOutlineIcon}/>}
                        {/*<Image source={heartOutlineIcon}/>*/}
                        
                    </RectButton>

                    <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
                        <Image source={whatsappIcon}/>
                        <Text style={styles.contactButtonText}>Entrat em contato</Text>
                    </RectButton>
                </View>
            </View>

        </View>
    )
}

export default TeacherItem