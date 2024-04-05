import React, { useEffect, useState } from 'react';
import { CircularProgress } from 'react-native-circular-progress';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const GradeScreen = ({ route }) => {
    const navigation = useNavigation();
    const [score, setScore] = useState(null);
    const [progressArray, setProgressArray] = useState([
        { "Energy": 20 },
        { "Fat": 0 },
        { "Fiber": 0 },
        { "Fruits": 0 },
        { "Protein": 0 },
        { "Salt": 0 },
        { "Sugar": 0 }
    ]);

    useEffect(() => {
        if (!route.params || !route.params.score) {
            setScore({
                score: [
                    "C",
                    {
                        Energy: "10 / 10",
                        Fat: "9 / 10",
                        Fiber: "0 / 10",
                        Fruits: "0 / 10",
                        Protein: "1 / 10",
                        Salt: "10 / 10",
                        Sugar: "10 / 10"
                    }
                ]
            });
        } else {
            setScore(route.params.score);
            updateProgressArray(route.params.score[1]);
        }
    }, [route.params]);

    const updateProgressArray = (data) => {
        const progressValues = Object.entries(data).map(([key, value]) => ({
            [key]: parseFloat(value.split(' / ')[0]) * 100 / parseFloat(value.split(' / ')[1])
        }));
        setProgressArray(progressValues);
    };

    let imageSource;
    if (score && score.length > 0) {
        switch (score[0]) {
            case 'A':
                imageSource = require('./images/finalA.png');
                break;
            case 'B':
                imageSource = require('./images/finalB.png');
                break;
            case 'C':
                imageSource = require('./images/finalC.png');
                break;
            case 'D':
                imageSource = require('./images/finalD.png');
                break;
            case 'E':
                imageSource = require('./images/finalE.png');
                break;
            default:
                imageSource = require('./images/finalA.png');
                break;
        }
    }

    return (
        <View style={styles.container}>
            {/* <Button title='Back' onPress={() => navigation.navigate('CameraScreen')} /> */}
            <Text style={styles.text}>Grade Received</Text>
            <Image
                source={imageSource}
                style={styles.image}
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.mediumView}>
                    {progressArray.map((progress, index) => {
                        const key = Object.keys(progress)[0];
                        const value = Object.values(progress)[0];
                        return (
                            value !== 0 ?
                                <View key={index} style={styles.progressBarContainer}>
                                    <Text style={styles.label}>{key}</Text>
                                    <CircularProgress
                                        size={100}
                                        width={10}
                                        fill={value}
                                        tintColor="rgba(52, 152, 219, 0.9)"
                                        backgroundColor="rgba(52, 152, 219, 0.3)"
                                        lineCap="round"
                                    >
                                        {(fill) => (
                                            <Text style={styles.progressText}>
                                                {Math.round(fill)}%
                                            </Text>
                                        )}
                                    </CircularProgress>
                                </View> : null
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
    },
    text: {
        fontSize: 20,
        paddingRight: 10,
        marginBottom: 30,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    mediumView: {
        width: '100%',
        borderRadius: 55,
        backgroundColor: '#F0F0F0',
        padding: 20,
        marginTop: 50,
    },
    progressBarContainer: {
        marginVertical: 10,
        marginTop: 40,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3498db',
    },
});

export default GradeScreen;
