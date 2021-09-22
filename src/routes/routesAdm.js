import React, {useContext} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {Context} from '../Context/AuthContext'

import {Login} from '../pages/Login';
import {Dashboard} from '../pages/Dashboard';
import {Users} from '../pages/Users';
import {AddUser} from '../pages/AddUser';
import {ViewUser} from '../pages/ViewUser';
import { EditUser} from '../pages/EditUser';
import { EditUserPassword} from '../pages/EditUserPassword';
import { ViewProfile} from '../pages/ViewProfile';
import { EditProfile} from '../pages/EditProfile';
import { EditProfilePassword} from '../pages/EditProfilePassword';
import { AddUserLogin} from '../pages/AddUserLogin';
import {RecoverPassword} from '../pages/RecoverPassword';
import {UpdatePassword} from '../pages/UpdatePassword';




function CustomRoute({isPrivate, ...rest}) {
     const {authenticated} = useContext(Context);
     
     if(isPrivate && !authenticated){
        return <Redirect to="/" />
    }
    return <Route {...rest} />
}

export default function RoutesAdm() {
    return (
        <Switch>
            <CustomRoute exact path="/" component={Login} />
            <CustomRoute exact path="/add-user-login" component={AddUserLogin} />
            <CustomRoute exact path="/recover-password" component={RecoverPassword} />
            <CustomRoute exact path="/update-password/:key" component={UpdatePassword} />
            
            <CustomRoute exact isPrivate path="/dashboard" component={Dashboard} />
            <CustomRoute exact isPrivate path="/users" component={Users} />
            <CustomRoute exact isPrivate path="/add-user" component={AddUser} />
            <CustomRoute exact isPrivate path="/view-user/:id" component={ViewUser} />
            <CustomRoute exact isPrivate path="/view-profile" component={ViewProfile} />
            <CustomRoute exact isPrivate path="/edit-user/:id" component={EditUser} />
            <CustomRoute exact isPrivate path="/edit-user-password/:id" component={EditUserPassword} />
            <CustomRoute exact isPrivate path="/edit-profile" component={EditProfile} />
            <CustomRoute exact isPrivate path="/edit-profile-password" component={EditProfilePassword} />
        </Switch>
    )
}