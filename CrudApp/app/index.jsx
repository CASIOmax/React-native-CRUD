import { useState , useContext, useEffect} from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {data} from '@/data/todos.js'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, {LinearTransition} from 'react-native-reanimated'
import Octicons from '@expo/vector-icons/Octicons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import { useRouter } from "expo-router";

export default function Index() {

  const [todos,setTodos]= useState([])
  const [text,setText]=useState('')
  const [loaded,error]=useFonts({
    Inter_500Medium,
  })
  const {colorScheme,setColorScheme,theme}=useContext(ThemeContext)

  const router=useRouter()


  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos=jsonValue != null ? JSON.parse(jsonValue):null

        if(storageTodos && storageTodos.length){
          setTodos(storageTodos.sort((a,b)=>b.id-a.id))
        }else{
          setTodos(data.sort((a,b)=>b.id-a.id))
        }

      } catch(e){
        console.error(e)
      }
    }
    fetchData()
  },[data])

  useEffect(()=>{
    const storeData=async()=>{
      try{
        const jsonValue=JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp",jsonValue)

      }catch(e){
        console.error(e)
      }
    }
    storeData()
  },[todos])

  if(!loaded && !error){
    return null
  }
  const styles=createStyles(theme,colorScheme)
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

  const handlePress=(id)=>{
    router.push(`/todos/${id}`)
  }

  const renderItem=({item})=>(
    <View style={styles.todoItem}>
      <Pressable onPress={()=> handlePress(item.id)} onLongPress={()=> toggleTodo(item.id)}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
      >
        {item.title}
      </Text>
      </Pressable>

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
          maxLength={30}
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}
        >
          <Text style={styles.addButtonText}
          >Add</Text>
        </Pressable>

        <Pressable onPress={()=>setColorScheme(colorScheme=='light'?'dark':'light')} style={{marginLeft:10}}

        >
          {colorScheme==='dark' ? 
            <Octicons  name="moon" size={36} color={theme.text} selectable={undefined} style={{width:36}}/>:
            <Octicons  name="sun" size={36} color={theme.text} selectable={undefined} style={{width:36}}/>}
        </Pressable>
        
      </View>
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todos=>todos.id.toString()}
        contentContainerStyle={{flexGrow:1}}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />

      <StatusBar style={colorScheme==='dark'?'light':'dark'}/>
      
    </SafeAreaProvider>  
  );
}
function createStyles(theme,colorScheme){
  
  return StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:theme.background
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
    fontFamily:'Inter_500Medium',
    minWidth:0,
    color:theme.text,
  },
  addButton:{
    backgroundColor:theme.button,
    color:'white',
    borderRadius:5,
    padding:10,

  },
  addButtonText:{
    color:colorScheme === 'dark'?'black':'white',
    fontSize:18,
    fontWeight:'bold'

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
    color:theme.text,
    fontFamily:'Inter_500Medium',
  },
  completedText: {
    textDecorationLine:'line-through',
    color:'gray'
  }

  
})
}