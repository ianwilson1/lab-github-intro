// Histogram.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime) => {
  const timeSlots = [];
  const start = new Date();
  start.setHours(startTime.split(":")[0], startTime.split(":")[1]);

  const end = new Date();
  end.setHours(endTime.split(":")[0], endTime.split(":")[1]);

  while (start <= end) {
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const timeLabel = `${hours % 12 || 12}:${minutes === 0 ? "00" : minutes} ${hours >= 12 ? "PM" : "AM"}`;
    timeSlots.push(timeLabel);
    start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
  }

  return timeSlots;
};

const Histogram = ({ data, startTime = "06:00", endTime = "22:00" }) => {
  const timeSlots = generateTimeSlots(startTime, endTime);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congestion for {data.day}</Text>
      <BarChart
        data={{
          labels: timeSlots,
          datasets: [
            {
              data: data.values.map(value => value * 100),
            },
          ],
        }}
        width={screenWidth - 60} // 40px for padding
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#f8f8f8",
          backgroundGradientFrom: "#f8f8f8",
          backgroundGradientTo: "#f8f8f8",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#ffa726",
          },
          barPercentage: 0.25, // Skinnier bars (1/4th of the width)
          xAxisLabelStyle: {
            transform: [{ rotate: "-90deg" }], // Rotate x-axis labels vertically
            left: -10,
            right: -10,
            position: "absolute",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default Histogram;
