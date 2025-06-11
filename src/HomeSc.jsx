import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';

import { addTask, toggleTask, deleteTask } from './tasksSlice';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const HomeSc = () => {
    const [taskText, setTaskText] = useState('');
    const tasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();


    useEffect(() => {
        requestNotificationPermission();
    }, []);

    const requestNotificationPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus !== 'granted') {
                Alert.alert("Permission required", "Please enable notifications for reminders.");
            }
        }
    };

    const scheduleNotification = async (text) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Task Reminder",
                body: `Don't forget to: "${text}"`,
            },
            trigger: { seconds: 60 },
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity
                onPress={() => dispatch(toggleTask(item.id))}
                style={styles.taskTextWrapper}
            >
                <Text style={[styles.taskText, item.completed && styles.completedText]}>
                    {item.text}
                </Text>
                <Text style={{ color: item.completed ? 'blue' : 'green' }} >{item.completed ? 'Completed' : 'Pending'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(deleteTask(item.id))}>
                <Text style={{ color: 'red' }}>Del</Text>
            </TouchableOpacity>
        </View>
    );

    const handleAddTask = () => {
        if (taskText.trim()) {
            dispatch(addTask(taskText));
            scheduleNotification(taskText);
            setTaskText('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}> My Task</Text>

            <TextInput
                placeholder="Enter a new task"
                value={taskText}
                onChangeText={setTaskText}
                style={styles.input}
            />

            <TouchableOpacity style={styles.btn} onPress={handleAddTask}>
                <Text style={{ color: 'white' }}>Add task</Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
};

export default HomeSc;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        gap: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        alignSelf: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 16,
        marginRight: 8,
        borderRadius: 8,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    taskTextWrapper: {
        flex: 1,
        marginRight: 10,
    },
    taskText: {
        fontSize: 16,
    },
    completedText: {
        color: 'gray',

    },
    btn: {
        minWidth: 150,
        borderRadius: 10,
        padding: 12,
        alignSelf: 'center',
        backgroundColor: 'green',
        alignItems: 'center'
    }
});
