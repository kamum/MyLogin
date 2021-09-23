import React, { useEffect, useState } from 'react';
import { Redirect, Link, useLocation } from 'react-router-dom';
import api from '../../config/configApi';

import {Menu} from '../../Components/Menu'

export const ViewProfile = () => {

    const { state} = useLocation();
    
    const [data, setData] = useState('');
    const [addressImage, setAddressImage] = useState('');

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : ""
    });

    useEffect(() => {
        const getUser = async () => {

            const headers = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }

            await api.get("/view-profile", headers)
                .then((response) => {
                    if (response.data.user) {
                        setAddressImage(response.data.addressImage);
                        setData(response.data.user);
                    } else {
                        setStatus({
                            type: 'redError',
                            mensagem: "Erro: Perfil não encontrado!"
                        });
                    }

                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'redError',
                            mensagem: err.response.data.mensagem
                        });
                    } else {
                        setStatus({
                            type: 'redError',
                            mensagem: "Erro: Tente mais tarde!"
                        });
                    }
                });
        }

        getUser();
    }, []);

    return (
        <div>
            <Menu />

            <h1>Meu Perfil</h1>   
            <Link to="/edit-profile"><button type="button">Editar Perfil</button></Link>{" "}
            <Link to="/edit-profile-password"><button type="button">Editar senha</button></Link><br/>      
            <Link to="/edit-profile-image"><button type="button">Editar Imagem</button></Link><br/>      

            {status.type === 'redError' ?
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: "error",
                        mensagem: status.mensagem
                    }
                }} /> : ""}
            {status.type === 'success' ? <p>{status.mensagem}</p> : ""}

            <hr />
            
            <span>{data.id}</span><br />
            <span>{<img src={addressImage} alt="Imagem do usuário" width="150" height="150"/>}</span><br />
            <span>{data.name}</span><br />
            <span>{data.email}</span><br />
        </div>
    )
}