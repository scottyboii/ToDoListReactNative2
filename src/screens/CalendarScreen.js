import { StyleSheet} from "react-native";
import React from 'react';
import {Calendar} from 'react-native-calendars';

const CalendarScreen = ({route, navigation}) => {
    const params = route.params
    let dates = {}

    params.forEach( 
        (item )=> {
            dates[item.date] = {selected: true, color: item.colour}
        }
    )

    return (
        <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={dates}
      markingType={"period"}
    />
    )
}

export default CalendarScreen

const styles = StyleSheet.create({})