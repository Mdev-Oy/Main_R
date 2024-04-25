import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, SegmentedButtons } from 'react-native-paper';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { LineChart } from "react-native-gifted-charts";

export const Stats = () => {
    const user = auth.currentUser;

    const [barData, setBarData] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(0); 
    const [value, setValue] = React.useState('');
    useEffect(() => {
        fetchFocusedTimeData(currentWeek);
    }, [currentWeek]);

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
        })));
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

    
    


  
    return (
        <View style = {styles.container}>

        <View style = {styles.all_buttons}>
        <SegmentedButtons
            theme={{colors: {secondaryContainer: '#FFFFFF'}}}
            style= {{width: '90%'}}
                value={value}
                onValueChange={setValue}
                
                buttons={[
                {
                    icon: 'chart-pie',
                    value: 'daily',
                    label: 'Daily',
                    uncheckedColor: '#FFFFFF',
                    checkedColor: '#202022'
                },
                
                {
                    icon: 'calendar-week',
                    value: 'weekly',
                    label: 'Weekly',
                    uncheckedColor: '#FFFFFF',
                    checkedColor: '#202022'
                },
                {
                    icon: 'star',
                    value: 'achievements',
                    label: 'Achievements',
                    uncheckedColor: '#FFFFFF',
                    checkedColor: '#202022'
                },
            ]}
            />
            </View>
          <View style = {styles.buttonRow}>



          <Button
            style = {styles.item}
            icon='arrow-left-bold'
            buttonColor="#202022"
            textColor='#FFFFFF'
            rippleColor="#bababa" 
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
                backgroundColor="#161618"
                initialSpacing={15}
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
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#161618',
      justifyContent: 'center' 
  },

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