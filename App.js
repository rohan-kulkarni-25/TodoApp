import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Vibration,
} from "react-native";

import {
  Appbar,
  Colors,
  TextInput,
  Avatar,
  Button,
  Card,
  Title,
  Dialog,
  Paragraph,
  Portal,
  Provider,
} from "react-native-paper";

const isAndroid = Platform.OS === "android";
const height = StatusBar.currentHeight;

export default function App() {
  const [task, setTask] = React.useState("");
  const [cards, setCards] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const generateTask = () => {
    const taskObj = {
      id: `${task}${Math.random()}`,
      title: task,
      isCompleted: false,
      deleted: false,
    };
    return taskObj;
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@task_array");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const storeData = async () => {
    try {
      let tasksArray = await getData();
      if (tasksArray === null) {
        tasksArray = [];
      }
      const taskObj = generateTask();
      tasksArray.push(taskObj);
      const taskArrayString = JSON.stringify([...tasksArray]);
      await AsyncStorage.setItem("@task_array", taskArrayString);

      loadTasks();
      setTask("");
    } catch (e) {
      console.log(e);
    }
  };

  const markCompleted = async (key) => {
    try {
      let taskArray = await getData();
      taskArray.forEach((task) => {
        if (task.id === key) {
          task.isCompleted = true;
        }
      });
      console.log(taskArray);
      const taskArrayString = JSON.stringify([...taskArray]);
      await AsyncStorage.setItem("@task_array", taskArrayString);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (key) => {
    try {
      let taskArray = await getData();
      taskArray.forEach((task) => {
        if (task.id === key) {
          task.deleted = true;
        }
      });
      const taskArrayString = JSON.stringify([...taskArray]);
      await AsyncStorage.setItem("@task_array", taskArrayString);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const loadTasks = async () => {
    try {
      let tasksArray = await getData();
      if (tasksArray.length > 0) {
        tasksArray = tasksArray.reverse();
        const tasksCardArray = tasksArray.map((task) => {
          if (!task.deleted) {
            return (
              <Card
                style={{
                  backgroundColor: task.isCompleted ? "green" : "orange",
                  marginTop: 5,
                  marginBottom: 5,
                  color: "white",
                }}
                key={task.id}
              >
                <Title style={styles.tasktitle}>{task.title}</Title>
                <Card.Actions>
                  <Button
                    color={Colors.black}
                    onPress={() => markCompleted(task.id)}
                  >
                    {task.isCompleted ? "" : "COMPLETED"}
                  </Button>
                  <Button
                    color={Colors.red900}
                    onPress={() => deleteTask(task.id)}
                  >
                    DELETE
                  </Button>
                </Card.Actions>
              </Card>
            );
          }
        });
        setCards(tasksCardArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async () => {
    await AsyncStorage.clear();
    loadTasks();
  };

  useEffect(() => {
    basicLoad();
    loadTasks();
  }, []);

  const updateName = async () => {
    await AsyncStorage.setItem("@name", name);
    setVisible(false);
  };

  const basicLoad = async () => {
    const jsonValue = await AsyncStorage.getItem("@name");
    if (jsonValue === null) {
      setVisible(true);
    }
    setName(jsonValue);
  };

  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Your Name</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Please enter your name"
                value={name}
                onChangeText={(name) => setName(name)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={updateName}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      <SafeAreaView style={{ height: "100%" }}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content
            style={styles.content}
            title="TODO APP"
            subtitle={"Keep track of pending work"}
          />
        </Appbar.Header>
        <Text style={styles.welcome}>{`WELCOME ${name.toUpperCase()}`}</Text>
        <View style={styles.addTaskInput}>
          <TextInput
            mode="outlined"
            style={styles.textinput}
            label="ADD TASK"
            placeholder="Will you like to add pending work ?"
            value={task}
            onChangeText={(task) => setTask(task)}
          />
          <Button
            style={styles.addtaskbtn}
            mode="contained"
            onPress={storeData}
          >
            ADD
          </Button>
        </View>
        <ScrollView style={styles.scrollViewList}>{cards}</ScrollView>
        <Text style={styles.footer}>MADE WITH ❤️ BY ROHAN</Text>
        <ExpoStatusBar style="auto" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "black",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  addTaskInput: {
    backgroundColor: "white",
    margin: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  textinput: {
    display: "flex",
    // flexGrow: 1,
  },
  addtaskbtn: {
    backgroundColor: "black",
    marginTop: 2,
    justifyContent: "center",
  },
  tasklistview: {
    marginTop: 20,
    margin: 2,
  },
  taskcard: {
    backgroundColor: "black",
    marginTop: 5,
    marginBottom: 5,
    // color: "white",
  },
  tasktitle: {
    paddingLeft: 15,
    paddingTop: 5,
    // color: "white",
  },
  scrollViewList: {
    margin: 10,
    flexDirection: "column",
  },
  footer: {
    textAlign: "center",
    backgroundColor: "black",
    padding: 5,
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
