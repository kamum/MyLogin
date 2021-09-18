import React, { useEffect, useState } from 'react';

import api from '../../config/configApi';

import { Link, useLocation } from 'react-router-dom'

export const Users = () => {

    const { state } = useLocation();;

    const [data, setData] = useState([]);

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : ""
    })

    const getUsers = async () => {

        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        await api.get("/users", headers)
            .then((response) => {
                setData(response.data.users);
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type: 'error',
                        mensagem: 'Erro: tente mais tarde!'
                    })
                }
            })
    }

    useEffect(() => {
        getUsers();
    }, []);

    const deleteUser = async (idUser) => {

        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        await api.delete('/user/' + idUser, headers)
        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            });
            getUsers();
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                })
            }else{
                setStatus({
                    type: 'error',
                    mensagem: "Erro: tente mais tarde."
                })
            }
        });
    }


    return (
        <>

            <Link to="/dashboard">Dashboard</Link><br />
            <Link to="/users">Usuários</Link><br />
            <h1>Listar Usuário</h1>
            <Link to="/add-user">Cadastrar usuário</Link><br/><hr/>

            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}
            {status.type === 'success' ? <p>{status.mensagem}</p> : ""}

            {data.map(user => (
                <div key={user.id}>
                    <span>{user.id}</span><br />
                    <span>{user.name}</span><br />
                    <span>{user.email}</span><br /><br/>
                    <Link to={"/view-user/" + user.id}><button type="button">Visualizar</button></Link><br /><br/>
                    <Link to={"/edit-user/" + user.id}><button type="button">Editar</button></Link><br /><br/>
                    <Link to={"#"}>
                        <button type="button" onClick={() => deleteUser(user.id)}>Apagar</button>
                    </Link>
                    <hr />

                </div>
            ))}
        </>
    )

}