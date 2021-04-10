import React, { Component} from 'react';
import { Header,Icon,IconComponent } from 'react-native-elements';
import { View, Text, StyeSheet } from 'react-native';
import db from '../config.js';
import firebase from 'firebase';
import { render } from 'react-dom';

export default class MyHeader extends Component{
  constructor(props){
    super(props)
      this.state = {
        userId : firebase.auth().currentUser.email,
        value = ""
      }
    }
    getNumberOfUnreadNotiications(){
      db.collection('all_notifications').where('notification_status','==',"unread").where('targeted_user_id','==',this.state.userId)
      .onSnapshot((snapshot)=>{
        var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
        this.setState({
          value: unreadNotifications.length
        })
      })
    }
  }

  componentDidMount(){
    this.getNumberOfUnreadNotification()
  }

  BellIconWithBadge=()=>{
    return(
      <View>
        <Icon name='bell' type='font-awesome' color='#696969' size={25}
        onPress={() => this.props.navigation.navigate('Notification')}/>
        <Badge
        value={this.state.value}
        containerStyle={{position:'absolute', top:-4,right:-4}}/>
      </View>
    )
  }

  render(){
    return(
      <Header leftComponent = {<Icon name = 'bars' type = 'font-awesome' color='#696969' onPress = {()=> this.props.navigation.toggleDraw()}/>
    }centerComponent = {{text : this.props.title, style : {color : '#435423', fontSize : 20, fontWeight : 'bold'}}}
    rightComponent = {<this.BellIconWithBadge{...this.props}/>}
    background = "#573849"
    />
    )
  }}