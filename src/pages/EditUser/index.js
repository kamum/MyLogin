import React, { useEffect, useState } from 'react'

import api from '../../config/configApi'

import {Link, Redirect} from 'react-router-dom'

export const EditUser = (props) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id] = useState(props.match.params.id);

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const editUser = async e => {
        e.preventDefault();

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        
        await api.put('/user', {id, name, email, password, headers})
        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            })

        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                })

            }else{
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente mais tarde."
                })

            }
        });
    }

    useEffect(() => {
        const getUser = async () => {

            const headers = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }

            await api.get("/user/" + id, headers)
                .then((response) => {
                    if (response.data.user) {
                        setName(response.data.user.name)
                        setEmail(response.data.user.email)
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Usuário não encontrado.'
                        });
                    }

                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'warning',
                            mensagem: err.response.data.mensagem
                        });
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Erro: Tente mais tarde.'
                        });
                    }
                })
        }
        getUser();
    }, [id])

    return (
        <div>
            <Link to="/dashboard">Dashboard</Link><br />
            <Link to="/users">Usuários</Link><br />

            <h1>Editar Usuário</h1>

            <Link to="/users">Listar</Link><br/>

            {status.type === 'warning' ? 
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: "error",
                        mensagem: status.mensagem
                    }
                }} />
            : ""}

            {status.type === 'success' ? 
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: 'success',
                        mensagem: status.mensagem
                    }
                }} /> 
            : ""}
            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}


            <hr />
            <form onSubmit={editUser}>
                <label>Nome:</label>
                <input type="text" name="name" placeholder="Nome Completo Do usuário" value={name} onChange={text => setName(text.target.value)}/><br/><br/>
                
                <label>Email:</label>
                <input type="email" name="email" placeholder="Informe o email" value={email} onChange={text => setEmail(text.target.value)}/><br/><br/>
                
                <label>Password:</label>
                <input type="password" name="password" placeholder="password" autoComplete="on" onChange={text => setPassword(text.target.value)}/><br/><br/>
                <button type="submit">Salvar</button>

            </form>
        </div>
    )
}