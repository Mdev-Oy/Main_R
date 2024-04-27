import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, SegmentedButtons, Card, Avatar, useTheme } from 'react-native-paper';
import { doc, getDoc, getDocs, updateDoc , collection, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { LineChart } from "react-native-gifted-charts";

export const Stats = () => {

    const theme = useTheme();
    const user = auth.currentUser;

    const [showAchievements, setShowAchievements] = useState(false);
    const [showWeekly, setShowWeekly] = useState(true);


    const [barData, setBarData] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(0); 
    const [value, setValue] = React.useState('');
    const [achievements, setAchievements] = useState([]);
    const [longestSession, setLongestSession] = useState(0);
    const [totalFocusedTime, setTotalFocusedTime] = useState(0);
    


    useEffect(() => {
        fetchFocusedTimeData(currentWeek);
    }, [currentWeek]);

    useEffect(() => {
        fetchUserData();
        checkAchievements(totalFocusedTime);
    }, []);

    const fetchFocusedTimeData = async (weekIndex) => {
        const weekDays = calculateWeekDays(weekIndex);
        const startDate = Date.parse(weekDays[0]);
        const endDate = Date.parse(weekDays[weekDays.length - 1]);

        const statsRef = collection(db, "users", user.uid, "stats");
        const q = query(statsRef,
            where('date', '>=', startDate),
            where('date', '<=', endDate));

        const querySnapshot = await getDocs(q);
        console.log(startDate, endDate, querySnapshot.docs);
        const weeklyFocusedTime = new Array(7).fill(0); 

        querySnapshot.forEach(doc => {
            const docData = doc.data();
            console.log(docData);
            const date = new Date(docData.date); 
            console.log(date);
            const dayIndex = date.getDay(); 
            weeklyFocusedTime[dayIndex] = docData.focusedTime;
        });


        setBarData(weeklyFocusedTime.map((value, index) => ({
            label: weekDays[index].toLocaleDateString('fi-fi', { month: 'numeric', day: 'numeric' }),
            value
        })).reverse());
    };

    const calculateWeekDays = (weekIndex) => {
        const now = new Date();
        const startOfWeek =  new Date(now.setDate(now.getDate() - now.getDay() - (weekIndex * 7))); 

        const weekDays = [];
        for (let i = 0; i <= 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            weekDays.push(date);
        }

        return weekDays;
    };

    const displayPreviousWeek = () => {
        setCurrentWeek(currentWeek - 1);
    };

    const displayNextWeek = () => {
        setCurrentWeek(currentWeek + 1);
    };


    const fetchUserData = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const data = await getDoc(userDocRef);
    
        if (data.exists()) {
          setTotalFocusedTime(data.data().focusedTime);
          setLongestSession(data.data().longestSession);
          setAchievements(data.data().achievements); 
        } else {
          setTotalFocusedTime(0);
        }
    }

    const checkAchievements = (totalFocusedTime) => { // should be changed for marathon
        achievements.forEach(async (achievement, index) => {
          if (!achievement.completed) {

            if (achievement.name === "Beginer" && totalFocusedTime >= 60) {
              await updateAchievement(index, true); 
            } else if (achievement.name === "Focused Apprentice" && totalFocusedTime >= 300) {
              await updateAchievement(index, true);
            } else if (achievement.name === "Time Master" && totalFocusedTime >= 600) {
                await updateAchievement(index, true);
            } else if (achievement.name === "Focus Guru" && totalFocusedTime >= 1500) {
                await updateAchievement(index, true);
            } else if (achievement.name === "Marathon" && longestSession >= 30) {
                await updateAchievement(index, true);
            } else if (achievement.name === "Marathon II" && longestSession >= 60) {
                await updateAchievement(index, true);
            }
          }
        });
      };
      
      const updateAchievement = async (index, completed) => {
        try {
          const newAchievements = [...achievements]; 
          newAchievements[index].completed = completed;
          setAchievements(newAchievements); 
      
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            achievements: newAchievements 
          });
        } catch (error) {
          console.error(error)
        }
      };





    
    


  
    return (
    <View style = {{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center' 
    }}>


    <View style = {styles.all_buttons}>
        <SegmentedButtons
            theme={{colors: {secondaryContainer: '#FFFFFF'}}}
            style= {{width: '90%'}}
                value={value}
                onValueChange={setValue}
                
                buttons={[

                {
                    icon: 'calendar-week',
                    value: 'weekly',
                    label: 'Weekly stats',
                    uncheckedColor: '#FFFFFF',
                    checkedColor: '#202022',
                    onPress: () => {setShowAchievements(false); setShowWeekly(true);}
                },
                {
                    icon: 'star',
                    value: 'achievements',
                    label: 'Achievements',
                    uncheckedColor: '#FFFFFF',
                    checkedColor: '#202022',
                    onPress: () => {setShowAchievements(true); setShowWeekly(false);}
                },
            ]}
            />
            </View>


    {showAchievements ? (
    <View>
    <FlatList
        data={achievements}
        renderItem={({ item: achievement }) => ( 
        <View key={achievement.name}>  
            <Card.Title
                style={{ borderRadius: 5 }}
                title={(
                    <Text>{achievement.name}</Text>
                )}
                titleStyle={{ fontSize: 14, color: achievement.completed ? ('#FFFFFF') : ('rgba(255,255,255,0.3)') }}
                subtitle={(
                    <Text>{achievement.description}</Text>
                )}
                subtitleStyle={{ fontSize: 14, color: achievement.completed ? ('#FFFFFF') : ('rgba(255,255,255,0.3)') }}
                left={(props) => (
                <Avatar.Icon
                    {...props}
                    icon = {achievement.icon}
                    color = {achievement.completed ? ('#FFFFFF') : ('rgba(255,255,255,0.3)')}
                    backgroundColor='transparent'
                    size={50}
                />
                )}
            /> 
        </View>
  )}
  keyExtractor={(achievement) => achievement.name} 
/>
  </View>
) : (<></> )}
    
    {showWeekly ? (
            <View style = {styles.all_buttons}> 
            <View style = {styles.buttonRow}>
            <Button
                style = {styles.item}
                icon='arrow-left-bold'
                buttonColor="#202022"
                textColor='#FFFFFF'
                rippleColor="#bababa" 
                disabled={currentWeek == 0 ? true : false}
                onPress={displayPreviousWeek}>
            </Button> 
        
            <Button
                style = {styles.item}
                icon='arrow-right-bold'
                buttonColor="#202022"
                textColor='#FFFFFF'
                rippleColor="#bababa" 
                onPress={displayNextWeek}>
            </Button> 
            </View>
        
            <View style = {''}>
                    <LineChart
                    dataPointsColor1='#FFFFFF'
                        areaChart
                        data={barData}
                        xAxisType={'solid'}
                        xAxisColor={'#FFFFFF'}
                        yAxisTextStyle={{color: '#FFFFFF'}}
                        labelWidth={10}
                        hideRules
                        xAxisLabelTextStyle={{color: '#FFFFFF', textAlign: 'center'}}
                        thickness={0}
                        color="rgba(239,239,239,0.7)"
                        noOfSections={3}
                        curved
                        startFillColor="rgb(255, 255, 255)"
                        endFillColor="rgb(230, 230, 230)"
                        startOpacity={0.8}
                        endOpacity={0.5}
                        backgroundColor={theme.colors.background}
                        initialSpacing={20}
                        yAxisColor="#FFFFFF"
                        pointerConfig={
                            {
                                pointerColor: '#FFFFFF',
                                radius: 3,
                                showPointerStrip: false,
                                activatePointersOnLongPress: true,
                                autoAdjustPointerLabelPosition: false,
                                pointerLabelComponent: items => {
                                    return (
        
                                        <View>
                                          <Text style={{color: '#FFFFFF',fontSize:12}}> {items[0].value} min </Text>
                                        </View>)
                                }
                            }
        
                        }
                    />
                    </View>        
            </View>
    ) : (
        <></>
    )}


          
</View>
    );
};

const styles = StyleSheet.create({

  all_buttons: {
    alignSelf: 'center',
    marginBottom: '10%',
  },


  buttonRow: {
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25 
  },

  item: {
  }

});