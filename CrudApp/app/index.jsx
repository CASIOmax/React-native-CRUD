import { useState } from "react";
import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {data} from '@/data/todos.js'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Index() {

  const [todos,setTodos]= useState(data.sort((a,b)=>b.id - a.id))
  const [text,setText]=useState('')


  const addTodo = (id)=>{
    if(text.trim()){
      const newId=todos.length > 0 ? todos[0].id+1 : 1;
      setTodos([{id:newId,title:text, completed:false}, ...todos]);
      setText('')
    }
  }
  const toggleTodo = (id)=>{
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed:!todo.completed} :todo))
  }
  const removeTodo = (id)=>{
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const renderItem=({item})=>(
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={()=> toggleTodo(item.id)}
      >
        {item.title}
      </Text>
        <Pressable onPress={()=> removeTodo(item.id)}>
          <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
        </Pressable>
    </View>
  )



  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new Todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}
        >
          <Text style={styles.addButtonText}
          >Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todos=>todos.id.toString()}
        contentContainerStyle={{flexGrow:1}}

      />
    </SafeAreaProvider>  
  );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    // backgroundColor:'black'
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom:20,
    padding:10,
    width:'100%',
    marginHorizontal:'auto',
    pointerEvents:'auto',
  },
  input:{
    flex:1,
    borderColor:'gray',
    borderWidth:2,
    borderRadius:5,
    padding:10,
    marginRight:10,
    fontSize:18,
    minWidth:0,
    color:'black'
  },
  addButton:{
    backgroundColor:'gray',
    color:'white',
    borderRadius:5,
    padding:10,

  },
  addButtonText:{
    color:"white",
    fontSize:18,
    fontWeight:"bold"

  },
  todoItem:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    gap:4,
    padding:10,
    borderBottomColor: 'gray',
    borderBottomWidth:1,
    width:'100%',
    maxWidth:1024,
    marginHorizontal:'auto',
  },
  todoText:{
    flex:1,
    fontSize:18,
    color:'black'
  },
  completedText: {
    textDecorationLine:'line-through',
    color:'gray'
  }

  
})