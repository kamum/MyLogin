import React, { useState, useContext } from 'react';

import {useHistory} from 'react-router-dom';

import api from '../../config/configApi';

import {Context} from '../../Context/AuthContext'

export const Login = () => {

    const history = useHistory();

    const {authenticated, signIn} = useContext(Context)

    console.log("Situação do usuário na página de login" + authenticated);

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    });
    const valorInput = e => setUser({...user, [e.target.name]: e.target.value});

    const loginSubmit = async e =>{
        e.preventDefault();
        //console.log(user.password);
        setStatus({
            loading: true
        })
        const headers = {
           'content-Type': 'application/json' 
        }

        await api.post("/login", user, { headers })
        .then((response) => {
            //console.log(response);
            setStatus({
                // type: 'Sucesso',
                // mensagem: response.data.mensagem,
                loading: false
            });
            localStorage.setItem('token', response.data.token)
            signIn(true);
            return history.push('/dashboard');
        }).catch((err) => {
            if(err.response){
                //console.log(err.response);
                setStatus({
                    type: 'Error',
                    mensagem: err.response.data.mensagem,
                    loading: false
                });
            }else{
                //onsole.log("Erro: tente mais tarde");
                setStatus({
                    type: 'Error',
                    mensagem: "Erro: tente mais tarde",
                    loading: false
                });
            }            
        });
    }

    return (
        <div>
        <h1>Login</h1>
        {status.type === 'Error'? <p>{status.mensagem}</p>: ""}
        {status.type === 'Sucesso'? <p>{status.mensagem}</p>: ""}
        {status.loading ? <p>Por favor aguarde...</p> : ""}
        <form onSubmit={loginSubmit}>
            <label>Usuário: </label>
            <input type="text" name="email" placeholder="Digite o e-mail" onChange={valorInput} /><br /><br />
            
            <label>Senha: </label>
            <input type="password" name="password" placeholder="Digite a senha" autoComplete="on" onChange={valorInput} /><br /><br />

            {status.loading ? <button type="submit" disabled>Carregando...</button> : <button type="submit">Acessar</button>}
        </form>
    </div>
    );
};