import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Modal, ScrollView} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Fallback from '../components/Fallback';
let firstRun = true;

const ToDoScreen = ({navigation}) => {
    // Init local states
    const[todo, setTodo] = useState("");
    const[dueDate, setDueDate] = useState("");
    const[todoList, setTodoList] = useState([]);
    const[editedTodo, setEditedTodo] = useState(null);
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [priorityValue, setPriorityValue] = useState("Low");
    const [priority, setPriority] = useState([
        {label: 'High', value: 'High'},
        {label: 'Medium', value: 'Medium'},
        {label: 'Low', value: 'Low'},
    ])
    const [prioritySelectorOpen, setPrioritySelectorOpen] = useState(false);
    const [prioritySelectorValue, setPrioritySelectorValue] = useState("All");
    const [prioritySelector, setPrioritySelector] = useState([
        {label: 'All', value: 'All'},
        {label: 'High', value: 'High'},
        {label: 'Medium', value: 'Medium'},
        {label: 'Low', value: 'Low'},
    ])
    const [showModal, setShowModal] = useState(false);
    const [colour, setColour] = useState("#000000")
    const onChange = ({ hex }) => {
        setColour(hex)
    };

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    const storeData = async (value) => {
        try {
            await sleep(1000)
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('todolist', jsonValue);
        } catch (e) {
          // saving error
        }
    };

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('todolist');
          setTodoList(jsonValue != null ? JSON.parse(jsonValue) : [])
        } catch (e) {
          // error reading value
        }
      };

    // Handle add todo
    const handleAddTodo = () => {
        const newId = Date.now().toString();
        setTodoList([...todoList, {id: newId, title: todo, date: dueDate, priority: priorityValue, colour: colour}])
        setTodo("")
        setDueDate("")
        setPriorityValue("All")
        setColour("#000000")
    }

    //Handle delete todo
    const handleDeleteTodo = (id) => {
        setTodoList([...todoList.filter((item) => item.id !== id)])
    }

    //Handle edit todo
    const handleEditTodo = (todo) => {
        setTodo(todo.title)
        setDueDate(todo.date)
        setPriorityValue(todo.priority)
        setColour(todo.colour)
        setEditedTodo(todo)
    }

    if (firstRun == true) {
        firstRun = false
        getData();
    }

    useEffect(() => {
        storeData(todoList)
        console.log("Updating")
    }, [todoList])

    //Handle update todo
    const handleUpdateTodo = () => {
        const updatedTodos = todoList.map((item) => {
            if(item.id === editedTodo.id) {
                return {...item, title: todo, date: dueDate, priority: priorityValue, colour: colour}
            }

            return item
        });
        setTodoList(updatedTodos)
        setEditedTodo(null)
        setTodo("")
        setDueDate("")
        setPriorityValue("All")
        setColour("#000000")
    }
    //Render todo
    const renderToDos = ({item, index}) => {
        if (prioritySelectorValue === "All" || item.priority === prioritySelectorValue) {
            return (
                <View style={{
                    backgroundColor: item.colour,
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 12,
                    marginBottom: 6,
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <Text style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight:"800",
                        flex:1,
                    }}>
                        {item.title} {item.date} {item.priority} {item.colour}
                    </Text>
                    <IconButton icon="pencil" iconColor='white' onPress ={() => handleEditTodo(item)}/>
                    <IconButton icon="trash-can" iconColor='white' onPress= {() => handleDeleteTodo(item.id)}/>
                </View>
            )
        }
    }

    return (
        <ScrollView style={{marginHorizontal: 16, marginTop: 6}}>
            <DropDownPicker
                style={{
                    marginTop: 7
                }}
                open={prioritySelectorOpen}
                value={prioritySelectorValue}
                items={prioritySelector}
                setValue={setPrioritySelectorValue}
                setItems={setPrioritySelector}
                setOpen={setPrioritySelectorOpen}
                containerStyle={{zIndex: 99}}
            />
            <IconButton icon="calendar" style={{flex:1}} iconColor='black' onPress= {() => navigation.navigate('Calendar', todoList)}/>
            <TextInput
                style={{
                    borderWidth:2, 
                    borderColor:"#1e90ff", 
                    borderRadius: 6, 
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 5
                }}
                placeholder='Task Name'
                value={todo}
                onChangeText={userText => setTodo(userText)}
            />
            <TextInput
                style={{
                    borderWidth:2, 
                    borderColor:"#1e90ff", 
                    borderRadius: 6, 
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 5
                }}
                placeholder='Due Date'
                value={dueDate}
                onChangeText={userText => setDueDate(userText)}
            />
            <DropDownPicker
                open={priorityOpen}
                value={priorityValue}
                items={priority}
                setValue={setPriorityValue}
                setItems={setPriority}
                setOpen={setPriorityOpen}
            />
            <Button title='Color Picker' onPress={() => setShowModal(true)} />

            <Modal visible={showModal} animationType='slide'>
            <ColorPicker style={{ width: '70%' }} value='red' onChange={onChange}>
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
            </ColorPicker>

            <Button title='Ok' onPress={() => setShowModal(false)} />
            </Modal>
            
            {
                editedTodo ? <TouchableOpacity
                style={{
                    backgroundColor: 'black',
                    borderRadius: 6,
                    paddingVertical: 8,
                    marginTop: 12,
                    marginBottom: 6,
                    alignItems: "center",
                }}
                onPress={() => handleUpdateTodo()}
                >
                <Text
                    style={{
                        color: 'white',
                        fontWeight: "bold",
                        fontSize: 20,
                }}>
                    Save</Text> 
            </TouchableOpacity> : <TouchableOpacity
                style={{
                    backgroundColor: 'black',
                    borderRadius: 6,
                    paddingVertical: 8,
                    marginTop: 12,
                    marginBottom: 6,
                    alignItems: "center",
                }}
                onPress={() => handleAddTodo()}
                >
                <Text
                    style={{
                        color: 'white',
                        fontWeight: "bold",
                        fontSize: 20,
                }}>
                    Add</Text>
            </TouchableOpacity>
            }

            {/* Render todo list */}
            
            <FlatList 
                data={todoList}
                renderItem={renderToDos}
            />
            {
                todoList.length <= 0 && <Fallback />
            }
        </ScrollView>
    );
}

export default ToDoScreen;

const styles = StyleSheet.create({
    
})