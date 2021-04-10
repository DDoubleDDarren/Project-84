import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity, FlatList} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId       : firebase.auth().currentUser.email,
      receiverId      : this.props.navigation.getParam('details')["username"],
      exchangeId      : this.props.navigation.getParam('details')["exchangeId"],
      itemName        : this.props.navigation.getParam('details')["item_name"],
      description     : this.props.navigation.getParam('details')["description"],
      recieverName          : '',
      recieverContact       : '',
      recieverAddress       : '',
      recieverRequestDocId  : ''
    }
  }

getRecieverDetails(){
  db.collection('users').where('username','==',this.state.receiverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().first_name,
        recieverContact : doc.data().mobile_number,
        recieverAddress : doc.data().address,
      })
    })
  });

  db.collection('exchange_requests').where('exchangeId','==',this.state.exchangeId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}

updateBarterStatus=()=>{
  db.collection('all_Barters').add({
    book_name        : this.state.itemName,
    exchange_id      : this.state.exchangeId,
    requested_by     : this.state.recieverName,
    donor_id         : this.state.userId,
    request_status      : "Donor Interested"
  })
}

addNotification(){
  console.log("in the function ",this.state.rec)
  var message = this.state.userName + " has shown interest in exchanging the items"

  db.collection("all_notifications").add({
    "targeted_user_id" : this.state.state.reciverId,
    "donor_id"         : this.state.userId,
    "exchangeId"       : this.state.exchangeId,
    "item_name"        : this.state.itemName,
    "date"             : firebase.firestore.FeildValue.serverTimestamp(),
    "notification_status"  : "unread",
    "message"          : message
  })
}

getNotifications=()=>{
  this.requestRef = db.collection("all_notifications")

  .where("notification_status", "==", "unread")
  .where("targeted_user_id","==",this.state.userId)

  .onSnapshot((snapshot)=>{
    var allNotifications = []
    snapshot.docs.map((doc) =>{
      var notification = doc.data()
      notification["doc_id"] = doc.id
      allNotifications.push(notification)
    });
  })
}

componentDidMount(){
  this.getRecieverDetails()
}

render(){
  return(
    <View style={styles.container}>
      <View style={{flex:0.1}}>
        <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
      </View>
      <View style={{flex:0.9}}>
        {
          this.state.allNotifications.length === 0
           ?(
            <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:25}}>YOu have no notifications</Text>
            </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allNotifications}
                renderItem={history.renderItem}
              />
             )
        }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})
